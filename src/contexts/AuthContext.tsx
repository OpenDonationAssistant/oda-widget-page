import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import axios from "axios";

export const ACCESS_TOKEN_KEY = "access-token";
export const REFRESH_TOKEN_KEY = "refresh-token";

export interface AuthContextValue {
  accessToken: string | null;
  refreshToken: string | null;
  /** Persists an access token and configures the axios default Authorization header. */
  setAccessToken: (token: string | null) => void;
  /** Persists a refresh token. */
  setRefreshToken: (token: string | null) => void;
  /** Persists both tokens and configures the axios default Authorization header. */
  setTokens: (tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  }) => void;
  /** Removes both tokens from state and storage. */
  clearTokens: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStored(key: string): string | null {
  return localStorage.getItem(key);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(() =>
    readStored(ACCESS_TOKEN_KEY),
  );
  const [refreshToken, setRefreshTokenState] = useState<string | null>(() =>
    readStored(REFRESH_TOKEN_KEY),
  );

  const setAccessToken = useCallback((token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  const setRefreshToken = useCallback((token: string | null) => {
    setRefreshTokenState(token);
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, []);

  const setTokens = useCallback(
    (tokens: { accessToken: string | null; refreshToken: string | null }) => {
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
    },
    [setAccessToken, setRefreshToken],
  );

  const clearTokens = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
  }, [setAccessToken, setRefreshToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      refreshToken,
      setAccessToken,
      setRefreshToken,
      setTokens,
      clearTokens,
    }),
    [
      accessToken,
      refreshToken,
      setAccessToken,
      setRefreshToken,
      setTokens,
      clearTokens,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

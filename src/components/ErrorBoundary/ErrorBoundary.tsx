import React, { Component, ReactNode } from "react";
import i18n from "i18next";
import { globalErrorStore } from "../../stores/ErrorStore";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("Catch error");
    if (globalErrorStore) {
      globalErrorStore.setError(i18n.t("error-occurred"), error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      return <></>;
    }

    return this.props.children;
  }
}

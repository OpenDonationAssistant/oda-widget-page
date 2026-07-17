/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { Event, EventBus, Variable } from "../../../bus/EventBus";
import { uuidv7 } from "uuidv7";

const swScope = self as unknown as ServiceWorkerGlobalScope;

const recipientService = RecipientService(undefined, "https://api.oda.digital");

const connectedTokens: string[] = [];

export function register(
  token: string,
  eventbus: EventBus,
  sw: ServiceWorkerGlobalScope,
): void {
  console.log({ connected: connectedTokens }, "add twitch-listener");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  recipientService.listTokens(auth).then((tokens) => {
    tokens.data
      .filter((token) => token.system === "Twitch")
      .filter((token) => !connectedTokens.includes(token.id))
      .forEach((token) => {
        console.log(`add handler for ${token.id}`);
        connectedTokens.push(token.id);
        recipientService
          .getAccessToken({ refreshTokenId: token.id }, auth)
          .then((response) =>
            startWebSocketClient(response.data.token, eventbus),
          );
      });
  });
}

/// <reference lib="webworker" />

import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { createClient, type MessageData } from "@retconned/kick-js";
import { Event, EventBus, Variable } from "../../../bus/EventBus";
import { uuidv7 } from "uuidv7";

const swScope = self as unknown as ServiceWorkerGlobalScope;

const recipientService = RecipientService(undefined, "https://api.oda.digital");

const connectedSlugs: string[] = [];

function getSlug(token: {
  token: string;
  settings: { [key: string]: unknown };
}): string {
  if (typeof token.settings.slug === "string" && token.settings.slug) {
    return token.settings.slug as string;
  }
  if (typeof token.settings.name === "string" && token.settings.name) {
    return (token.settings.name as string).toLowerCase();
  }
  return token.token;
}

function handleChatMessage(message: MessageData, eventbus: EventBus): void {
  const variables: Variable[] = [
    {
      id: uuidv7(),
      name: "sender_username",
      value: message.sender.username,
      type: "string",
    },
    {
      id: uuidv7(),
      name: "message_text",
      value: message.content,
      type: "string",
    },
    {
      id: uuidv7(),
      name: "message_id",
      value: message.id,
      type: "string",
    },
  ];
  eventbus.push(new Event("KICK_CHAT_MESSAGE", variables));
}

function startKickClient(slug: string, eventbus: EventBus): void {
  console.log({ slug }, "Starting Kick chat client");
  const client = createClient(slug, {
    readOnly: true,
    logger: true,
  });

  client.on("ready", () => {
    console.log(`Connected to Kick chat for channel: ${slug}`);
  });

  client.on("ChatMessage", (message: MessageData) => {
    handleChatMessage(message, eventbus);
  });

  client.on("disconnect", () => {
    console.log(`Disconnected from Kick chat for channel: ${slug}`);
    const index = connectedSlugs.indexOf(slug);
    if (index !== -1) {
      connectedSlugs.splice(index, 1);
    }
  });

  client.on("error", (error) => {
    console.error(`Kick chat error for channel ${slug}:`, error);
  });
}

export function register(
  token: string,
  eventbus: EventBus,
  sw: ServiceWorkerGlobalScope,
): void {
  console.log({ connected: connectedSlugs }, "add kick-listener");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  recipientService.listTokens(auth).then((tokens) => {
    tokens.data
      .filter((token) => token.system === "Kick")
      .filter((token) => !connectedSlugs.includes(getSlug(token)))
      .forEach((token) => {
        const slug = getSlug(token);
        console.log(`add kick handler for ${slug}`);
        connectedSlugs.push(slug);
        startKickClient(slug, eventbus);
      });
  });
}

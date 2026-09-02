import { Emotes } from "../../../bus/EventBus";
import { EmoteItem, EmotesStore } from "../../../stores/EmotesStore";

function emoteToEventEmote(emote: EmoteItem): Emotes {
  return {
    type: emote.type ?? "",
    name: emote.code,
    id: emote.id,
    gif: false,
    urls: { "1": emote.link, "2": emote.link, "4": emote.link },
    start: 0,
    end: 0,
  };
}

/**
 * Split incoming chat text into words, look each word up as an emote code in
 * the emotes store, and return the found emotes in the shape expected by
 * EventBus consumers.
 */
export function emotesFromText(
  text: string,
  emotesStore: EmotesStore,
): Emotes[] {
  return text
    .split(/[^\p{L}\p{N}]+/u)
    .map((word) => emotesStore.getEmote(word))
    .filter((emote): emote is EmoteItem => Boolean(emote))
    .map(emoteToEventEmote);
}

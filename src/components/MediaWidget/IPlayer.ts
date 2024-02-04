import { Song } from "./types";

interface IPlayer {
  id: string;
	play(song: Song): void;
}

export { IPlayer };

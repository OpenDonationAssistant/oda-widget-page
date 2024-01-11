import { Song } from "./types";

export interface IPlayer {
	play(song: Song): void;
}

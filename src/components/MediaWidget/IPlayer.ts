import { Song } from "./types";

export enum PlayerState{
  PLAYING,
  PAUSED,
  STOPPED
}

export interface IPlayer {
  id: string;
	play(song: Song): void;
}

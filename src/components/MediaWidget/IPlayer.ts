import { Song } from "./types";

export enum PlayerState{
  PLAYING,
  PAUSED,
  STOPPED
}

export interface IPlayer {
	play(song: Song): void;
}

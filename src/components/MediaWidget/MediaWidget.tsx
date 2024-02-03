import React from "react";
import { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLoaderData, useNavigate } from "react-router";
import "./MediaWidget.css";
import { PlaylistController } from "./PlaylistController";
import { setupCommandListener } from "../../socket";
import Menu from "../Menu/Menu";
import { PaymentPageConfig } from "./PaymentPageConfig";
import RequestsDisabledWarning from "./RequestsDisabledWarning";
import MenuEventButton from "../Menu/MenuEventButton";
import MenuButton from "../Menu/MenuButton";
import { PLAYLIST_TYPE, Playlist } from "../../logic/playlist/Playlist";
import { IPlaylistChangesListener } from "../../logic/playlist/PlaylistChangesListener";
import PlaylistComponent from "./PlaylistComponent";
import VideoJSComponent from "./VideoJSComponent";
import { Song } from "./types";
import { log } from "../../logging";

export default function MediaWidget({}: {}) {
  const { recipientId, conf, widgetId } = useLoaderData();

  const [playlist, setPlaylist] = useState<Playlist>(
    new Playlist(PLAYLIST_TYPE.REQUESTED),
  );
  const [playlistSize, setPlaylistSize] = useState<number>(0);
  const [index, setIndex] = useState<number>(-1);
  const paymentPageConfig = useRef<PaymentPageConfig>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(PLAYLIST_TYPE.REQUESTED);
  const playlistController = useRef<PlaylistController>();
  const [song, setSong] = useState<Song|null>(null);

  useEffect(() => {
    const playlistListener: IPlaylistChangesListener = {
      id: widgetId,
      trigger(playlist: Playlist) {
        log.debug(`updating MediaWidget because of changes in Playlist`);
        setPlaylistSize(playlist.songs().length);
        setIndex(playlist.index() ?? -1);
        setActiveTab(playlist.type());
        setSong(playlist.song());
      },
    };
    setupCommandListener(widgetId, () => navigate(0));
    paymentPageConfig.current = new PaymentPageConfig();
    playlistController.current = new PlaylistController(
      recipientId,
      widgetId,
      conf,
    );
    playlistController.current.addPlaylistRenderer({
      id: widgetId,
      bind: (playlist: Playlist) => {
        setPlaylist(playlist);
        playlist.addListener(playlistListener);
      },
      unbind: (playlist: Playlist) => {
        playlist.removeListener(widgetId);
      },
      playlistController: playlistController.current,
    });
  }, [recipientId, widgetId]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {background-color: black;height:100%;}`,
        }}
      />
      <div className="video-container" data-vjs-player>
        <RequestsDisabledWarning />
        {song && playlistController.current && <VideoJSComponent playlistController={playlistController.current} song={song}/>}
        <div className="playlist-controls">
          <Menu>
            <MenuEventButton text="Hide/Show video" event="toggleVideo" />
            <MenuButton
              text="Toggle music requests"
              handler={() => {
                paymentPageConfig.current?.toggleMediaRequests();
                paymentPageConfig.current?.save();
              }}
            />
          </Menu>
          <ul className="playlist-tabs nav nav-underline">
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === PLAYLIST_TYPE.REQUESTED ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab(PLAYLIST_TYPE.REQUESTED);
                  playlistController.current?.switchTo(PLAYLIST_TYPE.REQUESTED);
                }}
              >
                Requested
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === PLAYLIST_TYPE.PERSONAL ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab(PLAYLIST_TYPE.PERSONAL);
                  playlistController.current?.switchTo(PLAYLIST_TYPE.PERSONAL);
                }}
              >
                Personal
              </a>
            </li>
          </ul>
          <div className="video-counter">
            {`${index + 1} / ${playlistSize}`}
          </div>
        </div>
        {playlist && <PlaylistComponent playlist={playlist} />}
      </div>
    </>
  );
}

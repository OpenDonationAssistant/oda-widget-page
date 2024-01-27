import React from "react";
import { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLoaderData, useNavigate } from "react-router";
import "./MediaWidget.css";
import { v4 as uuidv4 } from "uuid";
import PlaylistComponent from "./PlaylistComponent";
import Player from "./Player";
import { PLAYLIST_TYPE, PlaylistController } from "./PlaylistController";
import { setupCommandListener, subscribe } from "../../socket";
import Menu from "../Menu/Menu";
import { PaymentPageConfig } from "./PaymentPageConfig";
import { log } from "../../logging";
import RequestsDisabledWarning from "./RequestsDisabledWarning";
import MenuEventButton from "../Menu/MenuEventButton";
import MenuButton from "../Menu/MenuButton";
import { Song } from "./types";

export default function MediaWidget({}: {}) {
  const { recipientId, conf, widgetId } = useLoaderData();

  const [playlistSize, setPlaylistSize] = useState<number>(0);
  const [index, setIndex] = useState<number>(-1);
  const paymentPageConfig = useRef<PaymentPageConfig>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(PLAYLIST_TYPE.REQUESTED);
  const playlistController = useRef<PlaylistController>(
    new PlaylistController(
      recipientId,
      // todo убрать/заменить на сигналы/эвенты
      (tab: PLAYLIST_TYPE) => {
        setActiveTab(tab);
        log.debug(`using tab ${tab}`);
      },
    ),
  );
  playlistController.current.addPlaylist({
    setPlaylist: (songs: Song[]) => {
      setPlaylistSize(songs.length);
    },
    setCurrent: setIndex,
    playlistController: playlistController.current,
  });

  useEffect(() => {
    // todo вытащить в playlistController
    subscribe(widgetId, conf.topic.media, (message) => {
      let json = JSON.parse(message.body);
      let song = {
        src: json.url,
        type: "video/youtube",
        id: uuidv4(),
        originId: json.id,
        owner: "Аноним",
        title: json.title,
        listened: false
      };
      playlistController.current?.handleNewRequestedSongEvent(song);
      message.ack();
    });
    setupCommandListener(widgetId, () => navigate(0));
    paymentPageConfig.current = new PaymentPageConfig();
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
        {playlistController.current && (
          <Player
            tab={activeTab}
            playlistController={playlistController.current}
          />
        )}
        <div className="playlist-controls">
          <Menu>
            <MenuEventButton text="Hide/Show video" event="toggleVideo" />
            <MenuButton
              text="Toggle music requests"
              handler={() => paymentPageConfig.current?.toggleMediaRequests()}
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
                  playlistController.current?.switchToRequested();
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
                  playlistController.current?.switchToFallback();
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
        {playlistController.current && (
          <>
            <PlaylistComponent playlistController={playlistController.current} />
          </>
        )}
      </div>
    </>
  );
}

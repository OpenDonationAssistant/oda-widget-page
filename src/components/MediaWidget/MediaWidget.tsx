import React from "react";
import { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLoaderData, useNavigate } from "react-router";
import "./MediaWidget.css";
import { v4 as uuidv4 } from "uuid";
import Playlist from "./Playlist";
import Player from "./Player";
import { PLAYLIST_TYPE, PlaylistController } from "./PlaylistController";
import { setupCommandListener, subscribe } from "../../socket";
import Menu from "../Menu/Menu";
import { PaymentPageConfig } from "./PaymentPageConfig";
import { log } from "../../logging";
import RequestsDisabledWarning from "./RequestsDisabledWarning";
import MenuEventButton from "../Menu/MenuEventButton";
import MenuButton from "../Menu/MenuButton";

export default function MediaWidget({}: {}) {
  const [playlist, setPlaylist] = useState([]);
  const [current, setCurrent] = useState(0);
  const playlistController = useRef<PlaylistController>(null);
  const paymentPageConfig = useRef<PaymentPageConfig>();
  const navigate = useNavigate();
  const { recipientId, conf, widgetId } = useLoaderData();
  const [activeTab, setActiveTab] = useState(PLAYLIST_TYPE.REQUESTED);
  const [requestsEnabled, setRequestsEnabled] = useState(true);

  useEffect(() => {
    playlistController.current = new PlaylistController(
      recipientId,
      setPlaylist,
      setCurrent,
      (tab) => {
        setActiveTab(tab);
        log.debug(`using tab ${tab}`);
      },
    );
    subscribe(widgetId, conf.topic.media, (message) => {
      let json = JSON.parse(message.body);
      let song = {
        src: json.url,
        type: "video/youtube",
        id: uuidv4(),
        originId: json.id,
        owner: "Аноним",
        title: json.title,
      };
      playlistController.current?.handleNewRequestedSongEvent(song);
      message.ack();
    });
    setupCommandListener(widgetId, () => navigate(0));
    paymentPageConfig.current = new PaymentPageConfig();
  }, [recipientId, widgetId]);

  useEffect(() => {
    function toggle(event) {
      log.debug(`toggle requests: ${event.detail}`);
      setRequestsEnabled(event.detail);
    }
    log.debug("create mediawidget listener for media-requests toggler");
    document.addEventListener("toggleMediaRequests", toggle);
    return () => {
      log.debug("destroy mediawidget listener for media-requests toggler");
      document.removeEventListener("toggleMediaRequests", toggle);
    };
  }, [widgetId]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {background-color: black;height:100%;}`,
        }}
      />
      <div className="video-container" data-vjs-player>
        <RequestsDisabledWarning />
        <Player
          playlist={playlist}
          tab={activeTab}
          current={current}
          updateCurrentFn={(newIndex) =>
            playlistController.current.updateIndex(newIndex)
          }
        />
        <div className="playlist-controls">
          <Menu>
            <MenuEventButton text="Hide/Show video" event="toggleVideo" />
            <MenuButton
              text={
                requestsEnabled
                  ? "Disable music requests"
                  : "Enable music request"
              }
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
            {`${playlist[current] ? current + 1 : 0} / ${
              playlist[current] ? playlist.length : 0
            }`}
          </div>
        </div>
        <Playlist
          recipientId={recipientId}
          playlist={playlist}
          current={current}
          updatePlaylistFn={(newPlaylist) =>
            playlistController.current.updatePlaylist(newPlaylist)
          }
          playFn={(newIndex) =>
            playlistController.current.updateIndex(newIndex)
          }
        />
      </div>
    </>
  );
}

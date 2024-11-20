import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { findSetting } from "../utils";
import { useLoaderData } from "react-router";
import AddMediaPopup from "./AddMediaPopup";
import { PLAYLIST_TYPE, Playlist } from "../../logic/playlist/Playlist";
import { Provider, Song } from "./types";
import { WidgetData } from "../../types/WidgetData";
import { useTranslation } from "react-i18next";
import classes from "./PlaylistComponent.module.css";

export default function PlaylistComponent({
  playlist,
}: {
  playlist: Playlist;
}) {
  const { settings, widgetId } = useLoaderData() as WidgetData;
  const activeRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [urlToCopy, setUrlToCopy] = useState<string>("");
  const { t } = useTranslation();

  function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }
    const { destination, source } = result;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    playlist.moveSong(source.index, destination.index);
  }

  useEffect(() => {
    playlist.addListener({
      id: `${widgetId}_playlist`,
      trigger(playlist: Playlist) {
        setSongs(playlist.songs());
        setCurrent(playlist.index());
      },
    });
    // todo cleanup function
  }, [playlist]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView();
    }
  }, [current]);

  const playlistSongTitleFontSize = findSetting(
    settings,
    "playlistSongTitleFontSize",
    "24px",
  );
  const playlistSongTitleStyle = playlistSongTitleFontSize
    ? { fontSize: playlistSongTitleFontSize + "px" }
    : {};

  const playlistNicknameFontSize = findSetting(
    settings,
    "playlistNicknameFontSize",
    "24px",
  );
  const playlistNicknameStyle = playlistNicknameFontSize
    ? { fontSize: playlistNicknameFontSize + "px" }
    : {};

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="playlist">
          {(provided) => (
            <div
              id="playlist"
              key="playlist"
              ref={provided.innerRef}
              className="playlist"
            >
              <ul {...provided.droppableProps} className="list-group">
                {songs.map((song, index) => {
                  return (
                    <Draggable
                      key={song.id}
                      draggableId={song.id}
                      index={index}
                    >
                      {(draggable) => (
                        <li
                          ref={draggable.innerRef}
                          {...draggable.draggableProps}
                          {...draggable.dragHandleProps}
                          key={song.id}
                          className={`list-group-item ${
                            index === current ? classes.current : ""
                          } ${classes.listgroupitem}`}
                        >
                          <img
                            src={`${
                              song.provider === Provider.VK
                                ? "/icons/vkontakte.png"
                                : "/icons/youtube.png"
                            }`}
                            alt="youtube"
                            className={`${classes.providericon}`}
                          />
                          <div>
                            <div className="item-buttons">
                              <button
                                className="btn btn-outline-light play"
                                onClick={() => {
                                  const id = playlist.song()?.id;
                                  if (id) {
                                    playlist.markListened(id);
                                  }
                                  playlist.setIndex(index);
                                }}
                              >
                                <span className="material-symbols-sharp">
                                  play_circle
                                </span>
                              </button>
                              <button
                                className="btn btn-outline-light share"
                                onClick={() => {
                                  window.open(
                                    song.src,
                                    undefined,
                                    "popup=true",
                                  );
                                }}
                              >
                                <span className="material-symbols-sharp">
                                  share
                                </span>
                              </button>
                              <button
                                className="btn btn-outline-light delete"
                                onClick={() => playlist.removeSong(index)}
                              >
                                <span className="material-symbols-sharp">
                                  delete
                                </span>
                              </button>
                            </div>
                            {index === current && (
                              <div
                                style={playlistSongTitleStyle}
                                className="song-title"
                                ref={activeRef}
                              >
                                {index + 1}. {song.title}
                              </div>
                            )}
                            {index !== current && (
                              <div
                                style={playlistSongTitleStyle}
                                className="song-title"
                              >
                                {index + 1}. {song.title}
                              </div>
                            )}
                            <div
                              style={playlistNicknameStyle}
                              className="owner"
                            >
                              {" "}
                              Заказал: {song.owner}
                            </div>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
              <div className={`link-popup ${urlToCopy ? "" : "hidden"}`}>
                <input value={urlToCopy} />
                <button
                  id="close-add-media-popup"
                  onClick={() => setUrlToCopy("")}
                >
                  <span className="material-symbols-sharp">close</span>
                </button>
              </div>
              <AddMediaPopup playlist={playlist} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

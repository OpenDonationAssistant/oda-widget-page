import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { findSetting } from "../utils";
import { useLoaderData } from "react-router";
import AddMediaPopup from "./AddMediaPopup";
import { Playlist } from "../../logic/playlist/Playlist";
import { Song } from "./types";

export default function PlaylistComponent({
  playlist
}: {
  playlist: Playlist
}) {
  const { recipientId, settings, widgetId } = useLoaderData();
  const activeRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<number|null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  function onDragEnd(result) {
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
      trigger(playlist: Playlist){
        setSongs(playlist.songs());
        setCurrent(playlist.index());
      }
    });
    // todo cleanup function
  },[playlist]);

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
                  <Draggable key={song.id} draggableId={song.id} index={index}>
                    {(draggable) => (
                      <li
                        ref={draggable.innerRef}
                        {...draggable.draggableProps}
                        {...draggable.dragHandleProps}
                        key={song.id}
                        className={`list-group-item ${
                          index === current ? "active" : ""
                        }`}
                      >
                        <div className="item-buttons">
                          <button
                            className="btn btn-outline-light play"
                            onClick={() => {
                              const id = playlist.song()?.id
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
                            onClick={() =>
                              navigator.clipboard.writeText(song.src)
                            }
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
                        <div style={playlistNicknameStyle} className="owner">
                          {" "}
                          Заказал: {song.owner}
                        </div>
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
            <div className="add-button-container">
              <button
                className="btn btn-outline-light add"
                onClick={() => {
                  document.dispatchEvent(
                    new CustomEvent("toggleAddMediaPopup"),
                  );
                }}
              >
                <span className="material-symbols-sharp">add</span>
              </button>
            </div>
            <AddMediaPopup playlist={playlist} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

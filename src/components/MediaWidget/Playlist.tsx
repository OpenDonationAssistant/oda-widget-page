import React from "react";
import { useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { findSetting } from "../utils";
import { useLoaderData } from "react-router";
import AddMediaPopup from "./AddMediaPopup";

export default function Playlist({
  playlist,
  current,
  playFn,
  updatePlaylistFn,
}) {
  const activeRef = useRef();
  const { settings } = useLoaderData();

  function remove(index) {
    try {
      axios
        .patch(
          process.env.REACT_APP_API_ENDPOINT +
            "/media/" +
            playlist[index > -1 ? index : 0].originId,
          {
            listened: true,
          },
        )
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
    let updated = Array.from(playlist);
    updated.splice(index, 1);
    updatePlaylistFn(updated);
  }

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

    let song = playlist[source.index];
    let updatedPlaylist = Array.from(playlist);
    updatedPlaylist.splice(source.index, 1);
    updatedPlaylist.splice(destination.index, 0, song);
    updatePlaylistFn(updatedPlaylist);
  }

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
              {playlist.map((song, number) => {
                return (
                  <Draggable key={song.id} draggableId={song.id} index={number}>
                    {(draggable) => (
                      <li
                        ref={draggable.innerRef}
                        {...draggable.draggableProps}
                        {...draggable.dragHandleProps}
                        key={song.id}
                        className={`list-group-item ${
                          number === current ? "active" : ""
                        }`}
                      >
                        <div className="item-buttons">
                          <button
                            className="btn btn-outline-light play"
                            onClick={() => {
                              playFn(number);
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
                            onClick={() => remove(number)}
                          >
                            <span className="material-symbols-sharp">
                              delete
                            </span>
                          </button>
                        </div>
                        {number === current && (
                          <div
                            style={playlistSongTitleStyle}
                            className="song-title"
                            ref={activeRef}
                          >
                            {number + 1}. {song.title}
                          </div>
                        )}
                        {number !== current && (
                          <div
                            style={playlistSongTitleStyle}
                            className="song-title"
                          >
                            {number + 1}. {song.title}
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
            <AddMediaPopup />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

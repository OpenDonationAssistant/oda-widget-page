import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useLoaderData } from "react-router";
import { log } from "../../logging";
import { Playlist } from "../../logic/playlist/Playlist";
import { Provider, Song } from "./types";
import { WidgetData } from "../../types/WidgetData";

export default function AddMediaPopup({ playlist }: { playlist: Playlist }) {
  const [showNewMediaPopup, setShowNewMediaPopup] = useState(false);
  const [savedPlaylists, setSavedPlaylists] = useState<Playlist[]>([]);
  const { recipientId } = useLoaderData() as WidgetData;

  useEffect(() => {
    function toggle() {
      setShowNewMediaPopup((value) => !value);
      if (!showNewMediaPopup) {
        document.getElementById("new-media-input")?.focus();
      }
    }
    document.addEventListener("toggleAddMediaPopup", toggle);
    return () => document.removeEventListener("toggleAddMediaPopup", toggle);
  }, [showNewMediaPopup]);

  function addVideo(videoId: string) {
    log.debug({videoId: videoId}, "adding song");
    return axios
      .get(
        `${process.env.REACT_APP_MEDIA_API_ENDPOINT}/media/available?videoId=${videoId}`,
      )
      .then((data) => data.data)
      .then((list) => {
        const songs = list.map((video) => {
          let id = uuidv4();
          let song = {
            src: `https://www.youtube.com/watch?v=${videoId}`,
            type: "video/youtube",
            id: id,
            originId: videoId, // todo remove originId?
            owner: recipientId,
            title: video.snippet.title,
            provider: Provider.YOUTUBE,
          };
          return song;
        });
        songs.forEach((song: Song) => playlist.addSong(song));
        return list.title;
      });
  }

  function addPlaylistItems(playlistId: string) {
    log.debug({playlistId: playlistId}, "adding playlist");
    return axios
      .get(
        `${process.env.REACT_APP_MEDIA_API_ENDPOINT}/media/playlists/${playlistId}`,
      )
      .then((data) => data.data)
      .then((list) => {
        const songs = list.items.map((video) => {
          let id = uuidv4();
          let song = {
            src: `https://www.youtube.com/watch?v=${video.id}`,
            type: "video/youtube",
            id: id,
            originId: id, // todo remove originId?
            owner: recipientId,
            title: video.snippet.title,
          };
          return song;
        });
        songs.forEach((song: Song) => playlist.addSong(song));
        return list.title;
      });
  }

  function addMedia(url: string) {
    log.debug({url:url}, "adding media");
    if (url.includes("playlist")) {
      const index = url.lastIndexOf("list=");
      let id = url.substring(index + 5);
      const parameterStart = id.indexOf("&");
      if (parameterStart > 0) {
        id = id.substring(0, parameterStart);
      }
      addPlaylistItems(id).then((title) => {
        const previousList = localStorage.getItem("playlists");
        let playlists: Playlist[] =
          previousList === null ? [] : JSON.parse(previousList);
        playlists.push({ title: title, id: id });
        const filteredPlaylists: Playlist[] = [];
        playlists.forEach((item) => {
          log.debug(item.title);
          if (
            !filteredPlaylists.find((filtered) => filtered.title === item.title)
          ) {
            filteredPlaylists.push(item);
          }
        });
        log.debug(`playlists: ${JSON.stringify(filteredPlaylists)}`);
        setSavedPlaylists(filteredPlaylists);
        localStorage.setItem("playlists", JSON.stringify(filteredPlaylists));
      });
    } else {
      if (url.includes("vkvideo")){
        const originId = url.replace("https://vkvideo.ru/video","");
        log.debug({vkId: originId}, "parsed vkId");
        playlist.addSong({
          id: uuidv4(),
          originId: originId,
          src: url,
          provider:  Provider.VK,
          type: "vk",
          owner: recipientId,
          title: "Unknown"
        });
      } else{
        const youtube_url_regexp = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/g;
        const videoId = youtube_url_regexp.exec(url)?.at(6);
        log.debug({videoId: videoId}, "parsed videoId");
        videoId && addVideo(videoId);
      }
    }
    document.getElementById("new-media-input").value = "";
    setShowNewMediaPopup(false);
  }

  useEffect(() => {
    const previousList = localStorage.getItem("playlists");
    const playlists = previousList === null ? [] : JSON.parse(previousList);
    setSavedPlaylists(playlists);
  }, []);

  return (
    <div
      className={`add-popup ${showNewMediaPopup ? "" : "visually-hidden"}`}
      tabIndex={-1}
    >
      <button
        id="close-add-media-popup"
        onClick={() => setShowNewMediaPopup(false)}
      >
        <span className="material-symbols-sharp">close</span>
      </button>
      <div className="add-media-popup-description">
        Введите ссылку на YouTube видео или плейлист. Плейлист должен быть
        доступен по ссылке
      </div>
      <input
        id="new-media-input"
        onChange={(e) => {
          log.debug({value:  e.target.value}, "handling input");
          addMedia(e.target.value);
        }}
      />
      <div className="saved-playlists">
        {savedPlaylists.map((playlist) => (
          <button
            key={playlist.id}
            className="saved-playlist-item"
            onClick={() => {
              addPlaylistItems(playlist.id);
              setShowNewMediaPopup(false);
            }}
          >
            {playlist.title}
          </button>
        ))}
      </div>
    </div>
  );
}

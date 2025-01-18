import classes from "./PlaylistActionPanel.module.css";
import { Flex, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { PLAYLIST_TYPE } from "../../logic/playlist/Playlist";
import { PlaylistController } from "./PlaylistController";
import {
  DefaultApiFactory as MediaService,
  PlaylistDto,
} from "@opendonationassistant/oda-media-service-client";
import LabeledContainer from "../LabeledContainer/LabeledContainer";
import { uuidv7 } from "uuidv7";
import { Provider } from "./types";
import { useTranslation } from "react-i18next";

interface SavedPlaylist {
  id: string;
  name: string;
}

export default function PlaylistActionPanel({
  type,
  controller,
}: {
  type: PLAYLIST_TYPE;
  controller: PlaylistController;
}) {
  const [repeat, enableRepeat] = useState<boolean>(false);
  const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[]>([]);
  const [showSavedPlaylists, setShowSavedPlaylists] = useState<boolean>(false);
  const [showEditNameModal, setShowEditNameModal] = useState<boolean>(false);
  const [playlistName, setPlaylistName] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    controller.repeat = repeat;
  }, [repeat, controller]);

  const loadPlaylists: () => Promise<void> = async () => {
    return MediaService(undefined, process.env.REACT_APP_MEDIA_API_ENDPOINT)
      .playlists({ orderBy: [], size: 100, sort: { orderBy: [] } })
      .then((res) => res.data?.content)
      .then((data) => {
        setSavedPlaylists(
          data.map((playlist: PlaylistDto) => {
            return { id: playlist.id, name: playlist.title };
          }),
        );
      });
  };

  const showModalForSavedPlaylist: () => void = () => {
    loadPlaylists().then(() => {
      setShowSavedPlaylists(true);
    });
  };

  const savePlaylist: () => Promise<void> = async () => {
    const items = controller.current.songs().map((song) => {
      return { title: song.title, src: song.src };
    });
    const playlistId = savedPlaylists.find(
      (playlist) => playlist.name === playlistName,
    )?.id;
    if (playlistId) {
      MediaService(undefined, process.env.REACT_APP_MEDIA_API_ENDPOINT).update1(
        {
          id: playlistId,
          items: items,
        },
      );
    } else {
      MediaService(undefined, process.env.REACT_APP_MEDIA_API_ENDPOINT).create({
        title: playlistName,
        items: items,
      });
    }
  };

  const deletePlaylist: (playlistId: string) => Promise<void> = async (
    playlistId: string,
  ) => {
    MediaService(undefined, process.env.REACT_APP_MEDIA_API_ENDPOINT)
      .deletePlaylist({
        id: playlistId,
      })
      .then(() => loadPlaylists());
  };

  const loadPlaylist: (playlistId: string) => Promise<void> = async (
    playlistId: string,
  ) => {
    controller.current.clear();
    MediaService(undefined, process.env.REACT_APP_MEDIA_API_ENDPOINT)
      .playlist(playlistId)
      .then((res) => {
        controller.current.clear();
        setPlaylistName(res.data.title);
        controller.current.addSongs(
          res.data.items.map((item) => {
            return {
              src: item.src,
              title: item.title,
              id: uuidv7(),
              originId: null,
              owner: "",
              type: "video/youtube",
              provider: item.src.includes("vkvideo")
                ? Provider.VK
                : Provider.YOUTUBE,
            };
          }),
        );
      });
    setShowSavedPlaylists(false);
  };

  return (
    <>
      <Flex justify="center" className={`${classes.panelcontainer}`}>
        <div className={`${classes.panel}`}>
          <button
            onClick={() => {
              document.dispatchEvent(new CustomEvent("toggleAddMediaPopup"));
            }}
          >
            <span className="material-symbols-sharp">playlist_add</span>
          </button>
          <button onClick={() => controller.clearCurrentPlaylist()}>
            <img
              src="/icons/broom.png"
              alt="repeat"
              style={{ height: 24, filter: "invert(1)" }}
            />
          </button>
          <button
            className="repeat-button"
            onClick={() => enableRepeat((old) => !old)}
          >
            <span className="material-symbols-sharp">
              {repeat ? "repeat_on" : "repeat"}
            </span>
          </button>
          {type === PLAYLIST_TYPE.PERSONAL && (
            <>
              <button
                onClick={() => {
                  setShowEditNameModal(true);
                }}
              >
                <span className="material-symbols-sharp">save</span>
              </button>
              <button>
                <span
                  className="material-symbols-sharp"
                  onClick={showModalForSavedPlaylist}
                >
                  queue_music
                </span>
              </button>
              <Modal
                className={`${classes.modal}`}
                title={t("saved-playlist-label")}
                footer={null}
                open={showSavedPlaylists}
                onClose={() => setShowSavedPlaylists(false)}
                onCancel={() => setShowSavedPlaylists(false)}
              >
                <Flex
                  vertical={true}
                  gap={10}
                  className={`${classes.savedPlaylists}`}
                >
                  {savedPlaylists.map((playlist) => (
                    <Flex className="full-width">
                      <button
                        className="oda-btn-default"
                        style={{ flex: "1 1 auto" }}
                        onClick={() => loadPlaylist(playlist.id)}
                      >
                        {playlist.name}
                      </button>
                      <button
                        className={`${classes.deletebutton}`}
                        onClick={() => deletePlaylist(playlist.id)}
                      >
                        <span className="material-symbols-sharp">delete</span>
                      </button>
                    </Flex>
                  ))}
                </Flex>
              </Modal>
              <Modal
                className={`${classes.modal}`}
                title={t("button-edit-playlist-name")}
                open={showEditNameModal}
                onOk={() => {
                  savePlaylist();
                  setShowEditNameModal(false);
                }}
                onCancel={() => setShowEditNameModal(false)}
              >
                <LabeledContainer
                  className={`${classes.editPlaylistNameInput}`}
                  displayName={t("playlist-name-label")}
                >
                  <Input
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                  />
                </LabeledContainer>
              </Modal>
            </>
          )}
        </div>
      </Flex>
    </>
  );
}

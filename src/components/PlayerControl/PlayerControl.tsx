import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useLoaderData } from "react-router";
import { publish } from "../../socket";
import { v4 as uuidv4 } from "uuid";

export default function PlayerControl({}: {}) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [volume, setVolume] = useState<string>("0.5");
  const { recipientId, conf } = useLoaderData();

  function reload() {
    publish(conf.topic.mediaWidgetCommands, { command: "reload" });
  }

  function add() {
    if (url.includes("playlist")) {
      const index = url.lastIndexOf("list=");
      const id = url.substring(index + 5);
      axios
        .get(
          `${process.env.REACT_APP_MEDIA_API_ENDPOINT}/media/playlists/${id}`,
        )
        .then((data) => data.data)
        .then((videos) => {
          videos.map((video) => {
            console.log(video);
            let id = uuidv4();
            publish(conf.topic.media, {
              id: id,
              url: `https://www.youtube.com/watch?v=${video.id}`,
              recipientId: recipientId,
              title: video.snippet.title,
            });
          });
        });
    } else {
      let id = uuidv4();
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/media?url=${url}`)
        .then((json) => {
          publish(conf.topic.media, {
            id: id,
            url: url,
            recipientId: recipientId,
            title: json.data.title,
          });
        });
    }
  }

  function check() {
    try {
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/media?url=${url}`)
        .then(() => {
          setResult("OK");
        })
        .catch(() => setResult("FAIL"));
    } catch (e) {
      setResult("FAIL");
    }
  }

  function pause() {
    publish(conf.topic.playerCommands, { command: "pause" });
  }

  function play() {
    publish(conf.topic.playerCommands, { command: "play" });
  }

  function changeVolume() {
    publish(conf.topic.playerCommands, {
      command: "volume",
      value: volume,
    });
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {background-color: rgb(25,27,27);}`,
        }}
      />
      <div>
        {result && (
          <span style={{ color: "white", marginRight: "10px" }}>{result}</span>
        )}
        <input
          value={url}
          onChange={(e) => {
            let value = e.target.value;
            setUrl(value);
          }}
          style={{ width: "600px", marginRight: "10px" }}
        />
        <button
          className="btn btn-primary"
          onClick={() => add()}
          style={{ marginRight: "10px" }}
        >
          Add
        </button>
        <button
          className="btn btn-primary"
          onClick={() => check()}
          style={{ marginRight: "10px" }}
        >
          Check
        </button>
        <button
          className="btn btn-primary"
          onClick={() => play()}
          style={{ marginRight: "10px" }}
        >
          Play
        </button>
        <button
          className="btn btn-primary"
          onClick={() => pause()}
          style={{ marginRight: "10px" }}
        >
          Pause
        </button>
      </div>
      <div>
        <input
          value={volume}
          onChange={(e) => {
            let value = e.target.value;
            setVolume(value);
          }}
        />
        <button className="btn btn-primary" onClick={() => changeVolume()}>
          Set volume
        </button>
      </div>
    </>
  );
}

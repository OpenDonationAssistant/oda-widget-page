import axios from "axios";
import { ChangeEvent, ReactNode } from "react";
import { uuidv7 } from "uuidv7";

export const getRndInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export async function uploadBlob(data: Blob | File, name: string, isPublic: boolean = false) {
  const response = await axios.put(
    `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${name}?public=${isPublic}`,
    { file: data },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  const _ = response.data;
  return { "url": `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${name}`, "name": name };
}

export const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) {
    return Promise.reject();
  }
  const file = e.target.files[0];
  const name = uuidv7();
  return uploadBlob(file, name).then((result) => {
    return { url: result.url, name: result.name, originalName: file.name };
  })
};

export const fullUri = async (url: string | null): Promise<string> => {
  if (!url) {
    return Promise.resolve("");
  }
  let urlToFetch = url;
  if (!url.startsWith("http")) {
    urlToFetch = `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${url}`;
  }
  // TODO: вынести в общий модуль
  return fetch(urlToFetch, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access-token")}`,
    },
  })
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob));
};

export function loadAudio(name: string): Promise<ArrayBuffer | void> {
  if (!name) {
    return Promise.resolve();
  }
  let url = name;
  if (!name.startsWith("http")) {
    url = `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${name}`;
  }
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access-token")}`,
    },
  }).then((response) => response.arrayBuffer());
}

export const delay = (ms: number) => {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface Renderable {
  markup: ReactNode;
}

export function deepEqual(x: any, y: any): boolean {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y,
    isDate = x instanceof Date && y instanceof Date;
  if (isDate) {
    return x.getTime() === y.getTime();
  }
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y;
}

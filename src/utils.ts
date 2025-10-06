import axios from "axios";
import { ReactNode } from "react";

export const getRndInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export async function uploadBlob(data: Blob, name: string) {
  const response = await axios.put(
    `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${name}`,
    { file: data },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  const _ = response.data;
  return `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${name}`;
}

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

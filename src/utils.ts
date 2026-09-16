import axios from "axios";
import { ChangeEvent, ReactNode } from "react";
import { uuidv7 } from "uuidv7";
import { Event } from "./bus/EventBus";
import { onWorkerMessage, sendMessageToWorker } from "./worker";

export { sendMessageToWorker };

export class ObjectWrapper<T> {
  constructor(public value: T | null) {}
}

export const getRndInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export function onEvent(fn: (event: Event) => void) {
  return onWorkerMessage((data) => {
    fn(new Event(data._type, data._variables, data._timestamp));
  });
}

export type ImageFormat =
  | "png"
  | "jpeg"
  | "gif"
  | "webp"
  | "bmp"
  | "ico"
  | "avif"
  | "heic"
  | "svg"
  | "unknown";

export const DEFAULT_WEBP_QUALITY = 0.9;

const HEADER_BYTES = 32;

/** Byte patterns that identify each supported image container. */
interface FormatSignature {
  format: ImageFormat;
  parts: ReadonlyArray<{ bytes: ReadonlyArray<number>; offset: number }>;
}

const IMAGE_SIGNATURES: ReadonlyArray<FormatSignature> = [
  {
    format: "png",
    parts: [
      { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], offset: 0 },
    ],
  },
  { format: "jpeg", parts: [{ bytes: [0xff, 0xd8, 0xff], offset: 0 }] },
  { format: "gif", parts: [{ bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 }] },
  {
    format: "webp",
    parts: [
      { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // "RIFF"
      { bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 }, // "WEBP"
    ],
  },
  { format: "bmp", parts: [{ bytes: [0x42, 0x4d], offset: 0 }] },
  { format: "ico", parts: [{ bytes: [0x00, 0x00, 0x01, 0x00], offset: 0 }] },
];

/** ISO-BMFF brands mapped to AVIF/HEIF. */
const HEIF_BRANDS: Readonly<Record<string, ImageFormat>> = {
  avif: "avif",
  avis: "avif",
  heic: "heic",
  heix: "heic",
  heif: "heic",
  hevc: "heic",
  mif1: "heic",
  msf1: "heic",
};

/** Fallback when the bytes carry no recognizable signature. */
const MIME_FORMATS: Readonly<Record<string, ImageFormat>> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/bmp": "bmp",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heic",
  "image/svg+xml": "svg",
};

/**
 * Formats worth re-encoding: lossless or poorly compressed rasters.
 * Excluded on purpose: `webp` (already the target), `gif` (re-encoding would
 * drop animation), `svg` (vector, `createImageBitmap` cannot decode it),
 * `ico` (multi-size container) and `unknown`.
 */
const WEBP_CONVERTIBLE: ReadonlySet<ImageFormat> = new Set<ImageFormat>([
  "png",
  "jpeg",
  "bmp",
  "avif",
  "heic",
]);

function bytesMatch(
  bytes: Uint8Array,
  part: { bytes: ReadonlyArray<number>; offset: number },
): boolean {
  return part.bytes.every((byte, index) => bytes[part.offset + index] === byte);
}

function decodeAscii(
  bytes: Uint8Array,
  offset: number,
  length: number,
): string {
  return String.fromCharCode(...bytes.slice(offset, offset + length));
}

function isHeif(bytes: Uint8Array): boolean {
  return (
    decodeAscii(bytes, 4, 4) === "ftyp" &&
    HEIF_BRANDS[decodeAscii(bytes, 8, 4)] !== undefined
  );
}

function readHeader(data: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () =>
      reject(reader.error ?? new Error("Unable to read blob header"));
    reader.readAsArrayBuffer(data.slice(0, HEADER_BYTES));
  });
}

/**
 * Sniff the real image format from the blob's magic bytes, falling back to the
 * declared MIME type. Returns `"unknown"` for everything that is not an image.
 */
export async function detectImageFormat(data: Blob): Promise<ImageFormat> {
  let bytes: Uint8Array;
  try {
    bytes = await readHeader(data);
  } catch {
    bytes = new Uint8Array();
  }
  const signature = IMAGE_SIGNATURES.find((candidate) =>
    candidate.parts.every((part) => bytesMatch(bytes, part)),
  );
  if (signature) {
    return signature.format;
  }
  if (isHeif(bytes)) {
    return HEIF_BRANDS[decodeAscii(bytes, 8, 4)];
  }
  if (decodeAscii(bytes, 0, 4).toLowerCase() === "<svg") {
    return "svg";
  }
  return MIME_FORMATS[data.type.toLowerCase()] ?? "unknown";
}

/** Swap the trailing extension of a file name, appending one when absent. */
export function replaceExtension(name: string, extension: string): string {
  return `${name.replace(/\.[^./\\]+$/, "")}.${extension}`;
}

function encodeWithOffscreenCanvas(
  bitmap: ImageBitmap,
  quality: number,
): Promise<Blob> | null {
  if (typeof OffscreenCanvas === "undefined") {
    return null;
  }
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }
  context.drawImage(bitmap, 0, 0);
  return canvas.convertToBlob({ type: "image/webp", quality });
}

function encodeWithCanvasElement(
  bitmap: ImageBitmap,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (!context) {
      reject(new Error("Canvas 2D context is unavailable"));
      return;
    }
    context.drawImage(bitmap, 0, 0);
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("WebP encoding failed")),
      "image/webp",
      quality,
    );
  });
}

/**
 * Decode any browser-supported raster image and re-encode it as WebP.
 * Throws when the image cannot be decoded or encoded.
 */
export async function convertToWebp(
  data: Blob,
  quality: number = DEFAULT_WEBP_QUALITY,
): Promise<Blob> {
  const bitmap = await createImageBitmap(data);
  try {
    const encoded = encodeWithOffscreenCanvas(bitmap, quality);
    if (encoded) {
      return await encoded;
    }
    return await encodeWithCanvasElement(bitmap, quality);
  } finally {
    bitmap.close();
  }
}

export interface UploadBlobOptions {
  /** Set to false to upload the original bytes untouched. */
  convertToWebp?: boolean;
  /** WebP quality in the 0..1 range. Ignored when nothing is converted. */
  quality?: number;
}

export interface UploadedBlob {
  url: string;
  name: string;
  /** True when the uploaded bytes are WebP produced from another format. */
  converted: boolean;
  /** Detected source format, `"unknown"` for non-images. */
  format: ImageFormat;
}

interface PreparedUpload {
  blob: Blob;
  name: string;
  converted: boolean;
  format: ImageFormat;
}

function uploadUnchanged(
  data: Blob,
  name: string,
  format: ImageFormat,
): PreparedUpload {
  return { blob: data, name, converted: false, format };
}

/**
 * Return the bytes and file name to upload: WebP for convertible images,
 * the original data for anything else.
 */
export async function prepareUpload(
  data: Blob | File,
  name: string,
  shouldConvert: boolean,
  quality: number,
): Promise<PreparedUpload> {
  const format = await detectImageFormat(data);
  if (!shouldConvert || !WEBP_CONVERTIBLE.has(format)) {
    return uploadUnchanged(data, name, format);
  }
  try {
    return {
      blob: await convertToWebp(data, quality),
      name: replaceExtension(name, "webp"),
      converted: true,
      format,
    };
  } catch {
    // A failed conversion must never block the upload — send the original and
    // let the caller observe it through `converted: false`.
    return uploadUnchanged(data, name, format);
  }
}

/**
 * Upload a file, transparently converting images to WebP first.
 * Non-images and formats WebP cannot represent faithfully are uploaded as-is.
 */
export async function uploadBlob(
  data: Blob | File,
  name: string,
  isPublic: boolean = false,
  options: UploadBlobOptions = {},
): Promise<UploadedBlob> {
  const {
    convertToWebp: shouldConvert = true,
    quality = DEFAULT_WEBP_QUALITY,
  } = options;
  const prepared = await prepareUpload(data, name, shouldConvert, quality);
  await axios.put(
    `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${prepared.name}?public=${isPublic}`,
    { file: prepared.blob },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return {
    url: `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${prepared.name}`,
    name: prepared.name,
    converted: prepared.converted,
    format: prepared.format,
  };
}

export const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) {
    return Promise.reject();
  }
  const file = e.target.files[0];
  const name = uuidv7();
  return uploadBlob(file, name).then((result) => {
    return { url: result.url, name: result.name, originalName: file.name };
  });
};

export const downloadFile = async (url: string | null): Promise<Blob> => {
  if (!url) {
    return Promise.resolve(new Blob());
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
  }).then((res) => res.blob());
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
  const headers =
    url.indexOf("oda-shared") !== -1
      ? undefined
      : {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        };
  return fetch(url, {
    method: "GET",
    headers: headers,
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

export function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i); // hash * 31 + char
    hash |= 0; // force 32-bit int
  }
  return hash; // signed 32-bit
}

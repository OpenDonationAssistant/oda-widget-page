// `utils` imports the SharedWorker singleton and the event bus, which drag in
// the whole worker/IPC + STOMP handler chain. Mock both so the pure image
// helpers can be tested in isolation.
jest.mock("./worker", () => ({
  onWorkerMessage: jest.fn(() => () => {}),
  sendMessageToWorker: jest.fn(),
}));

jest.mock("./bus/EventBus", () => ({ Event: class Event {} }));

// `uuidv7` publishes ESM only, which CRA's Jest (CJS) cannot transform.
jest.mock("uuidv7", () => ({
  uuidv7: jest.fn(() => "00000000-0000-7000-8000-000000000000"),
}));

import {
  DEFAULT_WEBP_QUALITY,
  detectImageFormat,
  prepareUpload,
  replaceExtension,
} from "./utils";

/** Build a byte header by placing each segment at its absolute offset. */
const bytesAt = (
  segments: ReadonlyArray<{ offset: number; bytes: ReadonlyArray<number> }>,
  length: number = 32,
): Uint8Array => {
  const buffer = new Uint8Array(length);
  segments.forEach(({ offset, bytes }) => buffer.set(bytes, offset));
  return buffer;
};

/** ASCII text -> bytes (TextEncoder is unavailable under jsdom 16). */
const asciiBytes = (text: string): Uint8Array =>
  Uint8Array.from(text, (char) => char.charCodeAt(0));

const segments = (text: string, offset: number) => ({
  offset,
  bytes: Array.from(asciiBytes(text)),
});

const blobOf = (bytes: Uint8Array, type?: string): Blob =>
  new Blob([bytes], type ? { type } : undefined);

const pngBytes = () =>
  bytesAt([
    { offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  ]);

describe("detectImageFormat", () => {
  it("detects PNG from its magic bytes", async () => {
    const blob = blobOf(pngBytes());

    await expect(detectImageFormat(blob)).resolves.toBe("png");
  });

  it("detects JPEG from its magic bytes", async () => {
    const blob = blobOf(bytesAt([{ offset: 0, bytes: [0xff, 0xd8, 0xff] }]));

    await expect(detectImageFormat(blob)).resolves.toBe("jpeg");
  });

  it("detects GIF from its magic bytes", async () => {
    const blob = blobOf(bytesAt([segments("GIF8", 0)]));

    await expect(detectImageFormat(blob)).resolves.toBe("gif");
  });

  it("detects WEBP only when both RIFF and WEBP markers are present", async () => {
    const webp = blobOf(
      bytesAt([segments("RIFF", 0), segments("WEBP", 8)]),
    );
    const plainRiff = blobOf(
      bytesAt([segments("RIFF", 0), segments("WAVE", 8)]),
    );

    await expect(detectImageFormat(webp)).resolves.toBe("webp");
    await expect(detectImageFormat(plainRiff)).resolves.toBe("unknown");
  });

  it("detects BMP and ICO from their magic bytes", async () => {
    const bmp = blobOf(bytesAt([segments("BM", 0)]));
    const ico = blobOf(bytesAt([{ offset: 0, bytes: [0x00, 0x00, 0x01, 0x00] }]));

    await expect(detectImageFormat(bmp)).resolves.toBe("bmp");
    await expect(detectImageFormat(ico)).resolves.toBe("ico");
  });

  it("detects AVIF and HEIF from their ISO-BMFF brands", async () => {
    const avif = blobOf(
      bytesAt([segments("ftyp", 4), segments("avif", 8)]),
    );
    const heic = blobOf(
      bytesAt([segments("ftyp", 4), segments("heic", 8)]),
    );
    const mif1 = blobOf(
      bytesAt([segments("ftyp", 4), segments("mif1", 8)]),
    );

    await expect(detectImageFormat(avif)).resolves.toBe("avif");
    await expect(detectImageFormat(heic)).resolves.toBe("heic");
    await expect(detectImageFormat(mif1)).resolves.toBe("heic");
  });

  it("detects SVG from its markup prefix", async () => {
    const blob = blobOf(
      asciiBytes('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
      "image/svg+xml",
    );

    await expect(detectImageFormat(blob)).resolves.toBe("svg");
  });

  it("returns unknown for non-image payloads", async () => {
    const html = blobOf(asciiBytes("<div>widget</div>"), "text/plain");
    const css = blobOf(asciiBytes("body { color: red }"), "text/css");
    const json = blobOf(asciiBytes('{"a":1}'), "application/json");
    const empty = blobOf(new Uint8Array());

    await expect(detectImageFormat(html)).resolves.toBe("unknown");
    await expect(detectImageFormat(css)).resolves.toBe("unknown");
    await expect(detectImageFormat(json)).resolves.toBe("unknown");
    await expect(detectImageFormat(empty)).resolves.toBe("unknown");
  });

  it("trusts magic bytes over a misleading MIME type", async () => {
    const blob = blobOf(pngBytes(), "image/jpeg");

    await expect(detectImageFormat(blob)).resolves.toBe("png");
  });

  it("falls back to the declared MIME type when bytes are unrecognized", async () => {
    const blob = blobOf(asciiBytes("not-really-an-image"), "image/png");

    await expect(detectImageFormat(blob)).resolves.toBe("png");
  });
});

describe("replaceExtension", () => {
  it("appends an extension when the name has none", () => {
    expect(replaceExtension("01932c5a-7f12", "webp")).toBe("01932c5a-7f12.webp");
  });

  it("replaces the existing extension", () => {
    expect(replaceExtension("back-42.jpg", "webp")).toBe("back-42.webp");
    expect(replaceExtension("logo-42.png", "webp")).toBe("logo-42.webp");
  });

  it("replaces only the last extension", () => {
    expect(replaceExtension("preset.v2.png", "webp")).toBe("preset.v2.webp");
  });

  it("keeps dotted names that are not extensions intact", () => {
    expect(replaceExtension("source.html", "webp")).toBe("source.webp");
  });
});

describe("prepareUpload", () => {
  it("leaves non-images untouched", async () => {
    const blob = blobOf(asciiBytes("body { color: red }"), "text/css");

    const prepared = await prepareUpload(blob, "styles.css", true, 0.9);

    expect(prepared.blob).toBe(blob);
    expect(prepared.name).toBe("styles.css");
    expect(prepared.converted).toBe(false);
    expect(prepared.format).toBe("unknown");
  });

  it("does not re-encode a GIF, which would drop its animation", async () => {
    const blob = blobOf(bytesAt([segments("GIF8", 0)]), "image/gif");

    const prepared = await prepareUpload(blob, "meme.gif", true, 0.9);

    expect(prepared.blob).toBe(blob);
    expect(prepared.name).toBe("meme.gif");
    expect(prepared.converted).toBe(false);
    expect(prepared.format).toBe("gif");
  });

  it("leaves images untouched when conversion is disabled", async () => {
    const blob = blobOf(pngBytes(), "image/png");

    const prepared = await prepareUpload(blob, "logo-42.png", false, 0.9);

    expect(prepared.blob).toBe(blob);
    expect(prepared.name).toBe("logo-42.png");
    expect(prepared.converted).toBe(false);
    expect(prepared.format).toBe("png");
  });

  it("falls back to the original blob when the image cannot be decoded", async () => {
    const original = (globalThis as { createImageBitmap?: unknown })
      .createImageBitmap;
    (globalThis as { createImageBitmap?: unknown }).createImageBitmap =
      undefined;
    try {
      const blob = blobOf(pngBytes(), "image/png");

      const prepared = await prepareUpload(blob, "logo-42.png", true, 0.9);

      expect(prepared.blob).toBe(blob);
      expect(prepared.name).toBe("logo-42.png");
      expect(prepared.converted).toBe(false);
      expect(prepared.format).toBe("png");
    } finally {
      (globalThis as { createImageBitmap?: unknown }).createImageBitmap =
        original;
    }
  });
});

describe("DEFAULT_WEBP_QUALITY", () => {
  it("is a valid WebP quality value", () => {
    expect(DEFAULT_WEBP_QUALITY).toBeGreaterThan(0);
    expect(DEFAULT_WEBP_QUALITY).toBeLessThanOrEqual(1);
  });
});

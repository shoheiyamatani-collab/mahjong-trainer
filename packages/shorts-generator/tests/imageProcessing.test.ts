import { describe, expect, it } from "vitest";
import sharp from "sharp";

describe("patched native image processing", () => {
  it("renders an SVG into the resized PNG used by the video generator", async () => {
    const input = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32"><rect width="64" height="32" fill="#137a59"/></svg>');
    const { data, info } = await sharp(input).resize(32, 16).png().toBuffer({ resolveWithObject: true });
    expect(info.width).toBe(32);
    expect(info.height).toBe(16);
    expect(info.format).toBe("png");
    const { data: pixels, info: raw } = await sharp(data).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    expect(raw.channels).toBe(3);
    expect([...pixels.subarray(0, 3)]).toEqual([19, 122, 89]);
  });

  it("keeps image composition and WebP encoding available", async () => {
    const overlay = await sharp({ create: { width: 2, height: 2, channels: 4, background: "#ffffff" } }).png().toBuffer();
    const image = await sharp({ create: { width: 4, height: 4, channels: 4, background: "#137a59" } })
      .composite([{ input: overlay, left: 0, top: 0 }]).webp({ lossless: true }).toBuffer();
    expect((await sharp(image).metadata()).format).toBe("webp");
    const { data } = await sharp(image).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    expect([...data.subarray(0, 3)]).toEqual([255, 255, 255]);
  });
});

import Link from "next/link";

export type ToolPreviewScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  crop?: { x: number; y: number; width: number; height: number };
};

export function ToolPreviewImage({
  screenshot,
  href,
  label
}: {
  screenshot: ToolPreviewScreenshot;
  href?: string;
  label?: string;
}) {
  const crop = screenshot.crop;
  const viewportStyle = crop ? { aspectRatio: `${crop.width} / ${crop.height}` } : undefined;
  const preview = (
    <img
      src={screenshot.src}
      alt={screenshot.alt}
      width={screenshot.width}
      height={screenshot.height}
      loading="lazy"
      decoding="async"
      style={crop ? {
        position: "absolute",
        width: `${screenshot.width / crop.width * 100}%`,
        height: "auto",
        maxWidth: "none",
        left: `${-crop.x / crop.width * 100}%`,
        top: `${-crop.y / crop.height * 100}%`
      } : undefined}
    />
  );
  return (
    <figure className="toolPreviewFigure">
      {href ? <Link href={href} aria-label={label} style={viewportStyle}>{preview}</Link>
        : <div className="toolPreviewViewport" style={viewportStyle}>{preview}</div>}
    </figure>
  );
}

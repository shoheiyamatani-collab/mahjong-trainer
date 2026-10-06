import Link from "next/link";

export type ToolPreviewScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function ToolPreviewImage({
  screenshot,
  href,
  label
}: {
  screenshot: ToolPreviewScreenshot;
  href: string;
  label: string;
}) {
  return (
    <figure className="toolPreviewFigure">
      <Link href={href} aria-label={label}>
        <img
          src={screenshot.src}
          alt={screenshot.alt}
          width={screenshot.width}
          height={screenshot.height}
          loading="lazy"
          decoding="async"
        />
      </Link>
    </figure>
  );
}

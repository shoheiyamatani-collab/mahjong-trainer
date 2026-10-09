import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, describe, expect, it, vi } from "vitest";
import { ToolPreviewImage } from "../components/ToolPreviewImage";
import { TrainerPortalCard } from "./TrainerLearningContent";
import { standaloneTrainerDefinitions, trainerDefinitions } from "./trainerCatalog";
import { trainingTone } from "../toolbox/toolCatalog";

vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());

const cards = [...trainerDefinitions, ...standaloneTrainerDefinitions].map((definition) => ({
  ...definition,
  href: `/trainer/${definition.slug}`
}));

describe("compact trainer cards", () => {
  for (const card of cards) {
    it(`keeps one accessible link and a cropped screenshot for ${card.slug}`, () => {
      const html = renderToStaticMarkup(React.createElement(TrainerPortalCard, card));
      expect(html.match(/<a\b/g)).toHaveLength(1);
      expect(html).toContain(`href="${card.href}"`);
      expect(html).toContain(`aria-label="${card.title}を始める"`);
      expect(html).toContain(`<h3>${card.title}</h3>`);
      expect(html).toContain(card.level);
      expect(html).toContain(`src="${card.screenshot.src}"`);
      expect(html).toContain("position:absolute");
      expect(html).toContain("loading=\"lazy\"");
      expect(html).not.toContain("trainerPortalMeta");
    });
  }

  it("groups trainers by shared category tokens instead of per-card colors", () => {
    const tones = cards.map((card) => {
      const html = renderToStaticMarkup(React.createElement(TrainerPortalCard, card));
      expect(html).toContain(`data-tone="${trainingTone[card.category]}"`);
      expect(html).not.toContain("--trainer-card-accent");
      expect(html).toContain("platformToolCardHeader");
      expect(html.indexOf("<h3>")).toBeLessThan(html.indexOf("platformDifficulty"));
      return trainingTone[card.category];
    });
    expect(new Set(tones).size).toBe(4);
  });

  it("retains a usable default for a newly added trainer", () => {
    const card = { ...cards[0]!, slug: "future-trainer", href: "/trainer/future-trainer" };
    const html = renderToStaticMarkup(React.createElement(TrainerPortalCard, card));
    expect(html).toContain(card.description);
    expect(html).toContain("href=\"/trainer/future-trainer\"");
    expect(html).not.toContain("position:absolute");
  });
});

describe("shared tool screenshots", () => {
  const screenshot = { src: "/example.jpg", alt: "Example", width: 960, height: 540 };

  it("preserves the existing linked, uncropped preview", () => {
    const html = renderToStaticMarkup(React.createElement(ToolPreviewImage, { screenshot, href: "/tools", label: "Open tool" }));
    expect(html).toContain("href=\"/tools\"");
    expect(html).toContain("aria-label=\"Open tool\"");
    expect(html).toContain("width=\"960\"");
    expect(html).toContain("height=\"540\"");
    expect(html).not.toContain("position:absolute");
  });

  it("can be placed within a card link without a nested link", () => {
    const html = renderToStaticMarkup(React.createElement(ToolPreviewImage, { screenshot }));
    expect(html).not.toMatch(/<a\b/);
    expect(html).toContain("toolPreviewViewport");
    expect(html).toContain("alt=\"Example\"");
  });

  it("scales and offsets the authored crop without changing the source asset", () => {
    const html = renderToStaticMarkup(React.createElement(ToolPreviewImage, {
      screenshot: { ...screenshot, crop: { x: 96, y: 67.5, width: 480, height: 270 } }
    }));
    expect(html).toContain("aspect-ratio:480 / 270");
    expect(html).toContain("width:200%");
    expect(html).toContain("height:auto");
    expect(html).toContain("left:-20%");
    expect(html).toContain("top:-25%");
    expect(html).toContain("src=\"/example.jpg\"");
  });
});

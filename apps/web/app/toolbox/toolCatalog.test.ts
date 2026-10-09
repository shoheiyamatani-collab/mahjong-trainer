import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, describe, expect, it, vi } from "vitest";
import { getToolCatalog, filterTools, trainingTone } from "./toolCatalog";
import { trainerDefinitions, standaloneTrainerDefinitions } from "../trainer/trainerCatalog";
import { ToolCard } from "../components/ToolCard";
import { isFocusWorkspace, platformCategory } from "../components/navigationModel";
vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());
const items = getToolCatalog();
describe("shared tool catalog", () => {
  it("retains every published trainer and calculator without duplicate URLs", () => {
    expect(new Set(items.map(item => item.href)).size).toBe(items.length);
    for (const definition of [...trainerDefinitions, ...standaloneTrainerDefinitions]) {
      expect(items.find(item => item.id === definition.slug)).toMatchObject({ href: `/trainer/${definition.slug}`, title: definition.title, tone: trainingTone[definition.category] });
    }
    expect(items.some(item => item.href === "/training/yaku-quiz")).toBe(true);
    expect(items.some(item => item.id === "tedashi-reading")).toBe(false);
    expect(getToolCatalog(true).some(item => item.id === "tedashi-reading")).toBe(true);
    for (const item of items.filter(item => !trainerDefinitions.some(definition => definition.slug === item.id))) {
      expect(existsSync(fileURLToPath(new URL(`..${item.href}/page.tsx`, import.meta.url))), item.href).toBe(true);
    }
  });
  for (const query of ["牌理", "何切る", "点数", "符計算", "清一色", "安全牌", "鳴き", "押し引き"]) {
    it(`matches actual functions for ${query}`, () => expect(filterTools(items, query).length).toBeGreaterThan(0));
  }
  it("normalizes full-width keywords, combines words and handles empty results", () => {
    expect(filterTools(items, "ＨＡＲＤ 点数").map(item => item.id)).toEqual(["score-hard"]);
    expect(filterTools(items, "", "waits").map(item => item.id)).toEqual(["seven-tile", "chinitsu"]);
    expect(filterTools(items, "牌理", "scoring")).toEqual([]);
    expect(filterTools(items, "存在しない道具")).toEqual([]);
  });
  it("renders one accessible whole-card link and separate difficulty for every tool", () => {
    for (const item of items) {
      const html = renderToStaticMarkup(React.createElement(ToolCard, { item }));
      expect(html.match(/<a\b/g)).toHaveLength(1);
      expect(html).toContain(`<h3>${item.title}</h3>`);
      expect(html).toContain(`href="${item.href}"`);
      expect(html).toContain(item.level);
      expect(html).toContain(`data-tone="${item.tone}"`);
    }
  });
});
describe("platform navigation and tokens", () => {
  it("identifies categories and keeps fixed navigation out of interactive workspaces", () => {
    expect(platformCategory("/learn/guides/wait-types")).toBe("learning");
    expect(platformCategory("/rules/yaku")).toBe("learning");
    expect(platformCategory("/videos/strategy/pro")).toBe("learning");
    expect(platformCategory("/mleague/players/hori-shingo")).toBe("mleague");
    for (const path of ["/trainer/push-or-fold", "/training/yaku-quiz", "/analysis/mahjong-tool", "/tools"]) expect(isFocusWorkspace(path)).toBe(true);
    for (const path of ["/", "/trainer", "/toolbox", "/analysis/mahjong-tool/help", "/trainer/ukeire-max/help"]) expect(isFocusWorkspace(path)).toBe(false);
  });
  it("keeps every category accent AA-readable on white and its tinted background", () => {
    const css = readFileSync(new URL("../../../../shared/ui/design-tokens.css", import.meta.url), "utf8");
    const luminance = (hex: string) => {
      const values = hex.slice(1).match(/../g)!.map(channel => { const value = parseInt(channel, 16) / 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; });
      return values[0]! * .2126 + values[1]! * .7152 + values[2]! * .0722;
    };
    for (const tone of ["analysis", "training", "learning", "mleague", "efficiency", "waits", "scoring", "decisions"]) {
      const accent = css.match(new RegExp(`--jf-${tone}: (#[a-f0-9]{6});`))![1]!;
      const tint = css.match(new RegExp(`--jf-${tone}-soft: (#[a-f0-9]{6});`))![1]!;
      expect((1 + .05) / (luminance(accent) + .05), tone).toBeGreaterThanOrEqual(4.5);
      expect((luminance(tint) + .05) / (luminance(accent) + .05), tone).toBeGreaterThanOrEqual(4.5);
    }
  });
});

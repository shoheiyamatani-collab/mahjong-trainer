import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import FourRules, { metadata as fourRulesMetadata } from "./tile-efficiency-four-rules/page";
import Habits, { metadata as habitsMetadata } from "./common-bad-habits-self-check/page";
import { getVideoGuideByArticleHref } from "../videoData";
import { getVideoPracticeLinks } from "./videoPracticeLinks";

describe("source-based summaries and independent worked examples", () => {
  it("renders all four themes, chapter links and a verified comparison in initial HTML", () => {
    const html = renderToStaticMarkup(<FourRules />);
    for (const seconds of [106, 496, 772, 1135]) expect(html).toContain(`watch?v=q3LPfokscno&amp;t=${seconds}s`);
    for (const title of ["対子が3組なら、残す2組を比べる", "対子が2組なら、雀頭の残り方を見る", "6ブロックなら、余る候補を比べる", "5ブロックなら、必要な候補を守る"]) expect(html).toContain(title);
    expect(html).toContain("4種・12枚");
    expect(html).toContain("3種・6枚");
    expect(html).toContain("動画の牌姿ではなく");
    expect(html).toContain("受け入れ枚数を和了率や期待値として読むこともできません");
    expect(html).toContain("youtube-nocookie.com/embed/q3LPfokscno");
    expect(html.match(/<img /g)).toHaveLength(14);
    expect(fourRulesMetadata.alternates?.canonical).toBe("/videos/strategy/tile-efficiency-four-rules");
    expect(fourRulesMetadata.robots).toMatchObject({ index: false, follow: true });
  });

  it("renders three concrete habits plus two legal thirteen-tile counterexamples", () => {
    const html = renderToStaticMarkup(<Habits />);
    for (const seconds of [60, 292, 418]) expect(html).toContain(`watch?v=HH56Dvq8n8A&amp;t=${seconds}s`);
    expect(html).toContain("リーチに対して、中途半端に手を崩す");
    expect(html).toContain("役がないのにダマテンにする");
    expect(html).toContain("生牌の字牌を、終盤まで残しすぎる");
    expect(html).toContain("5萬が現物でも、スジの2萬は現物ではない");
    expect(html).toContain("テンパイでも、役がなければロンできない");
    expect(html.match(/<img /g)).toHaveLength(26);
    expect(html).toContain("youtube-nocookie.com/embed/HH56Dvq8n8A");
    expect(habitsMetadata.alternates?.canonical).toBe("/videos/strategy/common-bad-habits-self-check");
    expect(habitsMetadata.robots).toMatchObject({ index: false, follow: true });
  });

  it("routes the habits article to defense and riichi practice instead of generic tile efficiency", () => {
    const guide = getVideoGuideByArticleHref("/videos/strategy/common-bad-habits-self-check")!;
    expect(getVideoPracticeLinks(guide).links.map((link) => link.href)).toEqual(["/trainer/push-or-fold", "/trainer/riichi-or-dama"]);
  });
});

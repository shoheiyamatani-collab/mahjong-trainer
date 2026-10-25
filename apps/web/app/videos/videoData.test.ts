import { describe, expect, it } from "vitest";
import { advancedStrategyChannel, getVideoGuideByArticleHref, proStrategyChannel, videoChannels } from "./videoData";

describe("video article directory metadata", () => {
  it("shares the listed reading estimate with the 26-theory detail article", () => {
    expect(getVideoGuideByArticleHref("/videos/strategy/intermediate-tile-efficiency-26-rules")?.readingTime)
      .toBe("約13分で読める");
  });

  it("provides one shared reading estimate for every linked strategy guide", () => {
    const guides = [videoChannels.strategy, advancedStrategyChannel, proStrategyChannel]
      .flatMap((channel) => channel.guides);
    for (const guide of guides) {
      if (guide.articleHref) {
        expect(getVideoGuideByArticleHref(guide.articleHref)?.readingTime, guide.articleHref)
          .toBe(guide.readingTime);
      }
    }
  });
});

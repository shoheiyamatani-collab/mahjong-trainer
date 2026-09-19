"use client";

import { ArrowRight, BookOpen, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { glossaryCategories, type GlossaryCategory, type GlossaryTerm } from "./glossaryData";

type CategoryFilter = "すべて" | GlossaryCategory;

export function GlossaryIndex({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("すべて");
  const normalizedQuery = normalize(query);
  const visibleTerms = useMemo(() => terms.filter((item) => {
    if (category !== "すべて" && item.category !== category) return false;
    if (!normalizedQuery) return true;

    return normalize([
      item.term,
      item.reading,
      item.definition,
      item.beginnerNote,
      ...(item.aliases ?? [])
    ].filter(Boolean).join(" ")).includes(normalizedQuery);
  }), [category, normalizedQuery, terms]);

  return (
    <section className="glossaryTool" aria-labelledby="glossary-index-title">
      <div className="glossaryToolbar">
        <div>
          <p className="siteEyebrow">Mahjong Dictionary</p>
          <h2 id="glossary-index-title">用語を探す</h2>
          <p>読み方・別名・意味から検索できます。</p>
        </div>
        <label className="glossarySearch">
          <Search aria-hidden="true" />
          <input
            type="search"
            aria-label="麻雀用語を検索"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例：テンパイ、待ち、ドラ"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="検索語を消す" title="検索語を消す">
              <X aria-hidden="true" />
            </button>
          ) : null}
        </label>
      </div>

      <div className="glossaryFilters" aria-label="用語のカテゴリ">
        {(["すべて", ...glossaryCategories] as CategoryFilter[]).map((item) => (
          <button
            className={category === item ? "isActive" : ""}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
            key={item}
          >
            {item}
            <span>{item === "すべて" ? terms.length : terms.filter((term) => term.category === item).length}</span>
          </button>
        ))}
      </div>

      <p className="glossaryResultCount" aria-live="polite">
        {visibleTerms.length}語を表示
        {query ? <span>「{query}」の検索結果</span> : null}
      </p>

      {visibleTerms.length ? (
        <div className="glossarySections">
          {glossaryCategories.map((sectionCategory) => {
            const categoryTerms = visibleTerms.filter((term) => term.category === sectionCategory);
            if (!categoryTerms.length) return null;

            return (
              <section className="glossaryCategory" aria-labelledby={`glossary-${sectionCategory}`} key={sectionCategory}>
                <header>
                  <BookOpen aria-hidden="true" />
                  <h3 id={`glossary-${sectionCategory}`}>{sectionCategory}</h3>
                  <span>{categoryTerms.length}語</span>
                </header>
                <dl>
                  {categoryTerms.map((item) => (
                    <div className="glossaryTerm" id={item.slug} key={item.slug}>
                      <dt>
                        <span>{item.term}</span>
                        <small>{item.reading}</small>
                      </dt>
                      <dd>
                        {item.aliases?.length ? <p className="glossaryAliases">別名：{item.aliases.join("・")}</p> : null}
                        <p>{item.definition}</p>
                        {item.beginnerNote ? <p className="glossaryNote">初心者メモ：{item.beginnerNote}</p> : null}
                        {item.related ? (
                          <Link href={item.related.href}>{item.related.label}<ArrowRight aria-hidden="true" /></Link>
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="glossaryEmpty">
          <Search aria-hidden="true" />
          <h3>該当する用語がありません</h3>
          <p>ひらがなや短い言葉でもう一度検索してみてください。</p>
          <button type="button" onClick={() => { setQuery(""); setCategory("すべて"); }}>条件をクリア</button>
        </div>
      )}
    </section>
  );
}

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("ja-JP").replace(/\s+/g, "");
}

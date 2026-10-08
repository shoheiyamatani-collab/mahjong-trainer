"use client";

import { Fragment, useId, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Search, SearchX, X } from "lucide-react";
import { TileStrip } from "../../components/TileFigures";
import { filterGuideLibrary, guideLibraryCategories, type GuideLibraryFilter, type GuideLibraryItem } from "./guideLibraryData";
import styles from "./guideLibrary.module.css";

function GuidePreview({ item }: { item: GuideLibraryItem }) {
  return <div className={`${styles.preview} ${styles[item.category]}`} role="img" aria-label={`${item.title}の牌図：${item.preview.map((group) => group.label).join("、")}`}>
    <div className={styles.previewGroups} aria-hidden="true">
      {item.preview.map((group, index) => <Fragment key={index}>
        {group.arrowBefore ? <ArrowRight className={styles.previewArrow} /> : null}
        <div className={`${styles.previewGroup} ${group.tone === "neutral" ? "" : styles[group.tone]}`} style={{ "--preview-tile-count": group.tiles.length } as CSSProperties}>
          <span className={styles.previewLabel}>{group.label}</span>
          <TileStrip tiles={group.tiles} />
        </div>
      </Fragment>)}
    </div>
  </div>;
}

export function GuideLibrary({ items }: { items: GuideLibraryItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GuideLibraryFilter>("all");
  const searchId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const matches = filterGuideLibrary(items, category, query);
  function clearSearch() {
    setQuery("");
    searchRef.current?.focus();
  }

  return <section className={styles.library} aria-label="麻雀学習記事一覧">
    <div className={styles.controls}>
      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <Search aria-hidden="true" />
          <label className={styles.srOnly} htmlFor={searchId}>学習記事を検索</label>
          <input ref={searchRef} id={searchId} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="学びたいテーマを探す" autoComplete="off" aria-controls="guide-library-results" />
          {query ? <button type="button" onClick={clearSearch} aria-label="検索をクリア" title="検索をクリア"><X aria-hidden="true" /></button> : null}
        </div>
        <p className={styles.count} role="status" aria-live="polite" aria-atomic="true">{category === "all" && !query.trim() ? <>全 <strong>{items.length}</strong> 記事</> : <><strong>{matches.length}</strong> / {items.length} 記事</>}</p>
      </div>
      <div className={styles.categories} role="group" aria-label="学習テーマ">
        {[{ id: "all", label: "すべて" }, ...guideLibraryCategories].map((filter) => <button key={filter.id} type="button" className={`${styles.category} ${styles[filter.id]} ${category === filter.id ? styles.selected : ""}`} aria-pressed={category === filter.id} aria-controls="guide-library-results" onClick={() => setCategory(filter.id as GuideLibraryFilter)}>{filter.label}</button>)}
      </div>
    </div>

    <div id="guide-library-results">
      {matches.length ? <div className={styles.grid}>
        {matches.map((item) => <article className={styles.card} key={item.slug}>
          <Link className={styles.cardLink} href={`/learn/guides/${item.slug}`} aria-labelledby={`guide-title-${item.slug}`}>
            <GuidePreview item={item} />
            <span className={`${styles.badge} ${styles[item.category]}`}>{guideLibraryCategories.find((filter) => filter.id === item.category)!.label}</span>
            <h2 id={`guide-title-${item.slug}`}>{item.title}</h2>
            <p>{item.description}</p>
            <ArrowRight className={styles.cardArrow} aria-hidden="true" />
          </Link>
        </article>)}
      </div> : <div className={styles.empty}>
        <SearchX aria-hidden="true" />
        <h2>該当する記事がありません</h2>
        <button type="button" onClick={() => { clearSearch(); setCategory("all"); }}><RotateCcw aria-hidden="true" />条件をリセット</button>
      </div>}
    </div>
  </section>;
}

"use client";
import { useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { ToolCard } from "../components/ToolCard";
import { filterTools, type ToolCatalogItem } from "./toolCatalog";
const filters = [{ id: "all", label: "すべて" }, { id: "analysis", label: "解析・計算" }, { id: "efficiency", label: "牌効率" }, { id: "waits", label: "待ち読み" }, { id: "scoring", label: "点数練習" }, { id: "decisions", label: "実戦判断・守備" }, { id: "learning", label: "役とルール" }];
export function ToolDirectory({ items, initialQuery = "" }: { items: ToolCatalogItem[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const matches = filterTools(items, query, category);
  function reset() { setQuery(""); setCategory("all"); input.current?.focus(); }
  return <section aria-label="ツール・トレーニング一覧">
    <div className="toolDirectoryControls" id="tool-search">
      <div className="platformSearchForm"><Search aria-hidden="true" /><label className="platformSrOnly" htmlFor={id}>ツール名・キーワードで検索</label><input id={id} ref={input} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="牌理・何切る・点数・鳴き…" aria-controls="tool-results" />{query ? <button type="button" onClick={() => { setQuery(""); input.current?.focus(); }} title="検索をクリア" aria-label="検索をクリア"><X aria-hidden="true" /></button> : null}</div>
      <div className="toolDirectoryFilters" role="group" aria-label="分野で絞り込み">{filters.map(filter => <button key={filter.id} type="button" data-tone={filter.id} aria-pressed={category === filter.id} aria-controls="tool-results" onClick={() => setCategory(filter.id)}>{filter.label}</button>)}</div>
      <p className="toolDirectoryCount" role="status" aria-live="polite"><strong>{matches.length}</strong> 件 / 全 {items.length} 件</p>
    </div>
    <div id="tool-results">{matches.length ? <div className="toolCardGrid">{matches.map(item => <ToolCard item={item} key={item.id} />)}</div> : <div className="toolDirectoryEmpty"><h2>該当するツールがありません</h2><button type="button" onClick={reset}>条件をリセット</button></div>}</div>
  </section>;
}

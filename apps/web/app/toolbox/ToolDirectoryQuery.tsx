"use client";
import { useSearchParams } from "next/navigation";
import { ToolDirectory } from "./ToolDirectory";
import type { ToolCatalogItem } from "./toolCatalog";
export function ToolDirectoryQuery({ items }: { items: ToolCatalogItem[] }) {
  const query = useSearchParams().get("q") ?? "";
  return <ToolDirectory items={items} initialQuery={query} key={query} />;
}

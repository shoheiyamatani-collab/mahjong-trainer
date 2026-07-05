export type TileFigureRow = {
  label: string;
  tiles: string[];
  note?: string;
  resultLabel?: string;
  resultTiles?: string[];
  tone?: "normal" | "answer" | "warning";
};

export type TileFigure = {
  title: string;
  description: string;
  badges?: string[];
  link?: {
    href: string;
    label: string;
  };
  rows: TileFigureRow[];
};

const tileNames: Record<string, string> = {
  man1: "一萬",
  man2: "二萬",
  man3: "三萬",
  man4: "四萬",
  man5: "五萬",
  man6: "六萬",
  man7: "七萬",
  man8: "八萬",
  man9: "九萬",
  pin1: "一筒",
  pin2: "二筒",
  pin3: "三筒",
  pin4: "四筒",
  pin5: "五筒",
  pin6: "六筒",
  pin7: "七筒",
  pin8: "八筒",
  pin9: "九筒",
  sou1: "一索",
  sou2: "二索",
  sou3: "三索",
  sou4: "四索",
  sou5: "五索",
  sou6: "六索",
  sou7: "七索",
  sou8: "八索",
  sou9: "九索",
  ji1: "東",
  ji2: "南",
  ji3: "西",
  ji4: "北",
  ji5: "發",
  ji6: "白",
  ji7: "中"
};

export function ArticleTileFigures({ figures }: { figures?: TileFigure[] }) {
  if (!figures?.length) return null;

  return (
    <section className="articleSection tileFigureSection">
      <h2>牌で見る例</h2>
      <p className="tileFigureLead">牌の形を目で見ると、ルールや役の条件がかなりつかみやすくなります。</p>
      <div className="tileFigureGrid">
        {figures.map((figure) => (
          <article className="tileFigureCard" key={figure.title}>
            <div className="tileFigureHeader">
              <h3>{figure.title}</h3>
              {figure.badges?.length ? (
                <div className="tileFigureBadges">
                  {figure.badges.map((badge) => (
                    <span key={badge}>{badge}</span>
                  ))}
                </div>
              ) : null}
            </div>
            <p>{figure.description}</p>
            <div className="tileFigureRows">
              {figure.rows.map((row, index) => (
                <div className={`tileFigureRow tone-${row.tone ?? "normal"}`} key={`${figure.title}-${row.label}-${index}`}>
                  <div className="tileFigureRowLabel">{row.label}</div>
                  <TileStrip tiles={row.tiles} />
                  {row.resultTiles?.length ? (
                    <>
                      <div className="tileFigureArrow" aria-hidden="true">
                        →
                      </div>
                      <div className="tileFigureResult">
                        {row.resultLabel ? <span>{row.resultLabel}</span> : null}
                        <TileStrip tiles={row.resultTiles} compact />
                      </div>
                    </>
                  ) : null}
                  {row.note ? <p className="tileFigureNote">{row.note}</p> : null}
                </div>
              ))}
            </div>
            {figure.link ? (
              <a className="tileFigureLink" href={figure.link.href}>
                {figure.link.label}
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function TileStrip({ tiles, compact = false }: { tiles: string[]; compact?: boolean }) {
  return (
    <div className={compact ? "articleTileStrip compact" : "articleTileStrip"} aria-label={tiles.map((tile) => tileNames[tile] ?? tile).join("、")}>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />
      ))}
    </div>
  );
}

import type { Metadata } from "next";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";

export const metadata: Metadata = {
  title: "実践でよく見る待ち一覧 | 両面・ノベタン・亜両面・三面待ち",
  description:
    "麻雀の実戦でよく見るペンチャン、カンチャン、シャンポン、両面、ノベタン、亜両面、三面待ち、変則三面待ち、多面待ちを牌図つきで解説します。"
};

type WaitPattern = {
  name: string;
  subtitle: string;
  shape: string[];
  waits: string[];
  summary: string;
  point: string;
  group: "basic" | "ryanmen" | "sanmen" | "complex";
};

const waitPatterns: WaitPattern[] = [
  {
    name: "ペンチャン待ち",
    subtitle: "端の順子だけを待つ形",
    shape: ["man1", "man2"],
    waits: ["man3"],
    summary: "1・2で3を待つ、または8・9で7を待つ形です。端の待ちなので枚数が少なく、良形ではありません。",
    point: "序盤の何切るでは、ペンチャンより両面や強い浮き牌を残すことが多いです。",
    group: "basic"
  },
  {
    name: "カンチャン待ち",
    subtitle: "間の1枚を待つ形",
    shape: ["man2", "man4"],
    waits: ["man3"],
    summary: "2・4で3を待つように、間の牌が来ると順子になる待ちです。",
    point: "ペンチャンと同じく最大4枚待ちです。リーチ判断では両面よりアガリにくい待ちとして見ます。",
    group: "basic"
  },
  {
    name: "シャンポン待ち",
    subtitle: "2つの対子のどちらかを刻子にする形",
    shape: ["man5", "man5", "pin7", "pin7"],
    waits: ["man5", "pin7"],
    summary: "2つの対子があり、どちらかが3枚になるとアガれる形です。シャボ待ちとも呼ばれます。",
    point: "待ちは2種類ですが、自分で2枚ずつ使っているので最大4枚です。役牌対子が絡むと実戦でよく出ます。",
    group: "basic"
  },
  {
    name: "両面待ち",
    subtitle: "通常の45など",
    shape: ["man4", "man5"],
    waits: ["man3", "man6"],
    summary: "4・5で3と6を待つように、両側で順子になる基本の良形です。",
    point: "最大8枚待ちで、リーチの基本形です。待ちを読むときも36、47、25などの筋で考えます。",
    group: "ryanmen"
  },
  {
    name: "ノベタン待ち",
    subtitle: "1234や3456の端が待ちになる形",
    shape: ["man1", "man2", "man3", "man4"],
    waits: ["man1", "man4"],
    summary: "1234なら1か4で、順子と雀頭ができます。両面のように2種類待ちですが、待ちの扱いは単騎の組み合わせです。",
    point: "1123の亜両面とは違い、平和がつかない形になりやすい点に注意します。",
    group: "ryanmen"
  },
  {
    name: "亜両面待ち",
    subtitle: "雀頭と両面ターツがくっついた形",
    shape: ["man1", "man1", "man2", "man3"],
    waits: ["man1", "man4"],
    summary: "1123や2234のように、対子と両面ターツがつながった形です。",
    point: "1123なら1でも4でもアガれます。形によっては平和扱いになるので、ノベタンと区別して覚えます。",
    group: "ryanmen"
  },
  {
    name: "三面待ち",
    subtitle: "通常の34567など",
    shape: ["man3", "man4", "man5", "man6", "man7"],
    waits: ["man2", "man5", "man8"],
    summary: "34567のように5枚が連続している形です。2・5・8の3種類でアガれます。",
    point: "両面待ちが2つ重なった形です。147、258、369の筋で出ることが多いです。",
    group: "sanmen"
  },
  {
    name: "ノベタン三面待ち",
    subtitle: "1234567のような7枚形",
    shape: ["man1", "man2", "man3", "man4", "man5", "man6", "man7"],
    waits: ["man1", "man4", "man7"],
    summary: "1234567なら1・4・7で、2面子と雀頭ができます。",
    point: "待ちは3種類ですが、すべて単騎の組み合わせとして完成するノベタン系の三面待ちです。",
    group: "sanmen"
  },
  {
    name: "亜両面が絡む三面待ち",
    subtitle: "1123456のような形",
    shape: ["man1", "man1", "man2", "man3", "man4", "man5", "man6"],
    waits: ["man1", "man4", "man7"],
    summary: "亜両面の形に連続形がつながると、三面待ちになることがあります。",
    point: "1123の1・4待ちに、456側の伸びが加わるイメージで見ると見落としにくくなります。",
    group: "sanmen"
  },
  {
    name: "変則三面待ち",
    subtitle: "1156777のような147待ち",
    shape: ["man1", "man1", "man5", "man6", "man7", "man7", "man7"],
    waits: ["man1", "man4", "man7"],
    summary: "暗刻や対子が絡んで、見た目より待ちが広くなる形です。1156777は1・4・7待ちです。",
    point: "暗刻を刻子として見る場合と、対子＋1枚として見る場合を分けると待ちを探しやすくなります。",
    group: "complex"
  },
  {
    name: "7枚形の多面待ち 2333456",
    subtitle: "2333456のような1247待ち",
    shape: ["man2", "man3", "man3", "man3", "man4", "man5", "man6"],
    waits: ["man1", "man2", "man4", "man7"],
    summary: "2333456は、暗刻と連続形が重なって1・2・4・7待ちになります。",
    point: "3の暗刻を抜いて見る形と、33を雀頭にして見る形を両方確認すると待ちを拾いやすくなります。",
    group: "complex"
  },
  {
    name: "7枚形の多面待ち 4445678",
    subtitle: "4445678のような35689待ち",
    shape: ["man4", "man4", "man4", "man5", "man6", "man7", "man8"],
    waits: ["man3", "man5", "man6", "man8", "man9"],
    summary: "4445678は、4の暗刻と45678の連続形が絡んで3・5・6・8・9待ちになります。",
    point: "暗刻を固定するだけでなく、44を雀頭にする分解も見ると、5や8の待ちを見落としにくくなります。",
    group: "complex"
  },
  {
    name: "7枚形の多面待ち 3335567",
    subtitle: "3335567のような458待ち",
    shape: ["man3", "man3", "man3", "man5", "man5", "man6", "man7"],
    waits: ["man4", "man5", "man8"],
    summary: "3335567は、3の暗刻、55の対子、67の両面が絡んで4・5・8待ちになります。",
    point: "5は対子が刻子になる待ち、4と8は67や56の両面として見る待ちです。暗刻と対子の両方を意識します。",
    group: "complex"
  }
];

const sections = [
  {
    key: "basic",
    title: "まず覚える基本待ち",
    description: "ペンチャン、カンチャン、シャンポンは、良形ではないけれど実戦で必ず出る待ちです。"
  },
  {
    key: "ryanmen",
    title: "両面待ちとその仲間",
    description: "通常の両面、ノベタン、亜両面は、似ているようで点数や平和の扱いが変わることがあります。"
  },
  {
    key: "sanmen",
    title: "三面待ち",
    description: "5枚連続、7枚連続、亜両面絡みの三面待ちは、実戦で見落としやすいところです。"
  },
  {
    key: "complex",
    title: "変則三面待ち・その他の多面待ち",
    description: "清一色や同じ色が伸びた手で出やすい形です。最初は代表形を丸ごと覚えるのが近道です。"
  }
] as const;

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
  pin7: "七筒"
};

export default function PracticalWaitsPage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Practical Waits"
        title="実践でよく見る待ち一覧"
        description="ペンチャン、カンチャン、シャンポン、両面から、ノベタン、亜両面、三面待ち、変則多面待ちまで、実戦で調べやすい形に絞って牌図つきで整理します。"
        primaryLink={{ label: "待ち当てを練習する", href: "/trainer" }}
        secondaryLink={{ label: "テンパイと待ちを読む", href: "/learn/tenpai-and-wait" }}
      />

      <section>
        <SectionTitle
          title="待ちを見るコツ"
          description="複雑な待ちは、暗刻を抜く、雀頭候補を決める、連続形を分ける、の順で見るとかなり整理できます。"
        />
        <div className="waitTipGrid">
          <article>
            <h2>基本待ちから見る</h2>
            <p>ペンチャン、カンチャン、シャンポン、両面の4つを先に判定します。</p>
          </article>
          <article>
            <h2>連続形は筋で見る</h2>
            <p>三面待ちは147、258、369のような筋で出ることが多いです。</p>
          </article>
          <article>
            <h2>暗刻は外して考える</h2>
            <p>変則待ちは暗刻を刻子として使うか、対子として使うかで待ちが増えます。</p>
          </article>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.key}>
          <SectionTitle title={section.title} description={section.description} />
          <div className="waitPatternGrid">
            {waitPatterns.filter((pattern) => pattern.group === section.key).map((pattern) => (
              <WaitPatternCard item={pattern} key={pattern.name} />
            ))}
          </div>
        </section>
      ))}

      <section className="waitTrainingCallout">
        <div>
          <p className="siteEyebrow">7 Tiles Training</p>
          <h2>その他の7枚系も学んで多面チャンをマスターしよう</h2>
          <p>7枚形は清一色や混一色でよく出ます。形を見て待ちを答える練習をすると、実戦での見落としがかなり減ります。</p>
          <p>基本モードで代表的な7枚形を覚え、慣れてきたら全19パターンで多面待ちの形をまとめて確認できます。</p>
        </div>
        <figure className="waitTrainingImage">
          <img src="/tool-screenshots/seven-shape-training.png" alt="7枚形トレーニングで待ち牌を選択している画面" />
          <figcaption>7枚形を見て、1〜9から待ち牌を選ぶトレーニングです。</figcaption>
        </figure>
        <a className="cardButton" href="/trainer">7枚系トレーニングへ</a>
      </section>

      <section>
        <SectionTitle title="次に進む" description="待ちの形を見たら、問題で見つける練習に進みます。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="待ち当てを練習する" description="実際の手牌から待ちを探します。" href="/trainer" actionLabel="練習する" />
          <InternalLinkCard title="テンパイと待ちを読む" description="ロードマップ記事で基本に戻って確認します。" href="/learn/tenpai-and-wait" actionLabel="読む" />
          <InternalLinkCard title="実践でよく使う麻雀の基本へ戻る" description="役、点数、一向聴の入口へ戻ります。" href="/rules" actionLabel="戻る" />
        </div>
      </section>
    </main>
  );
}

function WaitPatternCard({ item }: { item: WaitPattern }) {
  return (
    <article className="waitPatternCard">
      <div>
        <p className="waitSubtitle">{item.subtitle}</p>
        <h2>{item.name}</h2>
      </div>
      <div className="waitTileArea">
        <TileStrip tiles={item.shape} label={`${item.name}の形`} />
        <span className="waitArrow" aria-hidden="true">→</span>
        <TileStrip tiles={item.waits} label={`${item.name}の待ち牌`} waits />
      </div>
      <p>{item.summary}</p>
      <div className="waitPoint">{item.point}</div>
    </article>
  );
}

function TileStrip({ tiles, label, waits = false }: { tiles: string[]; label: string; waits?: boolean }) {
  return (
    <div className={waits ? "waitTileStrip waitTiles" : "waitTileStrip"} aria-label={label}>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />
      ))}
    </div>
  );
}

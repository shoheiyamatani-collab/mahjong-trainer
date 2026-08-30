import type { Metadata } from "next";
import Link from "next/link";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";

export const metadata: Metadata = {
  title: "実践でよく見る麻雀役一覧 | 頻出役だけを牌図つきで確認",
  description:
    "麻雀の実戦で頻出するリーチ、役牌、タンヤオ、平和、ツモ、一発、混一色などを初心者向けに牌図つきで整理します。"
};

type FrequentYaku = {
  name: string;
  kana: string;
  han: string;
  openNote: string;
  priority: "最優先" | "次に覚える";
  frequency: string;
  summary: string;
  example: {
    blocks: Array<{ label?: string; tiles: string[]; highlight?: boolean; calledIndex?: number }>;
    winningTile: string;
    highlightWinningTile?: boolean;
  };
  tileLabel: string;
  point: string;
  href: string;
};

const frequentYaku: FrequentYaku[] = [
  {
    name: "リーチ",
    kana: "立直",
    han: "1翻",
    openNote: "鳴いたら不可",
    priority: "最優先",
    frequency: "出現率の目安: 約40%台",
    summary: "鳴いていない状態でテンパイしたら宣言できる、実戦で最もよく見る基本役です。",
    example: {
      blocks: [
        { tiles: ["man1", "man2", "man3"] },
        { tiles: ["pin3", "pin4", "pin5"] },
        { tiles: ["sou6", "sou7", "sou8"] },
        { label: "両面待ち", tiles: ["man6", "man7"], highlight: true },
        { tiles: ["pin5", "pin5"] }
      ],
      winningTile: "man8",
      highlightWinningTile: true
    },
    tileLabel: "あと1枚でアガれる形",
    point: "門前でテンパイしたら、まずリーチできるかを確認します。",
    href: "/rules/reach"
  },
  {
    name: "役牌",
    kana: "やくはい",
    han: "1翻",
    openNote: "鳴いても可",
    priority: "最優先",
    frequency: "鳴き手で特に頻出",
    summary: "白・發・中、または場風・自風を3枚そろえる役です。ポンしても役が残ります。",
    example: {
      blocks: [
        { tiles: ["man1", "man2", "man3"] },
        { tiles: ["pin3", "pin4", "pin5"] },
        { tiles: ["sou6", "sou7", "sou8"] },
        { tiles: ["man5", "man5"] },
        { label: "役牌", tiles: ["ji7", "ji7"], highlight: true }
      ],
      winningTile: "ji7",
      highlightWinningTile: true
    },
    tileLabel: "中を3枚そろえた役牌の例",
    point: "この3種類を全部そろえる必要はありません。白・發・中のどれか1種類を3枚そろえれば役牌の1翻です。",
    href: "/rules/yakuhai"
  },
  {
    name: "タンヤオ",
    kana: "断么九",
    han: "1翻",
    openNote: "鳴いても可が多い",
    priority: "最優先",
    frequency: "出現率の目安: 約20%台",
    summary: "1・9・字牌を使わず、2から8の数牌だけで作る役です。見た目で判断しやすい役です。",
    example: {
      blocks: [
        { label: "2〜8", tiles: ["man2", "man3", "man4"], highlight: true },
        { label: "2〜8", tiles: ["pin3", "pin4", "pin5"], highlight: true },
        { label: "2〜8", tiles: ["sou6", "sou7", "sou8"], highlight: true },
        { label: "2〜8", tiles: ["man6", "man7"], highlight: true },
        { label: "2〜8", tiles: ["pin5", "pin5"], highlight: true }
      ],
      winningTile: "man8",
      highlightWinningTile: true
    },
    tileLabel: "2〜8だけ",
    point: "端牌と字牌がないかを見るだけで、かなり判断しやすくなります。",
    href: "/rules/tanyao"
  },
  {
    name: "平和",
    kana: "ピンフ",
    han: "1翻",
    openNote: "鳴いたら不可",
    priority: "最優先",
    frequency: "出現率の目安: 約20%",
    summary: "順子4つ、役牌ではない雀頭、両面待ちで成立する役です。リーチとよく一緒に出ます。",
    example: {
      blocks: [
        { label: "順子", tiles: ["man1", "man2", "man3"], highlight: true },
        { label: "順子", tiles: ["pin3", "pin4", "pin5"], highlight: true },
        { label: "順子", tiles: ["sou4", "sou5", "sou6"], highlight: true },
        { label: "両面待ち", tiles: ["man6", "man7"], highlight: true },
        { label: "役牌でない雀頭", tiles: ["pin2", "pin2"], highlight: true }
      ],
      winningTile: "man8",
      highlightWinningTile: true
    },
    tileLabel: "順子中心",
    point: "条件は少し細かいですが、点数計算でもよく出るので早めに慣れたい役です。",
    href: "/rules/pinfu"
  },
  {
    name: "ツモ",
    kana: "門前清自摸和",
    han: "1翻",
    openNote: "鳴いたら不可",
    priority: "最優先",
    frequency: "出現率の目安: 約20%",
    summary: "鳴いていない状態で、自分で引いた牌でアガる役です。リーチ後のツモでよく見ます。",
    example: {
      blocks: [
        { tiles: ["man1", "man2", "man3"] },
        { tiles: ["pin3", "pin4", "pin5"] },
        { tiles: ["sou6", "sou7", "sou8"] },
        { label: "待ち", tiles: ["man6", "man7"], highlight: true },
        { tiles: ["pin5", "pin5"] }
      ],
      winningTile: "man8",
      highlightWinningTile: true
    },
    tileLabel: "自分で引く",
    point: "相手の捨て牌ならロン、自分で引いたらツモです。",
    href: "/rules/tsumo"
  },
  {
    name: "一発",
    kana: "イッパツ",
    han: "1翻",
    openNote: "リーチ後のみ",
    priority: "次に覚える",
    frequency: "出現率の目安: 約7〜10%",
    summary: "リーチ後、誰も鳴かないまま次の自分のツモまでにアガるとつく役です。",
    example: {
      blocks: [
        { tiles: ["man1", "man2", "man3"] },
        { tiles: ["pin3", "pin4", "pin5"] },
        { tiles: ["sou6", "sou7", "sou8"] },
        { label: "リーチ後の待ち", tiles: ["man6", "man7"], highlight: true },
        { tiles: ["pin5", "pin5"] }
      ],
      winningTile: "man8",
      highlightWinningTile: true
    },
    tileLabel: "リーチのおまけ",
    point: "形で作る役ではなく、リーチ後のタイミングでつく役です。",
    href: "/rules/yaku"
  },
  {
    name: "混一色",
    kana: "ホンイツ",
    han: "3翻 / 鳴き2翻",
    openNote: "鳴くと下がる",
    priority: "次に覚える",
    frequency: "2翻以上では比較的よく見る",
    summary: "1種類の数牌と字牌だけで作る役です。役牌と一緒になりやすい実戦向けの役です。",
    example: {
      blocks: [
        { label: "萬子", tiles: ["man2", "man3", "man4"], highlight: true },
        { label: "萬子", tiles: ["man5", "man6", "man7"], highlight: true },
        { label: "萬子", tiles: ["man7", "man8", "man9"], highlight: true },
        { label: "字牌", tiles: ["ji1", "ji1"], highlight: true },
        { label: "字牌", tiles: ["ji6", "ji6"], highlight: true }
      ],
      winningTile: "ji6",
      highlightWinningTile: true
    },
    tileLabel: "一色＋字牌",
    point: "萬子・筒子・索子のうち、どれか1種類に寄ってきたら意識します。",
    href: "/rules/honitsu"
  },
  {
    name: "一盃口",
    kana: "イーペーコー",
    han: "1翻",
    openNote: "鳴いたら不可",
    priority: "次に覚える",
    frequency: "出現率の目安: 約4〜5%",
    summary: "同じ種類・同じ数字並びの順子を2組作る役です。平和系の手で自然に出ます。",
    example: {
      blocks: [
        { label: "同じ順子", tiles: ["man2", "man3", "man4"], highlight: true },
        { label: "同じ順子", tiles: ["man2", "man3", "man4"], highlight: true },
        { tiles: ["pin6", "pin7", "pin8"] },
        { tiles: ["sou6", "sou7"] },
        { tiles: ["pin5", "pin5"] }
      ],
      winningTile: "sou8"
    },
    tileLabel: "同じ順子2組",
    point: "二三四萬が2組、のように同じ順子が重なっているかを見ます。",
    href: "/rules/iipeikou"
  },
  {
    name: "三色同順",
    kana: "サンショク",
    han: "2翻 / 鳴き1翻",
    openNote: "鳴くと下がる",
    priority: "次に覚える",
    frequency: "2翻役では実戦で見かける",
    summary: "萬子・筒子・索子で同じ数字並びの順子を作る役です。形が見えると打点が上がります。",
    example: {
      blocks: [
        { label: "345", tiles: ["man3", "man4", "man5"], highlight: true },
        { label: "345", tiles: ["pin3", "pin4", "pin5"], highlight: true },
        { label: "345", tiles: ["sou3", "sou4", "sou5"], highlight: true },
        { tiles: ["man6", "man7"] },
        { tiles: ["ji1", "ji1"] }
      ],
      winningTile: "man8"
    },
    tileLabel: "3種類の345",
    point: "同じ数字の順子が3色にまたがっていないかを見ます。",
    href: "/rules/sanshoku"
  },
  {
    name: "対々和",
    kana: "トイトイ",
    han: "2翻",
    openNote: "鳴いても可",
    priority: "次に覚える",
    frequency: "鳴き手で見かける",
    summary: "刻子を4つ作る役です。ポンが多い手で、役牌と一緒になることがあります。",
    example: {
      blocks: [
        { label: "ポン", tiles: ["man2", "man2", "man2"], highlight: true, calledIndex: 1 },
        { label: "ポン", tiles: ["pin5", "pin5", "pin5"], highlight: true, calledIndex: 1 },
        { label: "刻子", tiles: ["ji7", "ji7", "ji7"], highlight: true },
        { label: "刻子待ち", tiles: ["sou8", "sou8"], highlight: true },
        { tiles: ["man6", "man6"] }
      ],
      winningTile: "sou8",
      highlightWinningTile: true
    },
    tileLabel: "2組をポンした対々和",
    point: "順子ではなく、同じ牌3枚のかたまりが多い手で意識します。",
    href: "/rules/toitoi"
  },
  {
    name: "七対子",
    kana: "チートイツ",
    han: "2翻",
    openNote: "鳴いたら不可",
    priority: "次に覚える",
    frequency: "対子が多い手で頻出",
    summary: "同じ牌2枚のペアを7組作る特殊な役です。通常の4面子1雀頭とは別枠で覚えます。",
    example: {
      blocks: [
        { label: "対子", tiles: ["man2", "man2"], highlight: true },
        { label: "対子", tiles: ["man5", "man5"], highlight: true },
        { label: "対子", tiles: ["pin3", "pin3"], highlight: true },
        { label: "対子", tiles: ["pin6", "pin6"], highlight: true },
        { label: "対子", tiles: ["sou4", "sou4"], highlight: true },
        { label: "対子", tiles: ["ji1", "ji1"], highlight: true },
        { label: "7組目", tiles: ["ji7"], highlight: true }
      ],
      winningTile: "ji7",
      highlightWinningTile: true
    },
    tileLabel: "ペアを7組",
    point: "対子が多い配牌なら、七対子ルートを考えます。",
    href: "/rules/chiitoitsu"
  }
];

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
  pin2: "二筒",
  pin3: "三筒",
  pin4: "四筒",
  pin5: "五筒",
  pin6: "六筒",
  pin7: "七筒",
  pin8: "八筒",
  sou3: "三索",
  sou4: "四索",
  sou5: "五索",
  sou6: "六索",
  sou7: "七索",
  sou8: "八索",
  ji1: "東",
  ji5: "發",
  ji6: "白",
  ji7: "中"
};

export default function FrequentYakuPage() {
  return (
    <main className="siteMain yakuGuidePage">
      <PageHero
        eyebrow="Practical Yaku"
        title="実践でよく見る役一覧"
        description="全役を一気に覚える前に、実戦で何度も出てくる役だけを先に確認します。まずはリーチ・役牌・タンヤオ・平和・ツモを軸に覚えれば十分です。"
        primaryLink={{ label: "全役一覧を見る", href: "/rules/yaku" }}
        secondaryLink={{ label: "役判定クイズ", href: "/training/yaku-quiz" }}
      />

      <section className="yakuIntro">
        <SectionTitle
          title="頻出役だけに絞る理由"
          description="役の数は多いですが、実戦でよく出る役はかなり偏っています。初心者は、出現率が高く、他の役と複合しやすい役から覚えるのが近道です。"
        />
        <div className="yakuRuleGrid">
          <article>
            <h2>まずは上位5役</h2>
            <p>リーチ、役牌、タンヤオ、平和、ツモは出現率が高く、実戦で毎局のように判断します。</p>
          </article>
          <article>
            <h2>鳴く手は役牌とタンヤオ</h2>
            <p>リーチしないアガリでは、役牌やタンヤオの重要度が一気に上がります。</p>
          </article>
          <article>
            <h2>全役一覧は別で残す</h2>
            <p>役満や珍しい役まで確認したいときは、初心者ロードマップ用の全役一覧に戻れます。</p>
          </article>
        </div>
      </section>

      <section>
        <SectionTitle title="最優先で覚える役" description="実戦で特に出やすく、手作りや点数判断の土台になる役です。" />
        <div className="yakuCardGrid">
          {frequentYaku.filter((item) => item.priority === "最優先").map((item) => (
            <FrequentYakuCard item={item} key={item.name} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="次によく見る役" description="毎回出るわけではありませんが、覚えると実戦の見え方がかなり変わる役です。" />
        <div className="yakuCardGrid">
          {frequentYaku.filter((item) => item.priority === "次に覚える").map((item) => (
            <FrequentYakuCard item={item} key={item.name} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="次に進む" description="頻出役を見たら、問題で見分ける練習に進みます。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="全役一覧を見る" description="珍しい役や役満も含めて、牌姿つきで確認します。" href="/rules/yaku" actionLabel="全役へ" />
          <InternalLinkCard title="役判定クイズを解く" description="頻出役を問題形式で見分けます。" href="/training/yaku-quiz" actionLabel="練習する" />
          <InternalLinkCard title="実践でよく使う麻雀の基本へ戻る" description="点数計算、待ち、一向聴の入口に戻ります。" href="/rules" actionLabel="戻る" />
        </div>
      </section>
    </main>
  );
}

function FrequentYakuCard({ item }: { item: FrequentYaku }) {
  const openClass = item.openNote.includes("不可")
    ? "open-ng"
    : item.openNote.includes("下がる")
      ? "open-down"
      : "open-ok";

  return (
    <article className="yakuCard">
      <div className="yakuCardHeader">
        <div>
          <p className="yakuKana">{item.kana}</p>
          <h2>{item.name}</h2>
        </div>
        <div className="yakuBadges">
          <span className="badge-han">{item.han}</span>
          <span className={openClass}>{item.openNote}</span>
          <span className={item.priority === "最優先" ? "priority-first" : "priority-next"}>{item.priority}</span>
        </div>
      </div>
      <p className="yakuSummary">{item.summary}</p>
      <div className="yakuTileExample">
        <span>{item.tileLabel}</span>
        <div className="yakuHandFigure" aria-label={`${item.name}の13枚とアガリ牌の牌姿例`}>
          <div className="yakuHandTiles">
            {item.example.blocks.map((block, blockIndex) => (
              <div className={`yakuTileBlock${block.highlight ? " isHighlighted" : ""}`} key={`${item.name}-block-${blockIndex}`}>
                {block.label ? <span className="yakuTileBlockLabel">{block.label}</span> : null}
                <div className="yakuTileBlockTiles">
                  {block.tiles.map((tile, tileIndex) => (
                    <span
                      className={block.calledIndex === tileIndex ? "yakuBlockTile isCalled" : "yakuBlockTile"}
                      key={`${item.name}-${blockIndex}-${tile}-${tileIndex}`}
                    >
                      <img
                        src={`/tiles/${tile}-66-90-l-emb.png`}
                        alt={tileNames[tile] ?? tile}
                      />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={`yakuWinningTile${item.example.highlightWinningTile ? " isHighlighted" : ""}`}>
            <span>アガリ牌</span>
            <img src={`/tiles/${item.example.winningTile}-66-90-l-emb.png`} alt={tileNames[item.example.winningTile] ?? item.example.winningTile} />
          </div>
        </div>
      </div>
      <dl className="yakuPointList">
        <div className="yakuPointItem yakuPoint-focus">
          <dt>見るポイント</dt>
          <dd>{item.point}</dd>
        </div>
        <div className="yakuPointItem">
          <dt>頻出度の目安</dt>
          <dd>{item.frequency}</dd>
        </div>
      </dl>
      <Link className="textLink" href={item.href}>{item.name}をもう少し詳しく見る</Link>
    </article>
  );
}

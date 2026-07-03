import type { Metadata } from "next";
import Link from "next/link";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";
import { yakuArticles } from "../yakuArticleData";

export const metadata: Metadata = {
  title: "麻雀 役一覧 | 初心者向けに牌図つきで解説",
  description: "麻雀初心者が最初に覚えたい役を、リーチ、タンヤオ、役牌、平和、七対子などから牌図つきで解説します。"
};

type YakuItem = {
  name: string;
  kana: string;
  han: string;
  closedOnly?: boolean;
  openNote: string;
  beginnerPriority: "まず覚える" | "次に覚える" | "慣れたら";
  summary: string;
  tiles: string[];
  tileLabel: string;
  point: string;
  caution: string;
  href?: string;
};

const firstYaku: YakuItem[] = [
  {
    name: "リーチ",
    kana: "立直",
    han: "1翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "まず覚える",
    summary: "鳴いていない状態でテンパイしたときに宣言できる役です。初心者が一番使いやすい役のひとつです。",
    tiles: ["man6", "man7", "man8", "pin5"],
    tileLabel: "あと1枚でアガれる形",
    point: "あと1枚でアガれる形になったら、リーチを宣言できます。",
    caution: "ポン・チー・カンで鳴いているとリーチできません。",
    href: "/learn/reach-tanyao-yakuhai"
  },
  {
    name: "タンヤオ",
    kana: "断么九",
    han: "1翻",
    openNote: "鳴いても可",
    beginnerPriority: "まず覚える",
    summary: "2から8の数牌だけで作る役です。1・9・字牌を使わないので、見た目で判断しやすい役です。",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8"],
    tileLabel: "2〜8だけで作る",
    point: "手牌に1・9・字牌が入っていないかを見ます。",
    caution: "ルールによっては鳴きタンを採用しない場合があります。最初に確認しましょう。",
    href: "/learn/reach-tanyao-yakuhai"
  },
  {
    name: "役牌",
    kana: "やくはい",
    han: "1翻",
    openNote: "鳴いても可",
    beginnerPriority: "まず覚える",
    summary: "白・發・中、または場風・自風を3枚そろえる役です。鳴いても役が残るので初心者向きです。",
    tiles: ["ji6", "ji6", "ji6", "ji5", "ji5", "ji5", "ji7", "ji7", "ji7"],
    tileLabel: "白・發・中を3枚",
    point: "同じ役牌が3枚あるかを見ます。この例では中が3枚あります。",
    caution: "東南西北は、場風か自風でないと役牌にならないことがあります。",
    href: "/learn/reach-tanyao-yakuhai"
  },
  {
    name: "ツモ",
    kana: "門前清自摸和",
    han: "1翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "まず覚える",
    summary: "鳴いていない状態で、自分で引いた牌でアガる役です。リーチと一緒に出ることも多いです。",
    tiles: ["man5", "man5", "pin5"],
    tileLabel: "最後の1枚を自分で引く",
    point: "最後の牌を自分で引いてアガるとツモです。",
    caution: "鳴いている場合は、門前ツモの役はつきません。",
    href: "/learn/tsumo-and-ron"
  }
];

const nextYaku: YakuItem[] = [
  {
    name: "平和",
    kana: "ピンフ",
    han: "1翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "次に覚える",
    summary: "すべて順子で、雀頭が役牌ではなく、待ちが両面のときにつく役です。条件は少し細かいですが頻出です。",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "pin2", "pin2"],
    tileLabel: "順子中心のきれいな形",
    point: "刻子がなく、順子4つと雀頭でできているかを見ます。",
    caution: "雀頭が役牌だったり、カンチャン待ち・ペンチャン待ちだと平和になりません。",
    href: "/tools/score-table"
  },
  {
    name: "七対子",
    kana: "チートイツ",
    han: "2翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "次に覚える",
    summary: "同じ牌2枚のペアを7組作る特殊な役です。4面子1雀頭ではない例外形として覚えます。",
    tiles: ["man2", "man2", "man5", "man5", "pin3", "pin3", "sou4", "sou4", "ji1", "ji1"],
    tileLabel: "ペアを7組集める",
    point: "ペアが7組あるかを見ます。面子に分けなくてよい役です。",
    caution: "同じ牌4枚を2組分のペアとして数える扱いは通常しません。",
    href: "/tools/score-table"
  },
  {
    name: "一盃口",
    kana: "イーペーコー",
    han: "1翻",
    closedOnly: true,
    openNote: "鳴いたら不可",
    beginnerPriority: "次に覚える",
    summary: "同じ種類・同じ数字並びの順子を2組作る役です。リーチや平和と一緒に出ることがあります。",
    tiles: ["man2", "man3", "man4", "man2", "man3", "man4"],
    tileLabel: "同じ順子が2組",
    point: "同じ順子が2組あるかを見ます。この例では二三四萬が2組あります。",
    caution: "鳴くと一盃口は役として数えません。"
  },
  {
    name: "混一色",
    kana: "ホンイツ",
    han: "3翻 / 鳴き2翻",
    openNote: "鳴くと1翻下がる",
    beginnerPriority: "慣れたら",
    summary: "1種類の数牌と字牌だけで作る役です。見た目が分かりやすく、役牌と一緒になることも多いです。",
    tiles: ["man2", "man3", "man4", "man6", "man7", "man8", "ji1", "ji1", "ji1", "ji7", "ji7", "ji7"],
    tileLabel: "1種類の数牌と字牌",
    point: "萬子だけ、筒子だけ、索子だけのどれか1種類と字牌だけになっているかを見ます。",
    caution: "別の種類の数牌が混ざると混一色ではありません。"
  }
];

const laterYaku: YakuItem[] = [
  {
    name: "清一色",
    kana: "チンイツ",
    han: "6翻 / 鳴き5翻",
    openNote: "鳴くと1翻下がる",
    beginnerPriority: "慣れたら",
    summary: "1種類の数牌だけで作る高い役です。待ちが複雑になりやすいので、慣れてからで大丈夫です。",
    tiles: ["man1", "man2", "man3", "man4", "man5", "man6", "man7", "man8", "man9"],
    tileLabel: "1種類の数牌だけ",
    point: "萬子・筒子・索子のどれか1種類だけで手ができているかを見ます。",
    caution: "字牌が入ると清一色ではなく、混一色になります。"
  },
  {
    name: "対々和",
    kana: "トイトイ",
    han: "2翻",
    openNote: "鳴いても可",
    beginnerPriority: "慣れたら",
    summary: "刻子を4つ作る役です。ポンを使って進めやすい一方、待ちが単騎になりやすいです。",
    tiles: ["man2", "man2", "man2", "pin5", "pin5", "pin5", "sou7", "sou7", "sou7", "ji7", "ji7", "ji7"],
    tileLabel: "刻子を4つ",
    point: "順子がなく、同じ牌3枚の刻子が4つあるかを見ます。",
    caution: "ポンしすぎると守りにくくなるので、初心者は役牌とセットで考えると分かりやすいです。"
  },
  {
    name: "三色同順",
    kana: "サンショク",
    han: "2翻 / 鳴き1翻",
    openNote: "鳴くと1翻下がる",
    beginnerPriority: "慣れたら",
    summary: "萬子・筒子・索子で同じ数字並びの順子を作る役です。見つけられると手作りが楽しくなります。",
    tiles: ["man2", "man3", "man4", "pin2", "pin3", "pin4", "sou2", "sou3", "sou4"],
    tileLabel: "同じ数字並びを3種類",
    point: "同じ数字の順子が3種類そろっているかを見ます。この例では二三四が3種類あります。",
    caution: "数字が1つでもずれると三色同順にはなりません。"
  }
];

const yakuGroups = [
  {
    title: "まず覚える役",
    description: "ゲームを始めるなら、最初はこの4つからで十分です。",
    tone: "first",
    items: firstYaku
  },
  {
    title: "次に覚える役",
    description: "基本に慣れたら、よく出る形を少しずつ増やします。",
    tone: "next",
    items: nextYaku
  },
  {
    title: "慣れたら覚える役",
    description: "高い手や少し複雑な手です。最初から全部覚えなくて大丈夫です。",
    tone: "later",
    items: laterYaku
  }
];

const yakuArticleHrefByName = new Map(yakuArticles.map((article) => [article.name, `/rules/${article.slug}`]));

export default function YakuPage() {
  return (
    <main className="siteMain yakuGuidePage">
      <PageHero
        eyebrow="Yaku Guide"
        title="麻雀 役一覧"
        description="初心者が先に覚えたい役を、牌の形で見ながら確認できます。最初はリーチ・タンヤオ・役牌・ツモから覚えれば大丈夫です。"
        primaryLink={{ label: "初心者ロードマップへ戻る", href: "/learn" }}
        secondaryLink={{ label: "役を練習する", href: "/trainer" }}
      />

      <section className="yakuIntro">
        <SectionTitle title="役はアガるための条件" description="麻雀は形が完成していても、役が1つ以上ないとアガれません。牌図を見ながら、どこが役になっているかを確認しましょう。" />
        <div className="yakuRuleGrid">
          <article>
            <h2>最初は全部覚えない</h2>
            <p>リーチ、タンヤオ、役牌、ツモの4つだけでもかなり遊べます。複雑な役はあとから足していきます。</p>
          </article>
          <article>
            <h2>鳴ける役かを見る</h2>
            <p>リーチや平和は鳴くと使えません。役牌やタンヤオは鳴いても使えることが多いので、初心者向きです。</p>
          </article>
          <article>
            <h2>牌の形で覚える</h2>
            <p>役名を丸暗記するより、「1・9・字牌がない」「同じ字牌が3枚ある」のように見た目で覚えます。</p>
          </article>
        </div>
      </section>

      {yakuGroups.map((group) => (
        <section className={`yakuGroupSection yakuGroup-${group.tone}`} key={group.title}>
          <SectionTitle title={group.title} description={group.description} />
          <div className="yakuCardGrid">
            {group.items.map((item) => (
              <YakuCard item={item} key={item.name} />
            ))}
          </div>
        </section>
      ))}

      <section>
        <SectionTitle title="役を覚えたら" description="読んだだけで終わらせず、練習問題や点数表で確認すると定着しやすくなります。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="リーチ・タンヤオ・役牌を復習する" description="最初に覚える3つの役をロードマップ記事で確認します。" href="/learn/reach-tanyao-yakuhai" />
          <InternalLinkCard title="実戦問題で練習する" description="何切るや待ち当てで、役が見える手を増やしていきます。" href="/trainer" />
          <InternalLinkCard title="点数表を見る" description="平和や七対子の点数は、早見表で確認できます。" href="/tools/score-table" />
        </div>
      </section>
    </main>
  );
}

function YakuCard({ item }: { item: YakuItem }) {
  const openClass = item.openNote.includes("不可") ? "open-ng" : item.openNote.includes("下がる") ? "open-down" : "open-ok";
  const priorityClass = item.beginnerPriority === "まず覚える" ? "priority-first" : item.beginnerPriority === "次に覚える" ? "priority-next" : "priority-later";

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
          <span className={priorityClass}>{item.beginnerPriority}</span>
        </div>
      </div>
      <p className="yakuSummary">{item.summary}</p>
      <div className="yakuTileExample">
        <span>{item.tileLabel}</span>
        <div className="yakuTileStrip" aria-label={`${item.name}の牌例`}>
          {item.tiles.map((tile, index) => (
            <img key={`${item.name}-${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
          ))}
        </div>
      </div>
      <dl className="yakuPointList">
        <div className="yakuPointItem yakuPoint-focus">
          <dt>見るポイント</dt>
          <dd>{item.point}</dd>
        </div>
        <div className="yakuPointItem yakuPoint-caution">
          <dt>※ 注意</dt>
          <dd>{item.caution}</dd>
        </div>
      </dl>
      <Link className="textLink" href={yakuArticleHrefByName.get(item.name) ?? item.href ?? "/rules/yaku"}>{item.name}をもう少し詳しく見る</Link>
    </article>
  );
}

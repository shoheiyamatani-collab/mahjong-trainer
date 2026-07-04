import type { Metadata } from "next";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";

export const metadata: Metadata = {
  title: "実践でよく見る点数計算 | 平和・七対子・副露・40符50符",
  description:
    "麻雀の実戦で頻出する平和ロン、平和ツモ、平和なし、副露、七対子、50符ロン、40符ツモの点数を牌姿つきで解説します。"
};

type ScoreCase = {
  label: string;
  fu: string;
  tiles: string[];
  point: string;
  scores: string[];
};

type ScorePattern = {
  title: string;
  summary: string;
  ron: ScoreCase;
  tsumo: ScoreCase;
};

const scorePatterns: ScorePattern[] = [
  {
    title: "平和のロンとツモ",
    summary: "平和は実戦で最頻出級です。ロンなら30符、ツモなら20符を見る、と分けるだけで点数表がかなり読みやすくなります。",
    ron: {
      label: "平和ロン",
      fu: "30符",
      tiles: ["man2", "man3", "man4", "man3", "man4", "man5", "pin4", "pin5", "pin6", "sou5", "sou6", "sou7", "pin2", "pin2"],
      point: "ロンの平和は30符です。リーチ平和なら2翻30符、リーチ・平和・ドラなら3翻30符、という見方をします。",
      scores: ["子: 2翻2000 / 3翻3900 / 4翻7700(※8000)", "親: 2翻2900 / 3翻5800 / 4翻11600(※12000)"]
    },
    tsumo: {
      label: "平和ツモ",
      fu: "20符",
      tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "pin6", "pin7", "pin8", "sou4", "sou5", "sou6", "man5", "man5"],
      point: "平和ツモは20符です。ツモの1翻がつくので、実戦では2翻以上から見ることが多いです。",
      scores: ["子: 2翻400/700 / 3翻700/1300 / 4翻1300/2600", "親: 2翻700オール / 3翻1300オール / 4翻2600オール"]
    }
  },
  {
    title: "平和のないロンとツモ",
    summary: "平和にならない手は、ロンなら40符、ツモなら30符あたりがよく出ます。カンチャン、単騎、刻子、役牌雀頭があると平和ではありません。",
    ron: {
      label: "平和なしロン",
      fu: "40符になりやすい",
      tiles: ["man2", "man3", "man4", "pin6", "pin7", "pin8", "sou5", "sou5", "sou5", "man7", "man8", "man9", "pin2", "pin2"],
      point: "門前ロンは10符がつきます。さらに刻子や待ちの符があると、40符を見る場面が多くなります。",
      scores: ["子: 1翻1300 / 2翻2600 / 3翻5200", "親: 1翻2000 / 2翻3900 / 3翻7700"]
    },
    tsumo: {
      label: "平和なしツモ",
      fu: "30符になりやすい",
      tiles: ["man2", "man3", "man4", "pin6", "pin7", "pin8", "sou5", "sou5", "sou5", "man7", "man8", "man9", "pin2", "pin2"],
      point: "平和ではないツモは、ツモ符や刻子の符で30符になることが多いです。まず30符ツモを見慣れましょう。",
      scores: ["子: 1翻300/500 / 2翻500/1000 / 3翻1000/2000", "親: 1翻500オール / 2翻1000オール / 3翻2000オール"]
    }
  },
  {
    title: "副露したときのロンとツモ",
    summary: "ポン・チーしている手は門前ロン10符がありません。役牌ポンや喰いタンの手では、30符を見ることがかなり多いです。",
    ron: {
      label: "副露ロン",
      fu: "30符",
      tiles: ["ji7", "ji7", "ji7", "man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "man5", "man5"],
      point: "中をポンしたような役牌の鳴き手は、30符で見る場面が多いです。1翻30符、2翻30符を先に覚えます。",
      scores: ["子: 1翻1000 / 2翻2000 / 3翻3900", "親: 1翻1500 / 2翻2900 / 3翻5800"]
    },
    tsumo: {
      label: "副露ツモ",
      fu: "30符",
      tiles: ["ji7", "ji7", "ji7", "man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "man5", "man5"],
      point: "鳴いている手でツモった場合も、30符ツモを見ることが多いです。ロンと支払い欄が違う点に注意します。",
      scores: ["子: 1翻300/500 / 2翻500/1000 / 3翻1000/2000", "親: 1翻500オール / 2翻1000オール / 3翻2000オール"]
    }
  },
  {
    title: "七対子のロンとツモ",
    summary: "七対子は25符固定です。符を細かく数えず、七対子専用の25符を見ると決めておくと迷いません。",
    ron: {
      label: "七対子ロン",
      fu: "25符固定",
      tiles: ["man2", "man2", "man5", "man5", "pin3", "pin3", "pin6", "pin6", "sou4", "sou4", "sou8", "sou8", "ji1", "ji1"],
      point: "七対子は2翻から始まります。ロンなら25符のロン欄を見ます。",
      scores: ["子: 2翻1600 / 3翻3200 / 4翻6400", "親: 2翻2400 / 3翻4800 / 4翻9600"]
    },
    tsumo: {
      label: "七対子ツモ",
      fu: "25符固定",
      tiles: ["man2", "man2", "man5", "man5", "pin3", "pin3", "pin6", "pin6", "sou4", "sou4", "sou8", "sou8", "ji1", "ji1"],
      point: "七対子でツモった場合も25符固定です。子ツモは子が払う点、親が払う点を分けて見ます。",
      scores: ["子: 2翻400/800 / 3翻800/1600 / 4翻1600/3200", "親: 2翻800オール / 3翻1600オール / 4翻3200オール"]
    }
  },
  {
    title: "50符のロンと40符のツモ",
    summary: "暗刻、端牌や字牌、単騎待ち、役牌雀頭などで符が増えると、50符ロンや40符ツモを見ることがあります。",
    ron: {
      label: "50符ロン",
      fu: "50符",
      tiles: ["man1", "man1", "man1", "pin9", "pin9", "pin9", "sou2", "sou3", "sou4", "sou5", "sou6", "sou7", "pin5", "pin5"],
      point: "暗刻や単騎待ちなどで符が増えたロンは50符を見ることがあります。3翻50符は子6400、親9600です。",
      scores: ["子: 1翻1600 / 2翻3200 / 3翻6400 / 4翻満貫", "親: 1翻2400 / 2翻4800 / 3翻9600 / 4翻満貫"]
    },
    tsumo: {
      label: "40符ツモ",
      fu: "40符",
      tiles: ["man1", "man1", "man1", "pin2", "pin3", "pin4", "sou5", "sou6", "sou7", "sou6", "sou7", "sou8", "ji1", "ji1"],
      point: "ツモ符や暗刻、役牌雀頭などで40符になるツモもよく見ます。3翻40符は子1300/2600、親2600オールです。",
      scores: ["子: 1翻400/700 / 2翻700/1300 / 3翻1300/2600 / 4翻満貫", "親: 1翻700オール / 2翻1300オール / 3翻2600オール / 4翻満貫"]
    }
  }
];

const tileNames: Record<string, string> = {
  man1: "一萬",
  man2: "二萬",
  man3: "三萬",
  man4: "四萬",
  man5: "五萬",
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
  pin9: "九筒",
  sou2: "二索",
  sou3: "三索",
  sou4: "四索",
  sou5: "五索",
  sou6: "六索",
  sou7: "七索",
  sou8: "八索",
  ji1: "東",
  ji7: "中"
};

export default function PracticalScorePage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Practical Score"
        title="実践でよく見る点数計算"
        description="点数表を全部暗記する前に、実戦で特に出やすい点数だけを牌姿つきで確認します。平和、平和なし、副露、七対子、40符・50符を押さえるとかなり戦えます。"
        primaryLink={{ label: "初心者向け点数早見表を見る", href: "/tools/score-table" }}
        secondaryLink={{ label: "点数計算ツール", href: "/trainer" }}
      />

      <section>
        <SectionTitle
          title="まず点数表のどこを見るか"
          description="実戦では、手牌を見て「平和か」「鳴いているか」「七対子か」「符が増えそうか」を先に分けると、点数表の場所が決まります。"
        />
        <p className="scoreLeadFormula">平和 → 20符/30符　平和なし・副露 → 30符/40符　七対子 → 25符　符が多い手 → 40符/50符</p>
        <div className="linkCardGrid singleLinkGrid">
          <InternalLinkCard
            title="初心者向け点数早見表を見る"
            description="平和・七対子の早見表と、通常の点数早見表はこちらにまとめています。表そのものを確認したいときに使ってください。"
            href="/tools/score-table"
            actionLabel="点数早見表へ"
          />
        </div>
      </section>

      <section>
        <SectionTitle
          title="特に出やすい点数パターン"
          description="子の点数を中心に書いています。親の場合は同じ符・翻でも高くなります。ツモの「400/700」は、子が400点、親が700点を払うという意味です。"
        />
        <div className="practicalScoreGrid">
          {scorePatterns.map((pattern) => (
            <article className="practicalScoreCard" key={pattern.title}>
              <div>
                <h2>{pattern.title}</h2>
                <p>{pattern.summary}</p>
              </div>
              <div className="scorePairGrid">
                <ScoreCaseCard item={pattern.ron} />
                <ScoreCaseCard item={pattern.tsumo} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="次に進む" description="牌姿で点数の場所をつかんだら、実際のツールや問題で確認します。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="初心者向け点数早見表を見る" description="平和・七対子表と通常表を見ながら復習します。" href="/tools/score-table" actionLabel="点数早見表へ" />
          <InternalLinkCard title="点数計算ツールを使う" description="手牌と条件を入力して、実際の点数を確認します。" href="/trainer" actionLabel="ツールへ" />
          <InternalLinkCard title="実践でよく使う麻雀の基本へ戻る" description="役、待ち、一向聴の入口へ戻ります。" href="/rules" actionLabel="戻る" />
        </div>
      </section>
    </main>
  );
}

function ScoreCaseCard({ item }: { item: ScoreCase }) {
  return (
    <div className="scoreCaseCard">
      <div className="cardTopline">
        <h3>{item.label}</h3>
        <span className="scoreFuBadge">{item.fu}</span>
      </div>
      <TileStrip tiles={item.tiles} label={`${item.label}の牌姿`} />
      <p>{item.point}</p>
      <ul className="miniScoreList">
        {item.scores.map((score) => (
          <li key={score}>{score}</li>
        ))}
      </ul>
    </div>
  );
}

function TileStrip({ tiles, label }: { tiles: string[]; label: string }) {
  return (
    <div className="scoreTileStrip" aria-label={label}>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />
      ))}
    </div>
  );
}

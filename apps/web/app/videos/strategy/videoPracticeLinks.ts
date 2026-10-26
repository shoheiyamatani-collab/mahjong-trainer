import type { VideoGuide } from "../videoData";

type PracticeLink = { href: string; title: string; description: string; tone: "practice" | "analysis" };
type PracticeLinks = { note: string; links: [PracticeLink, PracticeLink] };

const checker: PracticeLink = {
  href: "/analysis/mahjong-tool", title: "牌理チェッカー",
  description: "自分の手牌で、打牌後のシャンテン数と受け入れを比較します。", tone: "analysis"
};
const score: PracticeLink = {
  href: "/tools", title: "点数計算ツール",
  description: "アガリ牌、親子、ロン・ツモなどを指定して、役・翻・符と支払いを確認します。", tone: "analysis"
};
const practice = (href: string, title: string, description: string): PracticeLink => ({ href, title, description, tone: "practice" });

export function getVideoPracticeLinks(guide: VideoGuide): PracticeLinks {
  const topic = `${guide.title} ${guide.category}`;
  if (/点数|符計算/.test(topic)) return {
    note: "同じ牌姿でも、門前・副露やアガリ方で計算結果が変わります。まず条件をそろえて比べましょう。",
    links: [practice("/trainer/score", "点数計算トレーニング", "牌姿から点数を答え、翻・符の見落としを振り返ります。"), score]
  };
  if (/鳴き|鳴く|副露/.test(topic) && !/読み/.test(topic)) return {
    note: "鳴いた後の役、門前で進める場合の価値、点数状況を分けて考えます。受け入れだけで鳴きの損得は決まりません。",
    links: [practice("/trainer/call-or-pass", "鳴く？鳴かない？", "提示された局面で鳴くかを選び、条件付きの判断理由を確認します。"), score]
  };
  if (/リーチ|ダマ/.test(topic) && !/読み/.test(topic)) return {
    note: "リーチは打点だけでなく、待ち、巡目、点数状況とセットで比較します。プロの選択を別の局面にそのまま当てはめないことが大切です。",
    links: [practice("/trainer/riichi-or-dama", "リーチ？ダマ？", "局面ごとの選択と、ロン・ツモの点数差を振り返ります。"), score]
  };
  if (/実戦解説|読み|捨て牌|守備|ベタオリ|押し引き|安全牌|手詰まり|回し打ち/.test(topic)) return {
    note: "対局後に見える相手の手牌と、その時点で見えていた情報は別です。自分の手の進み具合と、相手に対する安全性を分けて復習しましょう。",
    links: [practice("/trainer/push-or-fold", "押す？オリる？", "手牌価値、巡目、点数状況と捨て牌を見比べて判断します。"), {
      href: "/learn/guides/genbutsu-suji-kabe", title: "現物・スジ・カベの安全度",
      description: "確定している安全情報と、読みの手掛かりを区別して整理します。", tone: "analysis"
    }]
  };
  if (/待ち|多面|清一色|7枚形/.test(topic)) return {
    note: "待ちの種類を覚える練習と、実戦で残り枚数やフリテンを確認する作業は分けて行いましょう。",
    links: [practice("/trainer/seven-tile", "7枚形 多面待ち", "短い形で待ちを探し、見落としやすい分解を確認します。"), checker]
  };
  if (/役/.test(guide.category) || /役を|役の|タンヤオ/.test(guide.title)) return {
    note: "役の成立条件と、鳴いたときの翻数の変化を確認します。ドラだけではアガれません。",
    links: [practice("/training/yaku-quiz", "役の練習問題", "牌姿から成立している役を選んで復習します。"), score]
  };
  if (/配牌|悪配牌|弱い手/.test(topic)) return {
    note: "手役を決め打ちせず、速さと打点の候補を比較します。配牌分析の評価は条件付きの推定で、将来のアガリを保証しません。",
    links: [practice("/trainer/iishanten", "イーシャンテン何切る", "受け入れを比べて手を進める一打を選びます。"), {
      href: "/analysis/starting-hand", title: "配牌分析", description: "13枚の配牌から狙う役の候補を比較します。", tone: "analysis"
    }]
  };
  return {
    note: "まず受け入れの差を確認し、その後に打点や安全性を考えます。牌理チェッカーの枚数・良形率は、放銃率や実戦の期待値ではありません。",
    links: [practice("/trainer/iishanten", "イーシャンテン何切る", "手を進める打牌を選び、受け入れの違いを確認します。"), checker]
  };
}

import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "過去の名場面切り抜き",
  description: "Mリーグの過去の名場面切り抜きを掲載するページです。",
};

const highlightClips = [
  {
    id: "VNcXfxNfF3M",
    tag: "小四喜",
    title:
      "【Mリーグ】史上初！！役満小四喜！！KADOKAWAサクラナイツ『堀 慎吾』全国の人々が見ている！？最後尾からの逆転あるか！？【麻雀/名場面】",
    channel: "Mリーグ 至極の一局 【名場面切り抜き】",
    url: "https://www.youtube.com/watch?v=VNcXfxNfF3M",
  },
  {
    id: "2TtRuHvgnSg",
    tag: "四暗刻",
    title:
      "【2025-26】個人役満和了数最多！ #滝沢和典 ファイナル進出を決定づける親の四暗刻【#Mリーグ 公式】",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=2TtRuHvgnSg",
  },
  {
    id: "xFwdABCKhWI",
    tag: "四暗刻",
    title:
      "【Mリーグ/麻雀】解説/金「これは神の麻雀見たわ…」赤坂ドリブンズ『鈴木 たろう』テンパイ外しからの四暗刻を和了！！【名場面】",
    channel: "Mリーグ 至極の一局 【名場面切り抜き】",
    url: "https://www.youtube.com/watch?v=xFwdABCKhWI",
  },
  {
    id: "RYh81ICq4VQ",
    tag: "10万点超",
    title: "【伊達ちゃん無双】伊達朱里紗Mリーグ史上初の10万点超トップ#shorts",
    channel: "Mリーグの名場面集【切り抜き】",
    url: "https://www.youtube.com/shorts/RYh81ICq4VQ",
    isShort: true,
  },
  {
    id: "2WnA9YydO1g",
    tag: "四暗刻",
    title: "【天からの贈り物】Mリーグ　高宮まりが初の役満を達成‼奇跡の瞬間を見逃すな",
    channel: "Mリーグの名場面集【切り抜き】",
    url: "https://www.youtube.com/watch?v=2WnA9YydO1g",
  },
  {
    id: "RkYZlAWVll0",
    tag: "名勝負",
    title:
      "【Mリーグ/麻雀】恐ろしい… 何だコノ配牌は…？！KONAMI 麻雀格闘倶楽部「滝沢 和典」２着目のオーラス！！追いかける多井！！チャンスをモノにできるか？！【名場面】",
    channel: "Mリーグ 至極の一局 【名場面切り抜き】",
    url: "https://www.youtube.com/watch?v=RkYZlAWVll0",
  },
  {
    id: "gQWXAOqXd5M",
    tag: "名勝負",
    title:
      "【Mリーグ】ビタ止めに次ぐビタ止め！！『伊達朱里紗』vs『二階堂瑠美』vs『近藤誠一』vs『 堀慎吾』マンガで描いたら笑われる！？全員テンパイからまさかの結末！！【麻雀/名場面】",
    channel: "Mリーグ 至極の一局 【名場面切り抜き】",
    url: "https://www.youtube.com/watch?v=gQWXAOqXd5M",
  },
  {
    id: "iZ5oCzTdL6Y",
    tag: "役満集",
    title: "【Mリーグ】ダイジェストで振り返る、2023シーズンの役満集！",
    channel: "Mリーグの名場面集【切り抜き】",
    url: "https://www.youtube.com/watch?v=iZ5oCzTdL6Y",
  },
  {
    id: "V5ay0eETSgM",
    tag: "名勝負",
    title: "【Mリーグ】これが雷電、これが黒沢咲さん【切り抜き】",
    channel: "【Mリーグ切り抜き】ヨシノノ人間麻雀人間。",
    url: "https://www.youtube.com/watch?v=V5ay0eETSgM",
  },
  {
    id: "KBhCqYKsPT8",
    tag: "小四喜",
    title:
      "【未公開あり】堀慎吾 Mリーグ初『小四喜』成就の瞬間の楽屋の様子と感想戦【サクラナイツ公式】",
    channel: "KADOKAWAサクラナイツ公式チャンネル",
    url: "https://www.youtube.com/watch?v=KBhCqYKsPT8",
  },
  {
    id: "GMZIHTB9Au4",
    tag: "大三元",
    title:
      "【2025-26】鬼神 #下石戟 の手に舞い降りた三種の神器！開局に閃光の親大三元！【#Mリーグ 公式】",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=GMZIHTB9Au4",
  },
  {
    id: "UXbfKTRMMKY",
    tag: "四暗刻単騎",
    title: "黒沢咲、大逆転の四暗刻単騎【Mリーグ公式】",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=UXbfKTRMMKY",
  },
  {
    id: "S2MHTglmAqg",
    tag: "奇跡の倍満",
    title: "【伝説の試合】近藤誠一、条件を満たす一発ツモ・裏ドラのドラマティック倍満",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=S2MHTglmAqg",
  },
  {
    id: "oVoMFMOhRLk",
    tag: "大三元",
    title: "近藤誠一、Mリーグ2019初役満の大三元【Mリーグ公式役満集#1】",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=oVoMFMOhRLk",
  },
  {
    id: "fxQtTolXgfU",
    tag: "国士無双",
    title: "佐々木寿人、Mリーグ史上初の役満・国士無双【Mリーグ公式】",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=fxQtTolXgfU",
  },
  {
    id: "z9tbXxF_YCw",
    tag: "国士無双",
    title: "魚谷侑未、東1局いきなりの国士無双！【Mリーグ公式役満集#6】",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=z9tbXxF_YCw",
  },
  {
    id: "hLC80pstk7o",
    tag: "大三元",
    title: "朝倉康心、ファイナルで親の大三元！本人コメント付き【Mリーグ公式】",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=hLC80pstk7o",
  },
  {
    id: "1h3vJ_vx_JY",
    tag: "国士無双",
    title: "【2024-25】レギュラー最終戦に大波乱を起こす園田賢の国士無双！【Mリーグ公式】",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=1h3vJ_vx_JY",
  },
  {
    id: "PDl0C8JMHHg",
    tag: "四暗刻",
    title: "伊達朱里紗、開幕初日に役満・四暗刻を和了【Mリーグ公式】",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=PDl0C8JMHHg",
  },
  {
    id: "vqXvgrSHjr8",
    tag: "四暗刻",
    title: "【2024-25】二階堂瑠美、親の四暗刻ツモ！【Mリーグ公式】",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=vqXvgrSHjr8",
  },
  {
    id: "I3Sv-WxHjk4",
    tag: "四暗刻",
    title: "【2025-26】2枚目もスルー！浅井堂岐、気合いの四暗刻【Mリーグ公式】",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=I3Sv-WxHjk4",
  },
  {
    id: "HxkbCvUJB6E",
    tag: "四暗刻",
    title: "【2025-26】幻の三色同刻！？白鳥翔、伝説に残る四暗刻【Mリーグ公式】",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=HxkbCvUJB6E",
  },
] as const;

export default function HighlightClipsPage() {
  return (
    <main id="main-content" className="page-shell clip-list-page">
      <Link className="pro-back-link" href={siteConfig.routes.clips}>
        ← 切り抜き一覧へ戻る
      </Link>
      <header className="page-header directory-page-header">
        <h1 className="page-title">過去の名場面切り抜き</h1>
        <p className="page-lead">
          何度でも見返したい名勝負や、記憶に残る一局を{highlightClips.length}本まとめました。
        </p>
      </header>

      <section className="clip-video-grid" aria-label="過去の名場面動画一覧">
        {highlightClips.map((clip, index) => (
          <article className="clip-video-card" key={clip.id}>
            <ExternalLink className="clip-thumbnail-link" href={clip.url}>
              <span className="clip-thumbnail">
                <img
                  src={`https://i.ytimg.com/vi/${clip.id}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className="clip-play-mark" aria-hidden="true">▶</span>
                {"isShort" in clip && clip.isShort ? (
                  <span className="clip-short-label">SHORTS</span>
                ) : null}
              </span>
            </ExternalLink>
            <div className="clip-video-body">
              <div className="clip-video-meta">
                <span className="clip-video-number">HIGHLIGHT {String(index + 1).padStart(2, "0")}</span>
                <span className="clip-video-tag">{clip.tag}</span>
              </div>
              <h2>
                <ExternalLink href={clip.url}>{clip.title}</ExternalLink>
              </h2>
              <p>{clip.channel}</p>
              <ExternalLink className="clip-watch-link" href={clip.url}>
                YouTubeで見る <span aria-hidden="true">→</span>
              </ExternalLink>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

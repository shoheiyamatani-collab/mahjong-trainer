import type { VideoLesson, VideoLessonPoint } from "../videoLessonData";

type ProVideoSource = {
  slug: string;
  player: string;
  title: string;
  youtubeTitle: string;
  youtubeId: string;
  publishedAt: string;
  dateLabel: string;
  duration: string;
  category: string;
  description: string;
  focus: string;
  summary: string;
  recommendedFor: string[];
  points: VideoLessonPoint[];
  relatedHref: string;
  relatedLabel: string;
};

export type ProBookRecommendation = {
  title: string;
  author: string;
  description: string;
  amazonHref: string;
  rakutenHref: string;
  imageHref: string;
};

export type ProVideoLesson = VideoLesson & {
  player: string;
  publishedAt: string;
  proBook?: ProBookRecommendation;
};

const publisher = "発男道場【麻雀解説ch】";

const rakutenLayoutToken = "eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D";

function rakutenBookHref(productUrl: string) {
  return `https://hb.afl.rakuten.co.jp/ichiba/572bea14.af03c695.572bea15.8642e51d/?pc=${encodeURIComponent(productUrl)}&link_type=picttext&ut=${rakutenLayoutToken}`;
}

const proBooks: Record<string, ProBookRecommendation> = {
  "堀慎吾プロ": { title: "堀慎吾×渋川難波 麻雀 天才の思考 魔神の選択", author: "堀慎吾・渋川難波 著", description: "二人のトッププロが同じ局面をどう捉え、どこで判断を分けるのかを比較できます。動画で見た思考の組み立てを、対話形式でもう一段深く学べる一冊です。", amazonHref: "https://www.amazon.co.jp/dp/4046064242?tag=jongfolio-22", rakutenHref: rakutenBookHref("https://item.rakuten.co.jp/book/17512484/"), imageHref: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4240/9784046064240_1_7.jpg" },
  "渋川難波プロ": { title: "堀慎吾×渋川難波 麻雀 天才の思考 魔神の選択", author: "堀慎吾・渋川難波 著", description: "二人のトッププロが同じ局面をどう捉え、どこで判断を分けるのかを比較できます。動画で見た思考の組み立てを、対話形式でもう一段深く学べる一冊です。", amazonHref: "https://www.amazon.co.jp/dp/4046064242?tag=jongfolio-22", rakutenHref: rakutenBookHref("https://item.rakuten.co.jp/book/17512484/"), imageHref: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4240/9784046064240_1_7.jpg" },
  "仲林圭プロ": { title: "逆算から勝つ麻雀", author: "仲林圭 著", description: "目標から逆算して、その局面で何を優先するかを整理する仲林プロの思考法を学べます。実戦解説で語られた判断を、自分でも再現したい人におすすめです。", amazonHref: "https://www.amazon.co.jp/dp/4910825193?tag=jongfolio-22", rakutenHref: rakutenBookHref("https://item.rakuten.co.jp/book/17778240/"), imageHref: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/5199/9784910825199_1_5.jpg" },
  "園田賢プロ": { title: "麻雀のネクストレベルの扉を開く 魔術の麻雀", author: "園田賢 著", description: "局面の情報を組み合わせ、定石だけでは決めきれない一打を考えるための一冊です。園田プロならではの柔軟な発想を文章でも掘り下げられます。", amazonHref: "https://www.amazon.co.jp/dp/4801305490?tag=jongfolio-22", rakutenHref: rakutenBookHref("https://item.rakuten.co.jp/book/16936209/"), imageHref: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/5496/9784801305496_1_2.jpg" },
  "鈴木優プロ": { title: "麻雀 攻撃特化の書", author: "鈴木優 著", description: "前へ出るべき局面と、その攻撃に十分な見返りがあるかを整理できます。動画で見た踏み込みの根拠を、体系的に確認したい人に向く一冊です。", amazonHref: "https://www.amazon.co.jp/dp/4801941133?tag=jongfolio-22", rakutenHref: rakutenBookHref("https://item.rakuten.co.jp/bookfan/bk-4801941133/"), imageHref: "https://thumbnail.image.rakuten.co.jp/@0_mall/bookfan/cabinet/01110/bk4801941133.jpg" },
  "伊達朱里紗プロ": { title: "伊達朱里紗は二兎を追う ～「好き」から天職へ～", author: "伊達朱里紗 著", description: "声優とプロ雀士、二つの世界で挑戦を続ける伊達プロ自身の言葉に触れられます。打牌技術だけでなく、勝負への向き合い方も知りたい人へ。", amazonHref: "https://www.amazon.co.jp/dp/484707338X?tag=jongfolio-22", rakutenHref: rakutenBookHref("https://item.rakuten.co.jp/book/17630717/"), imageHref: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3380/9784847073380_1_2.jpg" },
  "醍醐大プロ": { title: "孤高の麻雀", author: "醍醐大 著", description: "長い実戦経験から培った、局面を冷静に捉える醍醐プロの麻雀観を学べます。動画の一打を支える考え方まで知りたい人におすすめです。", amazonHref: "https://www.amazon.co.jp/dp/4801946038?tag=jongfolio-22", rakutenHref: rakutenBookHref("https://item.rakuten.co.jp/bookfan/bk-4801946038/"), imageHref: "https://thumbnail.image.rakuten.co.jp/@0_mall/bookfan/cabinet/01164/bk4801946038.jpg" },
  "松本吉弘プロ": { title: "初代Mリーガー松本のベストバランス麻雀", author: "松本吉弘 著", description: "攻撃と守備のどちらかに偏らず、局面に合うバランスを選ぶ基準を整理できます。実戦解説の判断を自分の対局へ持ち帰るのに役立つ一冊です。", amazonHref: "https://www.amazon.co.jp/dp/4839969264?tag=jongfolio-22", rakutenHref: rakutenBookHref("https://item.rakuten.co.jp/book/15845104/"), imageHref: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/9264/9784839969264.jpg" },
  "石井一馬プロ": { title: "麻雀偏差値70へのメソッド 改訂版", author: "石井一馬 著", description: "読み、手組み、押し引きを一段高い精度へ引き上げるための考え方を学べます。動画で気になった判断を、項目ごとに復習したい人に向きます。", amazonHref: "https://www.amazon.co.jp/dp/4801947042?tag=jongfolio-22", rakutenHref: rakutenBookHref("https://item.rakuten.co.jp/bookfan/bk-4801947042/"), imageHref: "https://thumbnail.image.rakuten.co.jp/@0_mall/bookfan/cabinet/01179/bk4801947042.jpg" },
  "朝倉康心プロ": { title: "麻雀の失敗学", author: "朝倉康心 著", description: "結果だけで打牌を評価せず、失敗から再現性のある改善点を見つける方法を学べます。安定した判断と振り返りを身につけたい人におすすめです。", amazonHref: "https://www.amazon.co.jp/dp/4801919324?tag=jongfolio-22", rakutenHref: rakutenBookHref("https://item.rakuten.co.jp/book/15896059/"), imageHref: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/9327/9784801919327.jpg" }
};

const proVideoSources: ProVideoSource[] = [
  {
    slug: "hori-shingo-practical-commentary",
    player: "堀慎吾プロ",
    title: "堀慎吾プロ｜小さな天才の思考に迫る",
    youtubeTitle: "【麻雀実戦解説】小さな天才の思考に迫る(堀慎吾プロ)",
    youtubeId: "n6ZEbHLZlgc",
    publishedAt: "2025-03-29",
    dateLabel: "2025年3月29日",
    duration: "1時間18分43秒",
    category: "局面判断・手組み",
    description: "堀慎吾プロが一半荘を打ちながら、手牌の価値と局面に応じた選択を言葉にする実戦解説です。",
    focus: "結論だけでなく、候補を絞る速さと、手牌価値が変わった瞬間の判断に注目です。",
    summary: "手牌だけを見るのではなく、巡目・打点・相手の動きを短い手順で整理し、その局面で最も損の少ない選択を積み重ねる考え方を学べます。",
    recommendedFor: ["何切るの正解は分かっても実戦で迷う人", "判断を速くする考え方を知りたい人", "トッププロの手順比較を一半荘通して見たい人"],
    points: [
      { title: "候補を素早く絞る", description: "すべてを考え直さず、重要な比較軸から打牌候補を整理します。" },
      { title: "手牌価値の変化を見る", description: "ツモや他家の動きで、速度・打点・安全度の優先順位を更新します。" },
      { title: "小さな差を積み重ねる", description: "派手な一打より、毎巡の損失を抑える判断の連続に注目します。" }
    ],
    relatedHref: "/analysis/mahjong-tool",
    relatedLabel: "牌理チェッカーで候補を比較する"
  },
  {
    slug: "nakabayashi-kei-practical-commentary-1",
    player: "仲林圭プロ",
    title: "仲林圭プロ 第1回｜まさに麻雀の教科書",
    youtubeTitle: "【麻雀実戦解説】まさに麻雀の教科書！現雀王の思考に迫る(仲林圭プロ)",
    youtubeId: "nCVX7izagtg",
    publishedAt: "2025-02-08",
    dateLabel: "2025年2月8日",
    duration: "1時間8分46秒",
    category: "総合判断・バランス",
    description: "仲林圭プロの一半荘を通して、手組み・押し引き・鳴きの基準をバランスよく学べる実戦解説です。",
    focus: "基本に忠実な選択と、基本から外れるときの理由を分けて聞くと理解しやすい動画です。",
    summary: "牌効率だけに寄せず、打点・速度・守備を同じテーブルに載せて比較する、再現しやすい実戦判断が中心です。",
    recommendedFor: ["上級者の基本動作を一から確認したい人", "押し引きと手組みをまとめて学びたい人", "仲林圭プロの実戦解説を初めて見る人"],
    points: [
      { title: "基本の優先順位", description: "手牌価値、巡目、相手の攻撃を順に確認して判断します。" },
      { title: "例外には理由がある", description: "牌効率から外れる選択を、局面情報と結び付けて理解します。" },
      { title: "一局ではなく半荘で考える", description: "点棒状況と順位を含め、目の前のアガリ以外の価値も見ます。" }
    ],
    relatedHref: "/videos/strategy/push-fold-judgment-ten-questions",
    relatedLabel: "押し引き問題で判断を試す"
  },
  {
    slug: "nakabayashi-kei-practical-commentary-2",
    player: "仲林圭プロ",
    title: "仲林圭プロ 第2回｜強くなるための教科書",
    youtubeTitle: "【麻雀実戦解説】強くなるための教科書！仲林圭プロの思考に迫る（第2回）",
    youtubeId: "xvgy6IC_TGw",
    publishedAt: "2026-03-28",
    dateLabel: "2026年3月28日",
    duration: "1時間16分46秒",
    category: "総合判断・バランス",
    description: "仲林圭プロの第2回。手牌進行を固定せず、局面に合わせて方針を更新する過程を追える実戦解説です。",
    focus: "最初の構想に固執せず、ツモと場況に応じて何を変え、何を残すかに注目です。",
    summary: "最初に決めた手役や形を守り続けるのではなく、新しい情報が入るたびに最善の方針へ組み替える柔軟さを学べます。",
    recommendedFor: ["手役を決め打ちしやすい人", "実戦で方針転換するタイミングを知りたい人", "仲林圭プロ第1回の次に深く学びたい人"],
    points: [
      { title: "構想を更新する", description: "ツモと捨て牌から、最初の方針が今も有効かを確認します。" },
      { title: "残す牌に役割を持たせる", description: "受け入れ、打点、安全度のどれを担う牌かを考えます。" },
      { title: "押す根拠を明確にする", description: "形だけでなく、見返りと失点リスクを比べて前進します。" }
    ],
    relatedHref: "/analysis/mahjong-tool",
    relatedLabel: "牌理チェッカーで手順を比較する"
  },
  {
    slug: "nakabayashi-kei-practical-commentary-3",
    player: "仲林圭プロ",
    title: "仲林圭プロ 第3回｜全局タメになる麻雀の教科書",
    youtubeTitle: "【麻雀実戦解説】全局タメになる！『麻雀の教科書』仲林圭プロの思考に迫る（第3回）",
    youtubeId: "7-IOZ_lLt3g",
    publishedAt: "2026-07-25",
    dateLabel: "2026年7月25日",
    duration: "1時間9分1秒",
    category: "総合判断・バランス",
    description: "仲林圭プロ第3回。毎局の選択理由を追いながら、判断の再現性を高められる実戦解説です。",
    focus: "結果ではなく、選択時点で見えていた情報から判断を組み立てる姿勢に注目です。",
    summary: "アガったか放銃したかで選択を評価せず、その時点の情報で期待できる選択だったかを振り返る方法を学べます。",
    recommendedFor: ["結果に引っ張られて打牌を反省しがちな人", "牌譜検討の質を上げたい人", "仲林圭プロの思考をシリーズで追いたい人"],
    points: [
      { title: "結果と判断を分ける", description: "偶然のツモや放銃ではなく、選択時点の根拠を評価します。" },
      { title: "毎局に学びを残す", description: "勝負手以外の小さな選択にも、次へ使える基準を見つけます。" },
      { title: "振り返れる言葉にする", description: "打牌理由を短く説明できる状態を目指します。" }
    ],
    relatedHref: "/videos/strategy/common-bad-habits-self-check",
    relatedLabel: "打ち方の悪癖を確認する"
  },
  {
    slug: "sonoda-ken-practical-commentary",
    player: "園田賢プロ",
    title: "園田賢プロ｜卓上の魔術師の思考に迫る",
    youtubeTitle: "【麻雀実戦解説】面白すぎる解説！卓上の魔術師の思考に迫る(園田賢プロ)",
    youtubeId: "OT7a9M6pnQM",
    publishedAt: "2025-03-01",
    dateLabel: "2025年3月1日",
    duration: "1時間24分25秒",
    category: "鳴き・構想",
    description: "園田賢プロが、鳴きや手順を使って局面を動かす狙いまで言語化する実戦解説です。",
    focus: "鳴く牌だけでなく、鳴いた後に何を引き、どの形へ進みたいのかまで追うのがポイントです。",
    summary: "鳴きを単なる速度アップとして使わず、相手への影響や次の手順まで含めて局面を設計する考え方が見どころです。",
    recommendedFor: ["鳴いた後の形が苦しくなりやすい人", "副露判断の目的を深く考えたい人", "場全体を使った構想を学びたい人"],
    points: [
      { title: "鳴く目的を決める", description: "速度、打点、局面操作のどれを狙う鳴きかを見ます。" },
      { title: "次の一手まで構想する", description: "鳴いた直後だけでなく、その後の受け入れと守備を考えます。" },
      { title: "相手への影響を見る", description: "自分の仕掛けが他家の判断をどう変えるかも材料にします。" }
    ],
    relatedHref: "/videos/strategy/beginner-calling-theory",
    relatedLabel: "鳴きの判断基準を確認する"
  },
  {
    slug: "suzuki-yu-practical-commentary",
    player: "鈴木優プロ",
    title: "鈴木優プロ｜戦闘民族の思考に迫る",
    youtubeTitle: "【麻雀実戦解説】前MVP！戦闘民族の思考に迫る（鈴木優プロ）",
    youtubeId: "9-ZSKzLzkQA",
    publishedAt: "2024-08-10",
    dateLabel: "2024年8月10日",
    duration: "1時間18分16秒",
    category: "攻撃・押し引き",
    description: "鈴木優プロの攻撃的な選択を、押す価値と引く条件の両面から追う実戦解説です。",
    focus: "強く押す場面ほど、手牌価値・巡目・相手の打点をどう比較しているかに注目です。",
    summary: "攻撃型の打ち方を勢いでまねるのではなく、押したときに得られる価値と失う可能性を比べる判断を学べます。",
    recommendedFor: ["押しすぎ・引きすぎの基準を整えたい人", "攻撃的な麻雀の根拠を知りたい人", "勝負手で迷わず前へ出たい人"],
    points: [
      { title: "押す価値を数える", description: "打点、待ち、親番など、前進する見返りを整理します。" },
      { title: "危険だけで止まらない", description: "放銃リスクと同時に、降りたときに失う価値も見ます。" },
      { title: "勝負所を選ぶ", description: "すべて押すのではなく、局面ごとに強く踏み込む条件を決めます。" }
    ],
    relatedHref: "/videos/strategy/push-fold-judgment-ten-questions",
    relatedLabel: "押し引き判断問題に挑戦する"
  },
  {
    slug: "date-arisa-practical-commentary",
    player: "伊達朱里紗プロ",
    title: "伊達朱里紗プロ｜最強Mリーガーの思考に迫る",
    youtubeTitle: "【麻雀実戦解説】ずっと聴いてられる！最強Mリーガーの思考に迫る(伊達朱里紗プロ)",
    youtubeId: "EaoJhdqOCTE",
    publishedAt: "2024-10-13",
    dateLabel: "2024年10月13日",
    duration: "1時間12分10秒",
    category: "総合判断・バランス",
    description: "伊達朱里紗プロが、手牌価値と局面を照らし合わせながら一打の理由を丁寧に話す実戦解説です。",
    focus: "リーチ、ダマ、鳴き、守備へ切り替える境目をどの情報で判断しているかに注目です。",
    summary: "手牌の形だけで決めず、点棒状況と相手の動きを足して、攻守の方針を明確に切り替える過程を学べます。",
    recommendedFor: ["攻守の切り替えが遅れやすい人", "リーチ判断の材料を増やしたい人", "分かりやすい言語化でプロの思考を学びたい人"],
    points: [
      { title: "方針を先に決める", description: "手を進めるのか、打点を見るのか、守備へ回るのかを整理します。" },
      { title: "リーチの目的を見る", description: "打点、アガリ率、局面への圧力から選択を比べます。" },
      { title: "切り替えを早くする", description: "相手の攻撃を受けたら、現在の手牌価値をすぐ評価し直します。" }
    ],
    relatedHref: "/videos/strategy/riichi-judgment-ten-questions",
    relatedLabel: "リーチ判断問題で確認する"
  },
  {
    slug: "daigo-dai-practical-commentary",
    player: "醍醐大プロ",
    title: "醍醐大プロ｜MVPの思考に迫る",
    youtubeTitle: "【麻雀実戦解説】強すぎる！MVPの思考に迫る(醍醐大プロ)",
    youtubeId: "SWvzwJtFN9U",
    publishedAt: "2025-05-17",
    dateLabel: "2025年5月17日",
    duration: "1時間17分31秒",
    category: "鳴き・構想",
    description: "醍醐大プロの手組みと鳴き判断を通して、局全体のバランスを取る思考を学ぶ実戦解説です。",
    focus: "目先の受け入れだけでなく、最終形・打点・他家の速度をどう一緒に見るかがポイントです。",
    summary: "一つの数字や形だけで判断せず、複数の小さな材料を組み合わせて、半荘全体で安定する選択を作る動画です。",
    recommendedFor: ["鳴きと門前の比較で迷う人", "手組みを局全体の情報と結び付けたい人", "安定感のある実戦判断を学びたい人"],
    points: [
      { title: "最終形から逆算する", description: "今の受け入れだけでなく、テンパイ時の待ちと打点を見ます。" },
      { title: "他家の速度を加える", description: "自分の手牌評価を、相手の仕掛けや捨て牌で調整します。" },
      { title: "選択を総合点で比べる", description: "速度、打点、安全度の小さな差をまとめて判断します。" }
    ],
    relatedHref: "/videos/strategy/calling-to-improve-wait-quiz",
    relatedLabel: "待ちを良くする鳴き問題へ進む"
  },
  {
    slug: "matsumoto-yoshihiro-practical-commentary",
    player: "松本吉弘プロ",
    title: "松本吉弘プロ｜卓上のヒットマンの思考に迫る",
    youtubeTitle: "【麻雀実戦解説】丁寧な言語化！卓上のヒットマンの思考に迫る (松本吉弘プロ)",
    youtubeId: "fJXxLfpW4WU",
    publishedAt: "2026-04-25",
    dateLabel: "2026年4月25日",
    duration: "1時間29分51秒",
    category: "総合判断・バランス",
    description: "松本吉弘プロが一半荘の選択を丁寧に言語化し、手順を組み替える理由まで追える実戦解説です。",
    focus: "打牌の結果より、その前に比べた候補と採用しなかった理由を聞くのがおすすめです。",
    summary: "候補を一枚に決めるまでの比較を丁寧に聞けるため、自分の実戦で同じ判断手順を再現しやすい動画です。",
    recommendedFor: ["打牌理由をうまく言葉にできない人", "候補同士の比較方法を学びたい人", "長い実戦解説で思考の流れを追いたい人"],
    points: [
      { title: "候補を並べて比較する", description: "最初から一枚に決めず、残した場合の未来を比べます。" },
      { title: "不採用の理由も聞く", description: "切った牌だけでなく、ほかの候補が劣る理由に注目します。" },
      { title: "判断手順をまねる", description: "個別の正解より、別の牌姿にも使える比較の順番を学びます。" }
    ],
    relatedHref: "/analysis/mahjong-tool",
    relatedLabel: "牌理チェッカーで候補を比べる"
  },
  {
    slug: "shibukawa-nanba-practical-commentary-2",
    player: "渋川難波プロ",
    title: "渋川難波プロ 第2回｜魔神の思考に迫る",
    youtubeTitle: "【麻雀実戦解説】やはり上手すぎる解説！魔神の思考に迫る(渋川難波プロ第2回)",
    youtubeId: "DP6Vw3c7QbM",
    publishedAt: "2025-12-27",
    dateLabel: "2025年12月27日",
    duration: "1時間20分23秒",
    category: "読み・押し引き",
    description: "渋川難波プロ第2回。攻守のバランスと、読みを実戦判断へ使う方法を追う解説です。",
    focus: "読みを待ちの断定に使わず、危険度や押し引きの差を付ける材料として使う点に注目です。",
    summary: "不確かな読みを過信せず、確定情報と組み合わせて押し引きの精度を少しずつ上げる考え方を学べます。",
    recommendedFor: ["読みを実戦でどう使うか迷う人", "攻守のバランスを整えたい人", "渋川難波プロの判断を深く知りたい人"],
    points: [
      { title: "確定情報を土台にする", description: "現物、巡目、打点など動かない情報から考えます。" },
      { title: "読みで差を付ける", description: "待ちを断定せず、候補の危険度を比較するために使います。" },
      { title: "押し引きへつなげる", description: "読んだ内容を、実際に押すか降りるかの判断へ反映します。" }
    ],
    relatedHref: "/videos/strategy/how-to-use-mahjong-reading",
    relatedLabel: "読みの使い方を整理する"
  },
  {
    slug: "ishii-kazuma-practical-commentary",
    player: "石井一馬プロ",
    title: "石井一馬プロ｜現最高位の思考に迫る",
    youtubeTitle: "【麻雀実戦解説】読みの精度が高すぎる！現最高位の思考に迫る（石井一馬プロ）",
    youtubeId: "dMwtegYKvt8",
    publishedAt: "2025-11-22",
    dateLabel: "2025年11月22日",
    duration: "1時間19分51秒",
    category: "読み・押し引き",
    description: "石井一馬プロの精度の高い読みを、捨て牌や手順の情報と一緒に学べる実戦解説です。",
    focus: "読みの結論より、どの捨て牌を手掛かりにして可能性を上げ下げしたかに注目です。",
    summary: "捨て牌を一枚ずつ暗記するのではなく、通常の手順と違う動きから相手の手牌候補を狭める考え方が中心です。",
    recommendedFor: ["捨て牌読みの根拠を増やしたい人", "相手の手順を追う練習をしたい人", "読みを押し引きへ活用したい人"],
    points: [
      { title: "手順の違和感を探す", description: "一般的な切り順から外れた牌に注目します。" },
      { title: "候補を消し込む", description: "一つに断定せず、可能性が下がる形を順に除きます。" },
      { title: "危険度へ変換する", description: "読みの結果を、切る牌の比較と押し引きに使います。" }
    ],
    relatedHref: "/videos/strategy/discard-reading-ten-question-test",
    relatedLabel: "捨て牌読みの問題に挑戦する"
  },
  {
    slug: "asakura-koshin-practical-commentary",
    player: "朝倉康心プロ",
    title: "朝倉康心プロ｜初代天鳳位の思考に迫る",
    youtubeTitle: "【麻雀実戦解説】㊗️Mリーガー復帰！初代天鳳位の思考に迫る(朝倉康心プロ)",
    youtubeId: "iXFenwYoQZY",
    publishedAt: "2026-05-30",
    dateLabel: "2026年5月30日",
    duration: "1時間16分13秒",
    category: "安定・振り返り",
    description: "朝倉康心プロの実戦から、成績を安定させるための再現性ある判断を学ぶ解説です。",
    focus: "一度の結果ではなく、同じ条件で繰り返したときに損を減らせる選択かを見るのがポイントです。",
    summary: "短期の勝ち負けに振り回されず、長く続けても崩れにくい選択を積み重ねる考え方を学べます。",
    recommendedFor: ["成績の波で打ち方が変わりやすい人", "オンライン麻雀の振り返りを改善したい人", "安定する判断基準を作りたい人"],
    points: [
      { title: "再現性を優先する", description: "一度だけ成功する選択より、長く使える基準を重視します。" },
      { title: "結果で判断を変えない", description: "ツモや放銃の結果と、選択時点の良し悪しを分けます。" },
      { title: "振り返る単位を小さくする", description: "半荘全体ではなく、迷った一打の比較から改善します。" }
    ],
    relatedHref: "/videos/strategy/common-bad-habits-self-check",
    relatedLabel: "打ち方の悪癖を見直す"
  },
  {
    slug: "nishimura-yuichiro-practical-commentary",
    player: "西村雄一郎プロ",
    title: "西村雄一郎プロ｜現雀王・天鳳位の思考に迫る",
    youtubeTitle: "【麻雀実戦解説】現雀王！天鳳位！鉄強・西村雄一郎プロの思考に迫る",
    youtubeId: "qafByjyXd7I",
    publishedAt: "2026-08-15",
    dateLabel: "2026年8月15日",
    duration: "1時間9分33秒",
    category: "読み・押し引き",
    description: "西村雄一郎プロの実戦から、オンラインと競技麻雀で磨かれた精密な判断を学べる解説です。",
    focus: "牌効率の土台に、場況・点棒状況・相手の手順をどの順番で重ねるかに注目です。",
    summary: "基本の牌効率を出発点にしながら、実戦で見える情報を足して選択を細かく調整する過程を追えます。",
    recommendedFor: ["牌効率の次に何を学ぶか迷っている人", "オンライン麻雀の判断を競技的に深めたい人", "新しい実戦解説を見たい人"],
    points: [
      { title: "牌効率を土台にする", description: "まず手牌だけの基本形を確認してから補正します。" },
      { title: "場況で微調整する", description: "見えている牌と相手の速度から候補の差を付けます。" },
      { title: "順位条件を忘れない", description: "局収支だけでなく、半荘の目的に合う選択かを見ます。" }
    ],
    relatedHref: "/analysis/mahjong-tool",
    relatedLabel: "牌理チェッカーで基本形を確認する"
  }
];

export const proVideoLessons: ProVideoLesson[] = proVideoSources.map((source) => ({
  slug: `pro/${source.slug}`,
  player: source.player,
  publishedAt: source.publishedAt,
  proBook: proBooks[source.player],
  guide: {
    title: source.title,
    description: source.description,
    focus: source.focus,
    level: "上級者・競技麻雀を深く学びたい人",
    category: source.category,
    dateLabel: source.dateLabel,
    readingTime: "約4分で読める",
    relatedHref: source.relatedHref,
    relatedLabel: source.relatedLabel,
    youtubeId: source.youtubeId,
    publisher
  },
  youtubeTitle: source.youtubeTitle,
  videoDuration: source.duration,
  lead: `${source.player}が一半荘を打ちながら、一打ごとの理由を話す「麻雀実戦解説」シリーズです。打牌の結論より、判断に使った情報と比較の順番に注目して見ていきます。`,
  recommendedFor: source.recommendedFor,
  watchPoints: source.points,
  overview: [source.summary],
  keyPoints: source.points,
  practicalPoints: ["動画を止めて自分の候補を一枚決める", "プロの結論より先に判断材料を比べる", "気になった一打だけを牌譜や解析ツールで振り返る"],
  relatedLinks: [
    { href: source.relatedHref, label: source.relatedLabel },
    { href: "/analysis/mahjong-tool", label: "牌理チェッカーで打牌候補を比較する" },
    { href: "/trainer", label: "麻雀トレーニングで判断を試す" }
  ],
  nextLinks: [
    { href: "/videos/strategy/pro", label: "プロの実戦解説一覧へ戻る" }
  ]
}));

export function getProVideoLesson(slug: string) {
  return proVideoLessons.find((lesson) => lesson.slug === `pro/${slug}`);
}

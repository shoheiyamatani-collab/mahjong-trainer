import type { Source } from "@/types/mleague";

const checkedAt = "2026-09-24";

export type TeamTimelineEntry = {
  season: string;
  title: string;
  description: string;
};

export type TeamSeasonReview = {
  season: string;
  title: string;
  description: string;
};

export type TeamEditorialProfile = {
  teamId: string;
  foundedSeason: string;
  owner: string;
  championshipSeasons: string[];
  characteristics: string[];
  seasonReviews: TeamSeasonReview[];
  milestones: TeamTimelineEntry[];
  rosterChanges: TeamTimelineEntry[];
};

export type TeamSeasonSummary = {
  season: string;
  finalRank: number;
  teamCount: number;
  resultLabel: string;
};

const seasonFinalRanks: Record<
  string,
  { teamCount: number; semiFinalCutoff: number; ranks: Record<string, number> }
> = {
  "2018-19": {
    teamCount: 7,
    semiFinalCutoff: 4,
    ranks: {
      "team-drivens": 1,
      "team-furinkazan": 2,
      "team-abemas": 3,
      "team-fightclub": 4,
      "team-pirates": 5,
      "team-phoenix": 6,
      "team-raiden": 7,
    },
  },
  "2019-20": {
    teamCount: 8,
    semiFinalCutoff: 6,
    ranks: {
      "team-pirates": 1,
      "team-phoenix": 2,
      "team-abemas": 3,
      "team-sakuraknights": 4,
      "team-fightclub": 5,
      "team-raiden": 6,
      "team-drivens": 7,
      "team-furinkazan": 8,
    },
  },
  "2020-21": {
    teamCount: 8,
    semiFinalCutoff: 6,
    ranks: {
      "team-furinkazan": 1,
      "team-sakuraknights": 2,
      "team-abemas": 3,
      "team-drivens": 4,
      "team-fightclub": 5,
      "team-raiden": 6,
      "team-pirates": 7,
      "team-phoenix": 8,
    },
  },
  "2021-22": {
    teamCount: 8,
    semiFinalCutoff: 6,
    ranks: {
      "team-sakuraknights": 1,
      "team-phoenix": 2,
      "team-abemas": 3,
      "team-fightclub": 4,
      "team-furinkazan": 5,
      "team-pirates": 6,
      "team-drivens": 7,
      "team-raiden": 8,
    },
  },
  "2022-23": {
    teamCount: 8,
    semiFinalCutoff: 6,
    ranks: {
      "team-abemas": 1,
      "team-fightclub": 2,
      "team-raiden": 3,
      "team-furinkazan": 4,
      "team-pirates": 5,
      "team-sakuraknights": 6,
      "team-drivens": 7,
      "team-phoenix": 8,
    },
  },
  "2023-24": {
    teamCount: 9,
    semiFinalCutoff: 6,
    ranks: {
      "team-pirates": 1,
      "team-drivens": 2,
      "team-sakuraknights": 3,
      "team-furinkazan": 4,
      "team-abemas": 5,
      "team-fightclub": 6,
      "team-beast": 7,
      "team-raiden": 8,
      "team-phoenix": 9,
    },
  },
  "2024-25": {
    teamCount: 9,
    semiFinalCutoff: 6,
    ranks: {
      "team-phoenix": 1,
      "team-pirates": 2,
      "team-drivens": 3,
      "team-raiden": 4,
      "team-fightclub": 5,
      "team-abemas": 6,
      "team-sakuraknights": 7,
      "team-furinkazan": 8,
      "team-beast": 9,
    },
  },
  "2025-26": {
    teamCount: 10,
    semiFinalCutoff: 6,
    ranks: {
      "team-furinkazan": 1,
      "team-fightclub": 2,
      "team-raiden": 3,
      "team-beast": 4,
      "team-phoenix": 5,
      "team-drivens": 6,
      "team-abemas": 7,
      "team-pirates": 8,
      "team-sakuraknights": 9,
      "team-jets": 10,
    },
  },
};

function getResultLabel(rank: number, semiFinalCutoff: number) {
  if (rank === 1) return "優勝";
  if (rank === 2) return "準優勝";
  if (rank <= 4) return `ファイナル ${rank}位`;
  if (rank <= semiFinalCutoff) return `セミファイナル ${rank}位`;
  return `レギュラーシーズン ${rank}位`;
}

export function getTeamSeasonSummaries(teamId: string): TeamSeasonSummary[] {
  return Object.entries(seasonFinalRanks).flatMap(
    ([season, { teamCount, semiFinalCutoff, ranks }]) => {
      const finalRank = ranks[teamId];
      return finalRank
        ? [
            {
              season,
              finalRank,
              teamCount,
              resultLabel: getResultLabel(finalRank, semiFinalCutoff),
            },
          ]
        : [];
    },
  );
}

export const teamHistorySources: Source[] = [
  {
    label: "Mリーグ2018-19シーズン 成績",
    url: "https://m-league.jp/2018-season/",
    sourceType: "mleague_official",
    checkedAt,
  },
  {
    label: "Mリーグ2019-20シーズン 成績",
    url: "https://m-league.jp/2019-season/",
    sourceType: "mleague_official",
    checkedAt,
  },
  {
    label: "Mリーグ2020-21シーズン 成績",
    url: "https://m-league.jp/2020-season/",
    sourceType: "mleague_official",
    checkedAt,
  },
  {
    label: "Mリーグ2021-22シーズン 成績",
    url: "https://m-league.jp/2021-season/",
    sourceType: "mleague_official",
    checkedAt,
  },
  {
    label: "Mリーグ2022-23シーズン 最終結果",
    url: "https://m-league.jp/news202305221200/",
    sourceType: "mleague_official",
    checkedAt,
  },
  {
    label: "Mリーグ2023-24シーズン 最終結果",
    url: "https://m-league.jp/news202405201500/",
    sourceType: "mleague_official",
    checkedAt,
  },
  {
    label: "Mリーグ2024-25シーズン 最終結果",
    url: "https://m-league.jp/news202505191800/",
    sourceType: "mleague_official",
    checkedAt,
  },
  {
    label: "Mリーグ2025-26シーズン 最終結果",
    url: "https://m-league.jp/news202605181200/",
    sourceType: "mleague_official",
    checkedAt,
  },
  {
    label: "Mリーグ2025-26 ドラフト会議",
    url: "https://m-league.jp/news202506302200/",
    sourceType: "mleague_official",
    checkedAt,
  },
  {
    label: "Mリーグ2026-27 契約選手一覧",
    url: "https://m-league.jp/news202607021500/",
    sourceType: "mleague_official",
    checkedAt,
  },
];

export const teamEditorialProfiles: Record<string, TeamEditorialProfile> = {
  "team-abemas": {
    teamId: "team-abemas",
    foundedSeason: "2018-19",
    owner: "株式会社サイバーエージェント",
    championshipSeasons: ["2022-23"],
    characteristics: [
      "創設時から在籍する多井隆晴・白鳥翔・松本吉弘に、2019-20シーズンから日向藍子が加わった4人で長く戦ってきたチームです。メンバーの継続性が高く、同じ顔ぶれで積み上げてきた経験が大きな特徴です。",
      "2022-23シーズンに初優勝。2025-26シーズンは創設以来初めてレギュラーシーズンで敗退し、翌季は同じ4選手で再出発しています。長期継続したチームがどのように立て直すかが観戦ポイントです。",
    ],
    seasonReviews: [
      {
        season: "2022-23",
        title: "5年連続ファイナルの先で初優勝",
        description: "初年度から続けてファイナルへ進み、長く固定してきた4人の経験を初タイトルにつなげました。継続性が結果へ結び付いたシーズンとして、ABEMASの歩みを知る基準になります。",
      },
      {
        season: "2025-26",
        title: "初のレギュラー敗退",
        description: "創設以来初めてセミファイナル進出を逃し、最終7位となりました。翌季も同じ4人を継続したため、長期チームがどのように立て直すかを追う起点となるシーズンです。",
      },
    ],
    milestones: [
      { season: "2018-19", title: "創設メンバーとして参戦", description: "Mリーグ初年度から参加。" },
      { season: "2022-23", title: "初優勝", description: "5年連続のファイナル進出を経て、チーム初の優勝を達成しました。" },
      { season: "2025-26", title: "初のレギュラー敗退", description: "創設以来続いていたセミファイナル進出が途切れ、7位でシーズンを終えました。" },
    ],
    rosterChanges: [
      { season: "2018-19", title: "多井・白鳥・松本で始動", description: "創設時の3選手としてチームの土台を作りました。" },
      { season: "2019-20", title: "日向藍子が加入", description: "現在まで続く4人体制が完成しました。" },
      { season: "2026-27", title: "4選手との契約を継続", description: "多井・白鳥・松本・日向の体制で9シーズン目に臨みます。" },
    ],
  },
  "team-fightclub": {
    teamId: "team-fightclub",
    foundedSeason: "2018-19",
    owner: "株式会社コナミアーケードゲームス",
    championshipSeasons: [],
    characteristics: [
      "麻雀ゲーム『麻雀格闘倶楽部』の名を冠し、公式にも『闘い抜いてNo.1を目指す』と掲げるチームです。佐々木寿人と高宮まりは創設時から在籍し、チームの軸を担っています。",
      "2021-22シーズンに伊達朱里紗と滝沢和典が加入して現在の4人体制へ移行。2022-23と2025-26の2度、準優勝まで進んでおり、初優勝へ届くかが大きな見どころです。",
    ],
    seasonReviews: [
      {
        season: "2022-23",
        title: "現在の4人体制で初の準優勝",
        description: "伊達朱里紗・滝沢和典が加わった体制で初めてファイナル2位まで進みました。攻撃力のある4選手がそろった後のチーム像を確認しやすいシーズンです。",
      },
      {
        season: "2025-26",
        title: "再び優勝争いへ",
        description: "3季ぶりに準優勝し、同じ4人で再びタイトルへ迫りました。長期継続した編成の完成度と、初優勝までの距離を見るうえで重要な結果です。",
      },
    ],
    milestones: [
      { season: "2018-19", title: "創設メンバーとして参戦", description: "Mリーグ初年度から参加しました。" },
      { season: "2022-23", title: "初の準優勝", description: "ファイナルへ進み、チーム最高位となる2位を記録しました。" },
      { season: "2025-26", title: "2度目の準優勝", description: "ファイナルでEX風林火山を追い、最終2位となりました。" },
    ],
    rosterChanges: [
      { season: "2018-19", title: "佐々木・高宮・前原で始動", description: "創設時から攻撃的な印象を打ち出しました。" },
      { season: "2019-20", title: "藤崎智が加入", description: "4人体制へ移行しました。" },
      { season: "2021-22", title: "伊達朱里紗・滝沢和典が加入", description: "佐々木・高宮と合わせた現在の4人体制になりました。" },
    ],
  },
  "team-drivens": {
    teamId: "team-drivens",
    foundedSeason: "2018-19",
    owner: "株式会社博報堂",
    championshipSeasons: ["2018-19"],
    characteristics: [
      "公式紹介では、守備力と前進する攻撃力に加え、技術・経験・客観的なデータを生かすチーム像を掲げています。初年度王者であり、検討や分析を重視する姿勢もチームの見どころです。",
      "2023-24シーズンに浅見真紀と渡辺太を迎えて再編し、同季準優勝。2024-25シーズンはレギュラーシーズンを首位で通過し、最終3位となりました。",
    ],
    seasonReviews: [
      {
        season: "2018-19",
        title: "初代Mリーグ王者",
        description: "園田賢・村上淳・鈴木たろうの創設メンバーで初年度を制しました。データと検討を重視するチームの出発点であり、現在のドリブンズと比較する基準になるシーズンです。",
      },
      {
        season: "2023-24",
        title: "再編初年度に準優勝",
        description: "浅見真紀と渡辺太を迎えた新体制で、すぐにファイナル2位へ進みました。選手構成を大きく変えながら結果を出した転換点です。",
      },
    ],
    milestones: [
      { season: "2018-19", title: "初代Mリーグ王者", description: "Mリーグ初年度のファイナルを制しました。" },
      { season: "2023-24", title: "新体制で準優勝", description: "2選手を入れ替えた初年度にファイナル2位へ進出しました。" },
      { season: "2024-25", title: "レギュラーシーズン首位", description: "大幅なプラスで首位通過し、最終順位は3位でした。" },
    ],
    rosterChanges: [
      { season: "2018-19", title: "園田・村上・鈴木たろうで始動", description: "創設メンバーで初年度優勝を達成しました。" },
      { season: "2019-20", title: "丸山奏子が加入", description: "4人体制へ移行しました。" },
      { season: "2023-24", title: "浅見真紀・渡辺太が加入", description: "村上淳・丸山奏子に代わる2選手を迎え、チームを再編しました。" },
    ],
  },
  "team-furinkazan": {
    teamId: "team-furinkazan",
    foundedSeason: "2018-19",
    owner: "株式会社テレビ朝日",
    championshipSeasons: ["2020-21", "2025-26"],
    characteristics: [
      "孫子の『風林火山』を掲げ、状況に応じた緩急をチームの象徴としています。2020-21と2025-26の2度優勝しており、異なる選手構成で頂点に立った点が特徴です。",
      "2025-26シーズンは永井孝典と内川幸太郎を迎えた新体制で優勝。二階堂亜樹・勝又健志の継続組と新加入組がどう役割を分けるかを見ると、チームの変化を追いやすくなります。",
    ],
    seasonReviews: [
      {
        season: "2020-21",
        title: "ファイナル逆転で初優勝",
        description: "二階堂亜樹・滝沢和典・勝又健志の体制で初タイトルを獲得しました。終盤まで順位が動くMリーグの面白さと、風林火山の勝負強さが表れたシーズンです。",
      },
      {
        season: "2025-26",
        title: "新体制で2度目の優勝",
        description: "永井孝典と内川幸太郎が加わった初年度に優勝しました。継続組と新加入組を組み合わせ、異なる編成で再び頂点へ到達した点が大きな特徴です。",
      },
    ],
    milestones: [
      { season: "2018-19", title: "創設メンバーとして参戦", description: "Mリーグ初年度から参加しました。" },
      { season: "2020-21", title: "初優勝", description: "ファイナルで逆転し、チーム初タイトルを獲得しました。" },
      { season: "2025-26", title: "2度目の優勝", description: "新加入2選手を含む体制で5季ぶりの優勝を果たしました。" },
    ],
    rosterChanges: [
      { season: "2018-19", title: "二階堂亜樹・滝沢・勝又で始動", description: "創設時の3選手でリーグへ参戦しました。" },
      { season: "2021-22", title: "松ヶ瀬隆弥・二階堂瑠美が加入", description: "滝沢和典の退団後、オーディションとドラフトを経て4人体制になりました。" },
      { season: "2025-26", title: "永井孝典・内川幸太郎が加入", description: "松ヶ瀬・二階堂瑠美に代わる2選手を迎え、そのシーズンに優勝しました。" },
    ],
  },
  "team-phoenix": {
    teamId: "team-phoenix",
    foundedSeason: "2018-19",
    owner: "セガサミーグループ",
    championshipSeasons: ["2024-25"],
    characteristics: [
      "不死鳥をモチーフに、最後まで諦めず戦う姿勢を掲げるチームです。2019-20と2021-22に準優勝を経験し、2024-25シーズンに初優勝を達成しました。",
      "2024-25シーズンは竹内元太と浅井堂岐が加入し、醍醐大・茅森早香とともに優勝。加入直後の選手が結果を残した再編成功の例として、前後のシーズンを比較できます。",
    ],
    seasonReviews: [
      {
        season: "2019-20",
        title: "初のファイナルで準優勝",
        description: "和久津晶が加わった4人体制で最終2位まで進みました。優勝には届かなかったものの、フェニックスが上位争いへ加わる出発点となったシーズンです。",
      },
      {
        season: "2024-25",
        title: "再編初年度に初優勝",
        description: "竹内元太と浅井堂岐を迎え、醍醐大・茅森早香との4人で初タイトルを獲得しました。新加入選手がすぐに機能した再編成功のシーズンです。",
      },
    ],
    milestones: [
      { season: "2018-19", title: "創設メンバーとして参戦", description: "Mリーグ初年度から参加しました。" },
      { season: "2019-20 / 2021-22", title: "2度の準優勝", description: "優勝へあと一歩のシーズンを重ねました。" },
      { season: "2024-25", title: "初優勝", description: "新体制初年度にファイナルを制しました。" },
    ],
    rosterChanges: [
      { season: "2018-19", title: "魚谷・茅森・近藤で始動", description: "創設時の3選手で参戦しました。" },
      { season: "2019-20〜2023-24", title: "和久津・東城・醍醐が順次加入", description: "シーズンごとの契約変更を経てチームを更新しました。" },
      { season: "2024-25", title: "竹内元太・浅井堂岐が加入", description: "魚谷侑未・東城りおに代わる2選手を迎えました。" },
      { season: "2026-27", title: "佐野ひなこが加入", description: "浅井堂岐に代わって新たな4人体制になりました。" },
    ],
  },
  "team-sakuraknights": {
    teamId: "team-sakuraknights",
    foundedSeason: "2019-20",
    owner: "株式会社KADOKAWA",
    championshipSeasons: ["2021-22"],
    characteristics: [
      "2019-20シーズンから参戦したチームです。ところざわサクラタウンにちなむ『桜』と、心技を備えた『騎士』をチーム像に掲げています。",
      "参入3季目の2021-22シーズンに初優勝。近年は選手の入れ替えが続いており、岡田紗佳・堀慎吾の継続組と新加入選手が新しいチーム像を作る過程が注目点です。",
    ],
    seasonReviews: [
      {
        season: "2021-22",
        title: "参入3季目で初優勝",
        description: "内川幸太郎・岡田紗佳・沢崎誠・堀慎吾の4人でチーム初タイトルを獲得しました。参入から優勝までの流れを追う中心となるシーズンです。",
      },
      {
        season: "2025-26",
        title: "再編へ向かう転機",
        description: "2季連続のレギュラー敗退となり、翌季の選手構成変更へつながりました。岡田紗佳・堀慎吾を軸に新しいチームを作る前段階として注目できます。",
      },
    ],
    milestones: [
      { season: "2019-20", title: "Mリーグへ新規参入", description: "8チーム目としてリーグに加わりました。" },
      { season: "2021-22", title: "初優勝", description: "参入3季目でチーム初タイトルを獲得しました。" },
      { season: "2025-26", title: "2季連続レギュラー敗退", description: "翌季に向けて選手構成を変更する転機となりました。" },
    ],
    rosterChanges: [
      { season: "2019-20", title: "沢崎・内川・岡田で始動", description: "新規参入時の3選手です。" },
      { season: "2020-21 / 2022-23", title: "堀慎吾・渋川難波が加入", description: "堀、続いて渋川を迎えて4人体制を更新しました。" },
      { season: "2025-26", title: "阿久津翔太が加入", description: "内川幸太郎の退団後、新戦力として加わりました。" },
      { season: "2026-27", title: "尻無濱航が加入", description: "渋川難波に代わり、チームの新しい推進役として加わりました。" },
    ],
  },
  "team-pirates": {
    teamId: "team-pirates",
    foundedSeason: "2018-19",
    owner: "株式会社U-NEXT",
    championshipSeasons: ["2019-20", "2023-24"],
    characteristics: [
      "麻雀のプロスポーツ化という大海原へ進むイメージを掲げるチームです。試合後の検討を積み重ねるチーム文化と、選手の異なる持ち味を組み合わせた構成が観戦の手掛かりになります。",
      "2019-20シーズンに初優勝し、2023-24シーズンに史上初の2度目の優勝を達成。2022-23の大幅な選手入れ替え後、2季目で結果を出しました。",
    ],
    seasonReviews: [
      {
        season: "2019-20",
        title: "ファイナル逆転で初優勝",
        description: "瑞原明奈が加わった4人体制の初年度にタイトルを獲得しました。レギュラーからファイナルまで順位が変化する大会形式を象徴する優勝です。",
      },
      {
        season: "2023-24",
        title: "リーグ初の2度目の優勝",
        description: "鈴木優と仲林圭の加入2季目に再び頂点へ到達しました。大きな選手入れ替えを経て新しい強みを作った過程が見えるシーズンです。",
      },
    ],
    milestones: [
      { season: "2018-19", title: "創設メンバーとして参戦", description: "Mリーグ初年度から参加しました。" },
      { season: "2019-20", title: "初優勝", description: "ファイナルで逆転し、初タイトルを獲得しました。" },
      { season: "2023-24", title: "2度目の優勝", description: "Mリーグ史上初の複数回優勝チームになりました。" },
    ],
    rosterChanges: [
      { season: "2018-19", title: "小林・朝倉・石橋で始動", description: "創設時の3選手でリーグに参戦しました。" },
      { season: "2019-20", title: "瑞原明奈が加入", description: "4人体制となったシーズンに初優勝しました。" },
      { season: "2022-23", title: "鈴木優・仲林圭が加入", description: "朝倉康心・石橋伸洋に代わる2選手を迎えました。" },
      { season: "2026-27", title: "朝倉康心が復帰", description: "小林剛に代わり、創設メンバーの朝倉が4季ぶりに復帰しました。" },
    ],
  },
  "team-raiden": {
    teamId: "team-raiden",
    foundedSeason: "2018-19",
    owner: "株式会社電通",
    championshipSeasons: [],
    characteristics: [
      "伝説の力士・雷電にちなみ、強さと礼儀、電光石火の攻撃を掲げるチームです。『雷電の麻雀は面白いんです』という言葉でも知られ、結果と同時に観客を魅了する対局を目指しています。",
      "萩原聖人・瀬戸熊直樹・黒沢咲の創設メンバー3人に、2021-22シーズンから本田朋広が加わった継続性の高い構成です。2022-23以降は3度ファイナルへ進んでいます。",
    ],
    seasonReviews: [
      {
        season: "2022-23",
        title: "初のファイナル進出",
        description: "本田朋広加入後の4人体制で初めてファイナルへ進み、最終3位となりました。創設メンバーを中心に積み上げてきたチームが上位へ届いた転換点です。",
      },
      {
        season: "2025-26",
        title: "2季連続のファイナル",
        description: "2024-25の4位に続いてファイナルへ進み、最終3位に入りました。同じ4人で戦い続ける継続性が結果へ表れたシーズンです。",
      },
    ],
    milestones: [
      { season: "2018-19", title: "創設メンバーとして参戦", description: "Mリーグ初年度から参加しました。" },
      { season: "2022-23", title: "初のファイナル3位", description: "大きく巻き返し、チーム初の最終3位に入りました。" },
      { season: "2024-25 / 2025-26", title: "2季連続ファイナル進出", description: "4位、3位と上位争いを続けました。" },
    ],
    rosterChanges: [
      { season: "2018-19", title: "萩原・瀬戸熊・黒沢で始動", description: "創設時の3選手が現在も在籍しています。" },
      { season: "2021-22", title: "本田朋広が加入", description: "現在まで続く4人体制が完成しました。" },
      { season: "2026-27", title: "4選手との契約を継続", description: "同じ4人で6シーズン目を迎えました。" },
    ],
  },
  "team-beast": {
    teamId: "team-beast",
    foundedSeason: "2023-24",
    owner: "BS10",
    championshipSeasons: [],
    characteristics: [
      "2023-24シーズンから参加したチームです。勇敢に戦う『ビースト』と、仲間で助け合い成長するチーム像を掲げ、攻めの姿勢を前面に出しています。",
      "最初の2季はレギュラーシーズンで敗退しましたが、2025-26シーズンに下石戟と東城りおを迎え、初のファイナル進出と最終4位を記録しました。再編前後を比べやすいチームです。",
    ],
    seasonReviews: [
      {
        season: "2023-24",
        title: "9チーム目として参入",
        description: "オーディションとドラフトで選ばれた4人で初年度を戦い、最終7位となりました。新規チームがMリーグへ適応していく過程の出発点です。",
      },
      {
        season: "2025-26",
        title: "再編後に初ファイナル",
        description: "下石戟と東城りおを迎えた新体制で、チーム初のファイナル進出と最終4位を記録しました。選手入れ替え前後の変化が結果に表れたシーズンです。",
      },
    ],
    milestones: [
      { season: "2023-24", title: "Mリーグへ新規参入", description: "9チーム目としてリーグに加わりました。" },
      { season: "2024-25", title: "2季連続レギュラー敗退", description: "選手入れ替え規定により翌季の再編へ進みました。" },
      { season: "2025-26", title: "初のファイナル進出", description: "新体制で最終4位まで進みました。" },
    ],
    rosterChanges: [
      { season: "2023-24", title: "猿川・菅原・鈴木大介・中田で始動", description: "オーディションとドラフトを経て初代メンバーが決まりました。" },
      { season: "2025-26", title: "下石戟・東城りおが加入", description: "猿川真寿・菅原千瑛に代わる2選手を迎えました。" },
      { season: "2026-27", title: "4選手との契約を継続", description: "初のファイナルへ進んだ体制を維持しました。" },
    ],
  },
  "team-jets": {
    teamId: "team-jets",
    foundedSeason: "2025-26",
    owner: "アース製薬株式会社",
    championshipSeasons: [],
    characteristics: [
      "2025-26シーズンから参加した10チーム目のチームです。カメレオンのように変幻自在な攻守と、素早く鋭く相手に打ち勝つ麻雀を公式コンセプトに掲げています。",
      "初年度は石井一馬・三浦智博・逢川恵夢・HIRO柴田の4選手で戦い、最終10位。新規チームが経験を蓄積し、2季目にどのような変化を見せるかが注目点です。",
    ],
    seasonReviews: [
      {
        season: "2025-26",
        title: "4人全員が初参戦の船出",
        description: "10チーム目として加わり、石井一馬・三浦智博・逢川恵夢・HIRO柴田の4人で初年度を戦いました。最終10位から得た経験を次季へどう生かすかを見る起点です。",
      },
      {
        season: "2026-27",
        title: "創設メンバーで2季目へ",
        description: "初年度と同じ4選手との契約を継続しました。初参戦で得た経験を共有しながら、チームとしての戦い方を深められるかが見どころです。",
      },
    ],
    milestones: [
      { season: "2025-26", title: "Mリーグへ新規参入", description: "アース製薬による10チーム目として加わりました。" },
      { season: "2025-26", title: "初年度は最終10位", description: "4人全員がMリーグ初参戦の構成で最初のシーズンを戦いました。" },
      { season: "2026-27", title: "2シーズン目へ", description: "創設メンバー4人との契約を継続しました。" },
    ],
    rosterChanges: [
      { season: "2025-26", title: "4人の創設メンバーで始動", description: "石井一馬・三浦智博・逢川恵夢・HIRO柴田がドラフトで選ばれました。" },
      { season: "2026-27", title: "創設メンバーを継続", description: "初年度と同じ4選手で2季目に臨みます。" },
    ],
  },
};

export function getTeamEditorialProfile(teamId: string) {
  return teamEditorialProfiles[teamId];
}

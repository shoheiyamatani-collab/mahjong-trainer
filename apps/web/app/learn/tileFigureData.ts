import type { TileFigure } from "../components/TileFigures";

export const learnTileFiguresBySlug: Record<string, TileFigure[]> = {
  "what-is-mahjong": [
    {
      title: "麻雀は手牌を完成形に近づけるゲーム",
      description: "最初は13枚の手牌から始まり、自分の番で1枚引いて1枚捨てます。少しずつ3枚組と2枚組を作っていきます。",
      badges: ["全体像"],
      rows: [
        {
          label: "最初の手牌",
          tiles: ["man2", "man3", "pin4", "pin5", "sou6", "sou7", "ji7", "ji7", "man6", "man7", "pin9", "ji3", "sou2"],
          note: "まだ完成していない部分が多い状態です。つながっている牌と孤立している牌を分けて見ます。"
        },
        {
          label: "完成形の例",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "ji7", "ji7", "ji7", "man5", "man5"],
          tone: "answer",
          note: "3枚組が4つ、同じ牌2枚が1つあります。これが基本のアガリ形です。"
        }
      ]
    },
    {
      title: "アガリには形と役が必要",
      description: "形だけでなく、リーチ・タンヤオ・役牌などの役が1つ以上必要です。",
      badges: ["形", "役"],
      link: { label: "役一覧はこちら", href: "/rules/yaku" },
      rows: [
        {
          label: "形",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "man6", "man7", "man8", "pin5", "pin5"],
          note: "4面子1雀頭の形です。ただし役があるかは別に確認します。"
        },
        {
          label: "役牌あり",
          tiles: ["ji7", "ji7", "ji7"],
          tone: "answer",
          note: "中を3枚そろえると役牌になります。初心者が分かりやすい役のひとつです。"
        }
      ]
    }
  ],
  tiles: [
    {
      title: "数牌は3種類、各1から9まで",
      description: "萬子・筒子・索子は同じ数字でも別の牌です。まずは見た目でグループ分けします。",
      badges: ["牌の種類"],
      rows: [
        { label: "萬子", tiles: ["man1", "man2", "man3", "man4", "man5", "man6", "man7", "man8", "man9"], note: "漢数字の入った数牌です。" },
        { label: "筒子", tiles: ["pin1", "pin2", "pin3", "pin4", "pin5", "pin6", "pin7", "pin8", "pin9"], note: "丸い模様の数牌です。" },
        { label: "索子", tiles: ["sou1", "sou2", "sou3", "sou4", "sou5", "sou6", "sou7", "sou8", "sou9"], note: "竹のような模様の数牌です。" }
      ]
    },
    {
      title: "字牌は風牌と三元牌に分かれる",
      description: "字牌は数字の連続を作れませんが、同じ牌3枚で役になることがあります。",
      badges: ["字牌"],
      rows: [
        { label: "風牌", tiles: ["ji1", "ji2", "ji3", "ji4"], note: "東・南・西・北です。場風や自風なら役牌になります。" },
        { label: "三元牌", tiles: ["ji6", "ji5", "ji7"], tone: "answer", note: "白・發・中です。3枚そろえるといつでも役牌です。" },
        { label: "端の牌", tiles: ["man1", "man9", "pin1", "pin9", "sou1", "sou9"], note: "1と9は端牌です。タンヤオでは使えません。" }
      ]
    }
  ],
  "draw-and-discard": [
    {
      title: "1枚引いて、1枚捨てる",
      description: "麻雀の基本動作です。引いた直後は一時的に14枚になり、捨てると13枚に戻ります。",
      badges: ["基本動作"],
      rows: [
        { label: "手牌13枚", tiles: ["man2", "man3", "man4", "pin3", "pin4", "sou6", "sou7", "ji7", "ji7", "man6", "man7", "pin9", "ji3"] },
        { label: "ツモ牌", tiles: ["pin5"], tone: "answer", note: "引いた牌です。使えそうなら残します。" },
        { label: "捨て候補", tiles: ["ji3"], tone: "warning", note: "周りとつながりにくい孤立牌は、序盤の捨て候補になりやすいです。" }
      ]
    },
    {
      title: "つながりのある牌を残す",
      description: "どれを捨てるか迷ったら、次に手が進みやすい形を残します。",
      badges: ["捨て牌選び"],
      rows: [
        { label: "残したい形", tiles: ["pin3", "pin4"], resultLabel: "うれしい牌", resultTiles: ["pin2", "pin5"], note: "2か5を引くと順子に近づきます。" },
        { label: "残したい形", tiles: ["sou6", "sou7"], resultLabel: "うれしい牌", resultTiles: ["sou5", "sou8"], note: "両側に伸びる形は使いやすいです。" },
        { label: "孤立牌", tiles: ["ji3"], tone: "warning", note: "同じ西が重なっていないなら、使い道はまだ少なめです。" }
      ]
    }
  ],
  "meld-and-pair": [
    {
      title: "面子は3枚組",
      description: "順子と刻子を見分けられると、アガリ形がかなり見やすくなります。",
      badges: ["面子"],
      rows: [
        { label: "順子", tiles: ["man2", "man3", "man4"], tone: "answer", note: "同じ種類で数字が連続した3枚です。" },
        { label: "刻子", tiles: ["ji7", "ji7", "ji7"], tone: "answer", note: "同じ牌3枚です。字牌でも作れます。" },
        { label: "未完成", tiles: ["pin3", "pin4"], note: "あと2筒か5筒で順子になります。" }
      ]
    },
    {
      title: "雀頭は同じ牌2枚",
      description: "基本のアガリ形には、面子4つのほかに雀頭が1つ必要です。",
      badges: ["雀頭"],
      rows: [
        { label: "雀頭", tiles: ["pin5", "pin5"], tone: "answer", note: "同じ牌2枚の組です。頭とも呼びます。" },
        { label: "順子ではない", tiles: ["man2", "pin3", "sou4"], tone: "warning", note: "数字が連続していても、種類が違うと順子になりません。" },
        { label: "字牌は順子不可", tiles: ["ji1", "ji2", "ji3"], tone: "warning", note: "東南西は並んで見えても順子ではありません。" }
      ]
    }
  ],
  "winning-shape": [
    {
      title: "4面子1雀頭に分ける",
      description: "完成形は、3枚組を4つ、同じ牌2枚を1つに分解して見ます。",
      badges: ["アガリ形"],
      rows: [
        { label: "面子1", tiles: ["man2", "man3", "man4"], tone: "answer" },
        { label: "面子2", tiles: ["pin3", "pin4", "pin5"], tone: "answer" },
        { label: "面子3", tiles: ["sou4", "sou5", "sou6"], tone: "answer" },
        { label: "面子4", tiles: ["ji7", "ji7", "ji7"], tone: "answer" },
        { label: "雀頭", tiles: ["man5", "man5"], tone: "answer", note: "3枚組4つと2枚組1つで、合計14枚です。" }
      ]
    },
    {
      title: "未完成の手は、足りない部品を探す",
      description: "完成している面子を先に外すと、どこを育てるべきか見えます。",
      badges: ["見方"],
      rows: [
        {
          label: "手牌",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "ji7", "ji7", "ji7", "man5", "man5"],
          note: "3面子と雀頭は見えています。残りの索子があと1枚で面子になります。"
        },
        { label: "足りない形", tiles: ["sou4", "sou5"], resultLabel: "待ち", resultTiles: ["sou3", "sou6"], tone: "answer", note: "3索か6索で4つ目の面子が完成します。" }
      ]
    }
  ],
  "yaku-required": [
    {
      title: "形があっても役なしならアガれない",
      description: "4面子1雀頭に見えても、役がなければロンやツモはできません。",
      badges: ["役が必要"],
      rows: [
        {
          label: "形は完成",
          tiles: ["man1", "man2", "man3", "pin1", "pin2", "pin3", "sou7", "sou8", "sou9", "man7", "man8", "man9", "ji3", "ji3"],
          note: "4面子1雀頭ですが、鳴いていてリーチできず、タンヤオや役牌もない形の例です。"
        },
        { label: "ドラだけ", tiles: ["pin5"], tone: "warning", note: "ドラは点数を増やす牌で、役そのものではありません。" }
      ]
    },
    {
      title: "役がある形を作る",
      description: "最初はリーチ・タンヤオ・役牌のどれかを目指すと分かりやすいです。",
      badges: ["役の例"],
      rows: [
        { label: "役牌", tiles: ["ji7", "ji7", "ji7", "ji5", "ji5", "ji5"], tone: "answer", note: "中や發を3枚そろえると役になります。" },
        {
          label: "タンヤオ",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "man6", "man7", "pin5", "pin5"],
          resultLabel: "待ち",
          resultTiles: ["man5", "man8"],
          tone: "answer",
          note: "1・9・字牌を使わない13枚のテンパイ形です。"
        },
        {
          label: "リーチ",
          tiles: ["man1", "man2", "man3", "pin1", "pin2", "pin3", "sou7", "sou8", "sou9", "man7", "man8", "ji7", "ji7"],
          resultLabel: "待ち",
          resultTiles: ["man6", "man9"],
          note: "役がない門前テンパイでも、鳴いていなければリーチを宣言できます。"
        }
      ]
    }
  ],
  "tsumo-and-ron": [
    {
      title: "ツモは自分で引いてアガる",
      description: "待ち牌を自分の番で山から引いたときは、手元でアガリが完成します。このときは相手の捨て牌ではなく、自分で引いた牌なので「ツモ！」と発声します。",
      badges: ["自分で引く", "ツモ！"],
      variant: "tsumo",
      speech: "自分で五萬を引いたら「ツモ！」",
      rows: [
        {
          label: "待っている手",
          tiles: ["man2", "man3", "man4", "man5", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7"],
          resultLabel: "待ち",
          resultTiles: ["man2", "man5"]
        },
        { label: "自分で引く", tiles: ["man5"], tone: "tsumo", note: "自分のツモ番で五萬を引いたので、牌を見せながら「ツモ！」と発声します。" }
      ]
    },
    {
      title: "ロンは相手の捨て牌でアガる",
      description: "待ち牌を相手が捨てたときは、その捨て牌を使ってアガります。自分で引いた牌ではないので、相手の捨て牌を指して「ロン！」と発声します。",
      badges: ["相手の捨て牌", "ロン！"],
      variant: "ron",
      speech: "相手が五萬を捨てたら「ロン！」",
      rows: [
        {
          label: "待っている手",
          tiles: ["man2", "man3", "man4", "man5", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7"],
          resultLabel: "待ち",
          resultTiles: ["man2", "man5"]
        },
        { label: "相手の捨て牌", tiles: ["man5"], tone: "ron", note: "相手が五萬を捨てて、それでアガれるなら「ロン！」と発声します。役があるかも確認します。" }
      ]
    }
  ],
  calling: [
    {
      title: "ポンは同じ牌3枚を作る鳴き",
      description: "相手の捨て牌をもらって刻子を作ります。中が2枚あるイーシャンテンなら、中をポンして一気にテンパイへ進めることがあります。",
      badges: ["鳴き", "ポン"],
      rows: [
        {
          label: "ポン前",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "sou6", "sou7", "sou8", "man7", "man7", "ji7", "ji7", "pin9"],
          tone: "normal",
          note: "中中を持っている13枚のイーシャンテンです。対面が中を捨てたらポンできます。"
        },
        {
          label: "ポン後",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "sou6", "sou7", "sou8", "man7", "man7"],
          meld: { label: "対面から中ポン", tiles: ["ji7", "ji7", "ji7"], calledIndex: 1 },
          resultLabel: "待ち",
          resultTiles: ["pin2", "pin5"],
          tone: "answer",
          note: "対面の中をポンして右端に出し、孤立していた9筒を切ると10枚のテンパイ形になります。待ちは2筒・5筒です。"
        }
      ]
    },
    {
      title: "チーは同じ種類の連続を作る鳴き",
      description: "チーは左隣の人の捨て牌から順子を作る鳴きです。鳴いた後にタンヤオなどの役が残るか確認します。",
      badges: ["チー"],
      rows: [
        {
          label: "チー前",
          tiles: ["man3", "man4", "man6", "man7", "pin3", "pin4", "pin5", "pin5", "pin5", "pin8", "sou6", "sou7", "sou8"],
          note: "3萬4萬を持っていて、上家が5萬を捨てた場面です。2〜8だけなので、チーしてもタンヤオが残ります。"
        },
        {
          label: "チー後",
          tiles: ["man6", "man7", "pin3", "pin4", "pin5", "pin5", "pin5", "sou6", "sou7", "sou8"],
          meld: { label: "上家から5萬チー", tiles: ["man3", "man4", "man5"], calledIndex: 2 },
          resultLabel: "待ち",
          resultTiles: ["man5", "man8"],
          tone: "answer",
          note: "上家の5萬をチーして右端に出し、孤立していた8筒を切ると10枚のテンパイ形になります。待ちは5萬・8萬で、タンヤオの役も残っています。"
        },
        {
          label: "注意",
          tiles: ["man7", "man8", "man9"],
          tone: "warning",
          note: "1・9が入る形で鳴くと、タンヤオではなくなることがあります。鳴く前に役が残るか確認します。"
        }
      ]
    }
  ],
  "tenpai-and-wait": [
    {
      title: "テンパイはあと1枚でアガリ",
      description: "足りない最後の1枚が来ればアガリ形になります。その牌が待ちです。",
      badges: ["テンパイ"],
      rows: [
        {
          label: "テンパイ形",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7", "man5"],
          resultLabel: "待ち",
          resultTiles: ["man5"],
          note: "5萬が来ると雀頭が完成します。"
        }
      ]
    },
    {
      title: "待ちの基本形を見分ける",
      description: "待ちの名前より先に、どの牌が来たら3枚組になるかを見つけます。",
      badges: ["待ち"],
      rows: [
        { label: "両面待ち", tiles: ["man4", "man5"], resultLabel: "待ち", resultTiles: ["man3", "man6"], tone: "answer", note: "両側で順子になります。" },
        { label: "カンチャン", tiles: ["pin3", "pin5"], resultLabel: "待ち", resultTiles: ["pin4"], note: "真ん中を待つ形です。" },
        { label: "ペンチャン", tiles: ["sou1", "sou2"], resultLabel: "待ち", resultTiles: ["sou3"], note: "端の形で3を待ちます。" }
      ]
    }
  ],
  "basic-nanikiru": [
    {
      title: "孤立牌から切る候補を探す",
      description: "何切るでは、周りとつながりにくい牌を見つけるところから始めます。",
      badges: ["何切る"],
      rows: [
        {
          label: "手牌例",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "sou6", "sou7", "ji7", "ji7", "man5", "man6", "pin9", "ji3", "sou2"],
          note: "つながっている部分と、孤立している部分を分けて見ます。"
        },
        { label: "切る候補", tiles: ["ji3"], tone: "warning", note: "西が1枚だけで、役牌にもなりにくいなら候補になります。" },
        { label: "残したい", tiles: ["ji7", "ji7"], tone: "answer", note: "中はもう1枚来ると役牌になります。" }
      ]
    },
    {
      title: "受け入れが広い形を残す",
      description: "次に引くとうれしい牌が多い形ほど、手が進みやすくなります。",
      badges: ["受け入れ"],
      rows: [
        { label: "強い形", tiles: ["man4", "man5"], resultLabel: "うれしい牌", resultTiles: ["man3", "man6"], tone: "answer", note: "両側で順子になります。" },
        { label: "端の形", tiles: ["sou1", "sou2"], resultLabel: "うれしい牌", resultTiles: ["sou3"], note: "3索だけで順子になります。" },
        { label: "対子", tiles: ["pin5", "pin5"], resultLabel: "うれしい牌", resultTiles: ["pin5"], note: "もう1枚で刻子、または雀頭として使えます。" }
      ]
    }
  ],
  "score-later": [
    {
      title: "点数より先に形と役を見る",
      description: "初心者は、点数計算より先にアガれる形か、役があるかを判断できるようにします。",
      badges: ["学習順"],
      rows: [
        {
          label: "形",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "ji7", "ji7", "ji7", "man5", "man5"],
          tone: "answer",
          note: "4面子1雀頭があります。"
        },
        { label: "役", tiles: ["ji7", "ji7", "ji7"], tone: "answer", note: "中の役牌があります。点数はこの後に確認します。" }
      ]
    },
    {
      title: "点数表はよく出るところから見る",
      description: "最初は全部を暗記しません。30符・40符、2翻・3翻、満貫を見慣れるところから始めます。",
      badges: ["点数表"],
      rows: [
        { label: "平和例", tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "man6", "man7", "man8", "pin5", "pin5"], note: "平和は符が分かりやすいので、早見表で確認しやすい役です。" },
        { label: "七対子例", tiles: ["man2", "man2", "pin3", "pin3", "sou4", "sou4", "man5", "man5", "pin6", "pin6", "sou7", "sou7", "ji7", "ji7"], note: "七対子は25符固定として表で確認できます。" }
      ]
    }
  ]
};

import type { LearningGuide } from "./guideData";

export const requestedLearningGuides: LearningGuide[] = [
  {
    slug: "five-block-theory",
    title: "5ブロック理論を牌姿10例で覚える",
    seoTitle: "麻雀の5ブロック理論とは？牌姿10例で数え方を覚える",
    description: "麻雀の5ブロック理論を、完成面子、ターツ、対子、6ブロック形など10個の牌姿で初心者向けに解説します。",
    lead: "アガリ形は、4つの面子と1つの雀頭でできています。手牌を5つのかたまりとして数えると、残す形と整理する形を判断しやすくなります。",
    takeaways: ["面子・ターツ・対子を1ブロックとして数える", "6ブロックあるときは弱い形から整理する", "複合形は牌を重ねて数えない"],
    sections: [
      {
        heading: "5ブロックはアガリ形の設計図",
        paragraphs: [
          "基本のアガリ形は4面子1雀頭です。完成した順子や刻子だけでなく、両面、カンチャン、ペンチャンなどの未完成部分も1ブロックとして数えます。",
          "5つの候補がそろっていれば、孤立牌を整理しながら各ブロックを完成させます。まだ4ブロックなら、新しいブロックを作れるくっつき牌を残します。"
        ]
      },
      {
        heading: "6ブロック形は比較して一つ減らす",
        paragraphs: [
          "6ブロックある手牌では、どこか一つを外さないと4面子1雀頭に収まりません。両面よりペンチャン、役に絡む形より価値の低い形というように、完成しやすさと打点を比べます。",
          "対子が複数あるときは、雀頭候補と刻子候補の両方になります。対子をすべて同じ価値として数えず、役牌や場に見えている枚数も確認します。"
        ]
      },
      {
        heading: "数え方に迷ったら左右から分け直す",
        paragraphs: [
          "34556萬のような連続形は、345萬と56萬にも、34萬と556萬にも見えます。最初の分け方だけで決めず、左右から順子を抜いて比べることが大切です。",
          "実戦では、ブロック数を確認してから受け入れを数えます。5ブロック理論は答えそのものではなく、候補を見つけるための整理方法です。"
        ],
        bullets: ["完成面子を先に探す", "未完成の2枚組を数える", "雀頭候補を確認する", "5つを超えたら弱いブロックを比較する"]
      }
    ],
    figures: [
      {
        title: "基本ブロックの5例",
        description: "完成形と未完成形を、それぞれ1ブロックとして見ます。",
        badges: ["例1から5"],
        rows: [
          { label: "例1 完成順子", tiles: ["man2", "man3", "man4"], note: "3枚で完成している1ブロックです。" },
          { label: "例2 完成刻子", tiles: ["ji5", "ji5", "ji5"], note: "同じ牌3枚も完成した1ブロックです。" },
          { label: "例3 両面", tiles: ["pin4", "pin5"], resultLabel: "有効牌", resultTiles: ["pin3", "pin6"], tone: "answer", note: "2種類で完成する強い未完成ブロックです。" },
          { label: "例4 カンチャン", tiles: ["sou3", "sou5"], resultLabel: "有効牌", resultTiles: ["sou4"], note: "間の1種類で完成します。" },
          { label: "例5 対子", tiles: ["man7", "man7"], note: "雀頭にも刻子候補にもなる1ブロックです。" }
        ]
      },
      {
        title: "手牌を整理する5例",
        description: "ブロック数が足りない形、余る形、重なって見える形を比べます。",
        badges: ["例6から10"],
        rows: [
          { label: "例6 ペンチャン", tiles: ["sou1", "sou2"], resultLabel: "有効牌", resultTiles: ["sou3"], note: "1種類だけを受けるため、6ブロック形では整理候補になりやすい形です。" },
          { label: "例7 くっつき候補", tiles: ["pin5"], resultLabel: "変化", resultTiles: ["pin3", "pin4", "pin6", "pin7"], tone: "answer", note: "4ブロックしかない手では、中央の孤立牌も新しいブロック候補です。" },
          { label: "例8 6ブロック比較", tiles: ["man4", "man5", "pin3", "pin5", "sou1", "sou2"], note: "両面・カンチャン・ペンチャンが競合するなら、完成しやすさを比べます。" },
          { label: "例9 対子が2つ", tiles: ["pin7", "pin7", "ji1", "ji1"], note: "どちらを雀頭にするか、刻子になったときに役があるかを比べます。" },
          { label: "例10 複合形", tiles: ["man3", "man4", "man5", "man5", "man6"], resultLabel: "受け", resultTiles: ["man2", "man5", "man7"], tone: "answer", note: "重ねて数えず、分け方を変えて有効牌を探します。" }
        ]
      }
    ],
    toolLink: { href: "/analysis/mahjong-tool", label: "牌理チェッカーで5ブロックを比べる", description: "14枚を入力すると、ブロックの残し方による受け入れの差を確認できます。" },
    relatedSlugs: ["what-is-tile-efficiency", "tile-efficiency-and-ukeire", "beginner-nanikiru-mistakes"]
  },
  {
    slug: "wait-shape-basics",
    title: "両面・カンチャン・ペンチャンの違い",
    seoTitle: "両面・カンチャン・ペンチャンの違い｜待ちと受け入れを牌図で比較",
    description: "両面、カンチャン、ペンチャンの見分け方と有効牌の違いを、牌図と残り枚数で分かりやすく比較します。",
    lead: "2枚の数字牌から順子を作る形でも、待てる牌の数は同じではありません。形を見た瞬間に両面・カンチャン・ペンチャンを区別できると、何切るの判断が速くなります。",
    takeaways: ["両面は両側の2種類を受ける", "カンチャンは数字の間を待つ", "ペンチャンは12の3、89の7を待つ"],
    sections: [
      {
        heading: "両面は基本となる強い形",
        paragraphs: ["4萬5萬なら3萬と6萬を受けます。2種類が場に見えていなければ最大8枚あり、順子を作る未完成形の中で最も基本的な良形です。", "ただし、同じ牌を自分で使っていたり河に見えていたりすれば残り枚数は減ります。種類だけでなく枚数も確認します。"]
      },
      {
        heading: "カンチャンとペンチャンは1種類",
        paragraphs: ["3筒5筒は間の4筒を待つカンチャンです。1索2索は3索を待つペンチャンです。どちらも通常は1種類・最大4枚ですが、手変わりの幅は中央に近いカンチャンの方が広い場合があります。", "7索8索は6索と9索を受ける両面です。端に近く見えても、8索9索の7索待ちだけがペンチャンであることに注意してください。"]
      },
      {
        heading: "比較するときは次の変化まで見る",
        paragraphs: ["今すぐの受け入れだけなら両面が有利です。一方で、カンチャンに隣の牌を引くと両面へ変化することがあります。", "手牌全体で5ブロックが足りているか、役やドラに関係するかも加えると、形だけに頼らない判断ができます。"]
      }
    ],
    figures: [
      {
        title: "3つのターツを見比べる",
        description: "形と有効牌をセットで覚えます。",
        badges: ["基本形"],
        rows: [
          { label: "両面", tiles: ["man4", "man5"], resultLabel: "有効牌", resultTiles: ["man3", "man6"], tone: "answer", note: "2種類・最大8枚です。" },
          { label: "カンチャン", tiles: ["pin3", "pin5"], resultLabel: "有効牌", resultTiles: ["pin4"], note: "間の1種類・最大4枚です。" },
          { label: "ペンチャン", tiles: ["sou1", "sou2"], resultLabel: "有効牌", resultTiles: ["sou3"], note: "端を完成させる1種類・最大4枚です。" },
          { label: "端寄りの両面", tiles: ["sou7", "sou8"], resultLabel: "有効牌", resultTiles: ["sou6", "sou9"], tone: "answer", note: "7・8は両面です。" },
          { label: "反対側のペンチャン", tiles: ["pin8", "pin9"], resultLabel: "有効牌", resultTiles: ["pin7"], note: "8・9で7を待つ形です。" }
        ]
      }
    ],
    toolLink: { href: "/rules/practical-waits", label: "複合待ちまで続けて学ぶ", description: "基本の3形を覚えたら、三面待ちやノベタンも牌図で確認できます。" },
    relatedSlugs: ["wait-types", "five-block-theory", "good-shape-rate"]
  },
  {
    slug: "beginner-nanikiru-mistakes",
    title: "初心者がやりがちな何切るミス10選",
    seoTitle: "初心者がやりがちな何切るミス10選｜牌効率の直し方を牌図で解説",
    description: "初心者が何切るで迷いやすい10の失敗を、ブロック数、受け入れ、役、安全度の観点から牌図つきで解説します。",
    lead: "何切るの失敗には、よく似たパターンがあります。10個の典型例を知っておくと、毎回すべての牌を数え直さなくても候補を絞れるようになります。",
    takeaways: ["完成面子と雀頭をむやみに崩さない", "5ブロックと受け入れを順に確認する", "攻撃中と守備中で判断基準を切り替える"],
    sections: [
      {
        heading: "形を見る前に好き嫌いで切らない",
        paragraphs: ["字牌や端牌だから不要、真ん中の牌だから必要と決めつけると、役牌や完成しやすい形を失います。まず完成面子、未完成ブロック、雀頭候補に分けます。", "同じシャンテン数の候補が残ったら、有効牌の種類と残り枚数を比べます。見た目ではなく、次に何を引くと進むかで判断します。"]
      },
      {
        heading: "受け入れ最大だけを正解にしない",
        paragraphs: ["受け入れが広くても、ドラや役をすべて失う候補が実戦の最善とは限りません。巡目、必要打点、他家の攻撃も最後に加えます。", "反対に、役や打点を意識しすぎて何シャンテンも遠回りするのも典型的なミスです。まず速度の基準を知り、外れる理由を言葉にします。"]
      },
      {
        heading: "守備に回ったら基準を切り替える",
        paragraphs: ["リーチを受けた後まで受け入れ枚数だけで切ると、放銃の危険が高まります。現物、スジ、カベなどの安全度を確認します。", "何切るは常に一つの正解を暗記する練習ではありません。手牌条件と局面条件を分けて考えることが大切です。"]
      }
    ],
    figures: [
      {
        title: "形で起きるミス1から5",
        description: "牌の一部分だけを見てしまう失敗を整理します。",
        badges: ["ミス1から5"],
        rows: [
          { label: "1 完成面子を崩す", tiles: ["man2", "man3", "man4"], note: "完成済みの順子は、明確な理由がなければ残します。" },
          { label: "2 唯一の雀頭を切る", tiles: ["pin6", "pin6"], note: "他に対子がないと、雀頭を作り直す必要があります。" },
          { label: "3 両面を落とす", tiles: ["sou4", "sou5"], resultLabel: "有効牌", resultTiles: ["sou3", "sou6"], tone: "warning", note: "1種類待ちの形より先に落とさないようにします。" },
          { label: "4 ブロック不足で中央牌を切る", tiles: ["man5"], resultLabel: "変化", resultTiles: ["man3", "man4", "man6", "man7"], note: "4ブロックの手では中央の孤立牌が新しい形を作ります。" },
          { label: "5 複合形を分断する", tiles: ["pin3", "pin4", "pin5", "pin5", "pin6"], note: "分け方が複数ある形は受け入れを確認してから切ります。" }
        ]
      },
      {
        title: "判断で起きるミス6から10",
        description: "数値、役、守備の使い分けで起きる失敗です。",
        badges: ["ミス6から10"],
        rows: [
          { label: "6 5ブロックを数えない", tiles: ["man4", "man5", "pin3", "pin5", "sou1", "sou2"], note: "ブロックが余っているか足りないかで、残す牌が変わります。" },
          { label: "7 見えている枚数を引かない", tiles: ["ji5", "ji5"], resultLabel: "残り", resultTiles: ["ji5", "ji5"], note: "同じ牌を2枚使っていれば、残りは最大2枚です。" },
          { label: "8 ドラだけで決める", tiles: ["pin5"], note: "ドラを残す価値と、シャンテン数や受け入れの損を比べます。" },
          { label: "9 鳴いた後の役を確認しない", tiles: ["man2", "man3"], resultLabel: "チー", resultTiles: ["man4"], note: "鳴いた後にアガれる役が残るかを先に確認します。" },
          { label: "10 攻撃と守備を混ぜる", tiles: ["man1", "man4", "man7"], note: "リーチ後は牌効率だけでなく、現物やスジの安全度を優先します。" }
        ]
      }
    ],
    toolLink: { href: "/trainer", label: "麻雀トレーニングで何切るを練習する", description: "形を見て自分で候補を選び、結果と見比べる練習ができます。" },
    relatedSlugs: ["five-block-theory", "tile-efficiency-and-ukeire", "mahjong-checker-examples"]
  },
  {
    slug: "suji-defense",
    title: "スジとは？安全牌として使える場面・危険な場面",
    seoTitle: "麻雀のスジとは？安全牌として使える場面と危険な場面を牌図で解説",
    description: "麻雀のスジの基本、1・4・7などの組み合わせ、リーチに対して安全度が上がる理由と過信できない場面を解説します。",
    lead: "スジは、相手の河から両面待ちに当たりにくい牌を探す考え方です。現物のような完全な安全牌ではなく、両面以外の待ちには当たることを前提に使います。",
    takeaways: ["スジは両面待ちの可能性を下げる材料", "現物ではないため放銃することがある", "序盤の外スジやひっかけに注意する"],
    sections: [
      {
        heading: "スジは両面待ちとフリテンから考える",
        paragraphs: ["相手の河に4萬があると、相手が2萬3萬を持つ1萬・4萬待ちや、5萬6萬を持つ4萬・7萬待ちでは4萬でアガれずフリテンになります。そのため1萬と7萬は両面待ちには比較的当たりにくいと考えます。", "同じ考え方で、5に対する2・8、6に対する3・9などを見ます。筋の組み合わせは1・4・7、2・5・8、3・6・9です。"]
      },
      {
        heading: "カンチャン・シャンポン・単騎には当たる",
        paragraphs: ["スジが否定するのは主に両面待ちです。1萬は1萬単騎、1萬のシャンポン、2萬3萬以外の複合形などで当たることがあります。", "特に宣言牌の近くを利用したスジひっかけや、終盤まで切られていない牌は注意が必要です。安全と断定せず、他の候補との比較に使います。"]
      },
      {
        heading: "現物がないときの順番を作る",
        paragraphs: ["まず現物を探し、なければ字牌の見え方、スジ、カベ、相手の手出しなどを組み合わせます。ひとつの情報だけで安全度を決めません。", "同じスジでも場に多く見えている牌や端牌は比較的選びやすく、ドラ周辺や無筋の中央牌は危険になりやすい傾向があります。"]
      }
    ],
    figures: [
      {
        title: "代表的なスジ3組",
        description: "河にある中の牌から、両側のスジを探します。",
        badges: ["守備"],
        rows: [
          { label: "4萬が河", tiles: ["man4"], resultLabel: "スジ", resultTiles: ["man1", "man7"], tone: "answer", note: "両面待ちには比較的当たりにくくなります。" },
          { label: "5筒が河", tiles: ["pin5"], resultLabel: "スジ", resultTiles: ["pin2", "pin8"], tone: "answer", note: "2・5・8の組み合わせです。" },
          { label: "6索が河", tiles: ["sou6"], resultLabel: "スジ", resultTiles: ["sou3", "sou9"], tone: "answer", note: "3・6・9の組み合わせです。" },
          { label: "スジでも当たる例", tiles: ["man1"], resultLabel: "相手の形", resultTiles: ["man1", "man1"], tone: "warning", note: "シャンポンや単騎待ちなら放銃します。" }
        ]
      }
    ],
    toolLink: { href: "/trainer", label: "守備も麻雀トレーニングで確認する", description: "攻める場面と安全牌を選ぶ場面を、実際の牌を使って練習できます。" },
    relatedSlugs: ["kabe-defense", "genbutsu-suji-kabe"]
  },
  {
    slug: "kabe-defense",
    title: "カベとは？牌図で覚える守備",
    seoTitle: "麻雀のカベとは？ノーチャンスとワンチャンスを牌図で覚える",
    description: "麻雀のカベを、見えている牌の枚数、ノーチャンス、ワンチャンス、外側の牌の安全度から牌図で解説します。",
    lead: "カベは、自分の手牌と河に見えている4枚の牌を使って、相手が作れる順子の形を絞る守備の考え方です。スジと同じく絶対安全ではありません。",
    takeaways: ["同じ牌が4枚見えればノーチャンス", "3枚見えはワンチャンス", "外側の牌でも単騎・シャンポンには当たる"],
    sections: [
      {
        heading: "4枚見えで順子の経路を減らす",
        paragraphs: ["同じ数字牌が4枚すべて見えていると、相手はその牌を手の中で使えません。その牌を必要とする両面やカンチャンの形が作りにくくなり、外側の牌の安全度を比べる材料になります。", "これをノーチャンスと呼びます。ただし、待ちの可能性が完全になくなるとは限りません。単騎、シャンポン、七対子などは別に残ります。"]
      },
      {
        heading: "3枚見えはワンチャンス",
        paragraphs: ["3枚見えている場合、残り1枚を相手が持っている可能性があります。4枚見えより信頼度が下がるため、ワンチャンスは終盤ほど過信できません。", "自分の手牌に見えている牌も数えます。河だけでなく、鳴かれている牌やドラ表示牌も含めて場全体を確認します。"]
      },
      {
        heading: "スジや現物と組み合わせる",
        paragraphs: ["カベだけで切る牌を決めるより、スジにもなっているか、他家に通っているか、ドラ周辺ではないかを重ねて判断します。", "守備では安全度の高い順に候補を並べる習慣が大切です。現物があれば、通常はカベだけを根拠にした牌より先に検討します。"]
      }
    ],
    figures: [
      {
        title: "見えている枚数でカベを判断する",
        description: "4枚見えと3枚見えの違いを確認します。",
        badges: ["ノーチャンス", "ワンチャンス"],
        rows: [
          { label: "4枚見え", tiles: ["man4", "man4", "man4", "man4"], resultLabel: "外側", resultTiles: ["man1", "man2"], tone: "answer", note: "4萬を使う順子の経路がなくなり、外側を比較しやすくなります。" },
          { label: "3枚見え", tiles: ["pin7", "pin7", "pin7"], resultLabel: "外側", resultTiles: ["pin8", "pin9"], note: "残り1枚が相手の手にある可能性を残します。" },
          { label: "カベでも残る待ち", tiles: ["sou2"], resultLabel: "例", resultTiles: ["sou2", "sou2"], tone: "warning", note: "単騎やシャンポンには当たるため、絶対安全ではありません。" }
        ]
      }
    ],
    toolLink: { href: "/trainer", label: "麻雀トレーニングで守備を練習する", description: "場に見えている牌を数えながら、安全度の違いを確かめます。" },
    relatedSlugs: ["suji-defense", "genbutsu-suji-kabe"]
  },
  {
    slug: "genbutsu-suji-kabe",
    title: "現物・スジ・カベの安全度の違い",
    seoTitle: "現物・スジ・カベの違い｜リーチに対する安全度と選ぶ順番",
    description: "麻雀守備の基本である現物、スジ、カベの安全度と根拠の違いを、牌図と実戦で選ぶ順番から解説します。",
    lead: "現物・スジ・カベは、どれも同じ強さの安全牌ではありません。何に対して安全なのか、どの待ちを否定できるのかを分けて覚えます。",
    takeaways: ["現物はその相手のロン牌にならない", "スジは主に両面待ちを絞る", "カベは見えている枚数から順子の形を絞る"],
    sections: [
      {
        heading: "現物は特定の相手に対する最優先候補",
        paragraphs: ["リーチ者がすでに捨てている牌は、フリテンのルールによりその相手からロンされません。これが現物です。", "現物は全員に安全とは限りません。リーチ者には通っても、別の仕掛けている相手に放銃する可能性があります。誰に対する安全牌かを区別します。"]
      },
      {
        heading: "スジとカベは危険度を下げる情報",
        paragraphs: ["スジは河の牌から両面待ちを、カベは見えている枚数から順子の組み合わせを絞ります。どちらも単騎やシャンポンなどを否定できません。", "一般には現物を優先し、現物がなければスジやカベが重なる牌、場に多く見えている字牌などを比較します。巡目やドラによって危険度は変わります。"]
      },
      {
        heading: "安全度は相手ごとに付け直す",
        paragraphs: ["二人からリーチが入った場合、一人の現物がもう一人には無筋ということがあります。河を一つにまとめず、相手ごとに安全牌を確認します。", "ベタオリでは、最も危険度の低い牌を複数枚持っているかも重要です。1枚だけ通して次巡に困らないよう、同じ現物の枚数も見ます。"]
      }
    ],
    figures: [
      {
        title: "安全度の根拠を比べる",
        description: "同じ『安全そう』でも、根拠と残る危険が違います。",
        badges: ["守備の優先順位"],
        rows: [
          { label: "現物", tiles: ["pin3"], resultLabel: "相手の河", resultTiles: ["pin3"], tone: "answer", note: "その相手からはロンされません。" },
          { label: "スジ", tiles: ["man4"], resultLabel: "候補", resultTiles: ["man1", "man7"], note: "両面待ちの可能性を下げますが、他の待ちは残ります。" },
          { label: "カベ", tiles: ["sou6", "sou6", "sou6", "sou6"], resultLabel: "外側", resultTiles: ["sou8", "sou9"], note: "見えている枚数で順子の経路を絞ります。" }
        ]
      }
    ],
    toolLink: { href: "/trainer/push-or-fold", label: "安全情報と手牌価値を比べて練習", description: "リーチや仕掛けに押すかオリるかを選び、現物・スジ・カベの根拠を相手ごとに確認できます。" },
    relatedSlugs: ["suji-defense", "kabe-defense", "betaori-basics", "furiten-basics"]
  },
  {
    slug: "calling-decision",
    title: "鳴いていい手・鳴かない方がいい手",
    seoTitle: "麻雀で鳴いていい手・鳴かない方がいい手｜初心者向け判断基準",
    description: "麻雀でチー・ポンしてよい手と門前で進めたい手を、役、シャンテン数、打点、守備力、局面の順に解説します。",
    lead: "鳴きは手を速くできる一方で、リーチできなくなり、守備に使える牌も減ります。鳴いた後の役と目的を先に決めると、不要な鳴きを減らせます。",
    takeaways: ["鳴く前にアガリ役が残るか確認する", "シャンテン数が本当に進むかを見る", "速度と打点・守備力の交換を考える"],
    sections: [
      {
        heading: "鳴いていいのは目的がはっきりした手",
        paragraphs: ["役牌のポン、タンヤオが確定するチーなど、鳴いた後も役があり、シャンテン数が進むなら有力です。オーラスでアガリが着順に直結する場面も速度を優先しやすくなります。", "ドラが多く打点が十分な手は、リーチを失っても鳴く価値があります。ただし、鳴いた結果1000点しかなくなるなら局面に必要な点数を確認します。"]
      },
      {
        heading: "役が消える鳴きと遠い鳴きは避ける",
        paragraphs: ["門前限定の役だけを頼りにしている手で鳴くと、アガリ役がなくなることがあります。鳴いた後の完成形を一度作ってから牌を取ります。", "3シャンテン以上の遠い手から端のチーをすると、手牌が短くなって守備力だけを失うことがあります。シャンテン数が進む鳴きでも、その後の受け入れが狭すぎないかを見ます。"]
      },
      {
        heading: "鳴く前の5秒チェック",
        paragraphs: ["役、シャンテン数、打点、残る形、守備力の5項目を短く確認します。全部を厳密に計算するより、目的を一言で説明できるかが目安です。", "『役牌で1000点を早くアガる』『満貫の一向聴に進める』のように説明できれば、結果にかかわらず振り返りやすくなります。"],
        bullets: ["鳴いた後の役はあるか", "シャンテン数は進むか", "必要な打点を残せるか", "良い受け入れが残るか", "安全牌をすべて失わないか"]
      }
    ],
    figures: [
      {
        title: "鳴き判断の代表例",
        description: "鳴いた後の役と形を確認してから判断します。",
        badges: ["チー", "ポン"],
        rows: [
          { label: "役牌をポン", tiles: ["ji5", "ji5"], resultLabel: "ポン", resultTiles: ["ji5"], tone: "answer", note: "發は三元牌なので、役を確保しながら速度を上げられます。" },
          { label: "タンヤオでチー", tiles: ["man3", "man4"], resultLabel: "チー", resultTiles: ["man5"], tone: "answer", note: "他の部分にも1・9・字牌がなく、食いタンありのルールなら役を残せます。" },
          { label: "役なしに注意", tiles: ["sou1", "sou2"], resultLabel: "チー", resultTiles: ["sou3"], tone: "warning", note: "鳴いた後に役がなければアガれません。" },
          { label: "門前の良形", tiles: ["pin4", "pin5"], resultLabel: "受け", resultTiles: ["pin3", "pin6"], note: "急ぐ理由がなければ、リーチと守備力を残す選択も有力です。" }
        ]
      }
    ],
    toolLink: { href: "/trainer/call-or-pass", label: "鳴く？鳴かない？を練習", description: "ポン・チー・スルーを選び、鳴いた後の形と数値、役・打点・守備を比べます。" },
    relatedSlugs: ["five-block-theory", "beginner-nanikiru-mistakes", "tile-efficiency-and-ukeire", "rule-differences-and-calling"]
  },
  {
    slug: "score-calculation-practice",
    title: "点数計算を牌姿20問で練習",
    seoTitle: "麻雀点数計算の練習問題20問｜子・親・ロン・ツモを牌姿で確認",
    description: "麻雀の点数計算を20問で練習できます。30符から50符、満貫、跳満、倍満まで、子・親・ロン・ツモを牌姿と一緒に確認します。",
    lead: "符と翻が分かった後、点数表をすばやく読めるようにする20問です。牌姿は場面をイメージする例として見て、各問に示した符・翻・親子・アガリ方から点数を答えてください。",
    takeaways: ["子と親の点数を分けて覚える", "ロンとツモの支払い方を区別する", "満貫以上は符計算が不要になる"],
    sections: [
      {
        heading: "まず30符・40符・50符のロンを固める",
        paragraphs: ["初心者は出現しやすい30符と40符から覚えると効率的です。子の30符1翻は1000点、30符2翻は2000点、30符3翻は3900点が基準になります。", "親は子のおよそ1.5倍です。すべてを一度に暗記するより、同じ符で翻数を上げながら並べて覚えます。"]
      },
      {
        heading: "ツモは支払いを分けて読む",
        paragraphs: ["子のツモは親の支払いと子の支払いを分けて『2000・4000』のように表します。親のツモは3人が同額を支払うため『4000オール』と読みます。", "本場、供託、積み棒はこの20問には含めません。基本点が安定してから追加条件を練習します。"]
      },
      {
        heading: "満貫以上は名前と上限をセットで覚える",
        paragraphs: ["満貫、跳満、倍満、三倍満、役満は、符計算による細かな差がなくなります。まず子のロン8000・12000・16000、親のロン12000・18000・24000を固めます。", "答えを見る前に声に出して読み、間違えた問題だけもう一度解くと定着しやすくなります。"]
      }
    ],
    figures: [
      {
        title: "点数表を読む順番",
        description: "牌姿から符と翻を確定した後、親子とロン・ツモを確認します。",
        badges: ["親子", "ロン・ツモ"],
        rows: [
          { label: "1 符と翻", tiles: ["man1", "man2", "man3", "pin4", "pin5", "pin6"], note: "役と符を数え、満貫以上かを確認します。" },
          { label: "2 親か子か", tiles: ["ji1"], note: "東家なら親、それ以外は子です。" },
          { label: "3 アガリ方", tiles: ["sou7", "sou8", "sou9"], note: "ロンは1人、ツモは3人で支払います。" }
        ]
      }
    ],
    practice: {
      heading: "点数計算20問",
      description: "条件から基本点を答えてください。牌姿は局面をイメージするための例で、本場・供託・積み棒はありません。",
      items: [
        { prompt: "第1問", tiles: ["man1", "man2", "man3", "man4", "man5", "man6", "pin2", "pin3", "pin4", "sou6", "sou7", "sou8", "pin5", "pin5"], conditions: "子・ロン・30符1翻", answer: "1000点", explanation: "子の30符1翻のロンは1000点です。" },
        { prompt: "第2問", tiles: ["man2", "man3", "man4", "man6", "man7", "man8", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "pin7", "pin7"], conditions: "親・ロン・30符1翻", answer: "1500点", explanation: "親の30符1翻のロンは1500点です。" },
        { prompt: "第3問", tiles: ["man1", "man2", "man3", "pin1", "pin2", "pin3", "sou1", "sou2", "sou3", "sou7", "sou8", "sou9", "man5", "man5"], conditions: "子・ロン・30符2翻", answer: "2000点", explanation: "子の30符2翻のロンは2000点です。" },
        { prompt: "第4問", tiles: ["man2", "man3", "man4", "pin2", "pin3", "pin4", "sou2", "sou3", "sou4", "man7", "man8", "man9", "pin6", "pin6"], conditions: "親・ロン・30符2翻", answer: "2900点", explanation: "親の30符2翻のロンは2900点です。" },
        { prompt: "第5問", tiles: ["man1", "man1", "man1", "man2", "man3", "man4", "pin5", "pin6", "pin7", "sou7", "sou8", "sou9", "pin2", "pin2"], conditions: "子・ロン・40符2翻", answer: "2600点", explanation: "子の40符2翻のロンは2600点です。" },
        { prompt: "第6問", tiles: ["pin1", "pin1", "pin1", "man3", "man4", "man5", "pin4", "pin5", "pin6", "sou4", "sou5", "sou6", "sou8", "sou8"], conditions: "親・ロン・40符2翻", answer: "3900点", explanation: "親の40符2翻のロンは3900点です。" },
        { prompt: "第7問", tiles: ["sou1", "sou1", "sou1", "man2", "man3", "man4", "pin3", "pin4", "pin5", "sou5", "sou6", "sou7", "ji1", "ji1"], conditions: "子・ロン・50符2翻", answer: "3200点", explanation: "子の50符2翻のロンは3200点です。" },
        { prompt: "第8問", tiles: ["ji5", "ji5", "ji5", "man4", "man5", "man6", "pin4", "pin5", "pin6", "sou4", "sou5", "sou6", "ji2", "ji2"], conditions: "親・ロン・50符2翻", answer: "4800点", explanation: "親の50符2翻のロンは4800点です。" },
        { prompt: "第9問", tiles: ["man1", "man2", "man3", "man4", "man5", "man6", "man7", "man8", "man9", "pin2", "pin3", "pin4", "sou5", "sou5"], conditions: "子・ロン・30符3翻", answer: "3900点", explanation: "子の30符3翻のロンは3900点です。" },
        { prompt: "第10問", tiles: ["pin1", "pin2", "pin3", "pin4", "pin5", "pin6", "pin7", "pin8", "pin9", "sou2", "sou3", "sou4", "man6", "man6"], conditions: "親・ロン・30符3翻", answer: "5800点", explanation: "親の30符3翻のロンは5800点です。" },
        { prompt: "第11問", tiles: ["man2", "man2", "man2", "pin3", "pin4", "pin5", "sou3", "sou4", "sou5", "man6", "man7", "man8", "pin8", "pin8"], conditions: "子・ロン・40符3翻", answer: "5200点", explanation: "子の40符3翻のロンは5200点です。" },
        { prompt: "第12問", tiles: ["pin2", "pin2", "pin2", "man3", "man4", "man5", "sou3", "sou4", "sou5", "pin6", "pin7", "pin8", "man8", "man8"], conditions: "親・ロン・40符3翻", answer: "7700点", explanation: "親の40符3翻のロンは7700点です。" },
        { prompt: "第13問", tiles: ["man1", "man2", "man3", "pin1", "pin2", "pin3", "sou1", "sou2", "sou3", "man7", "man8", "man9", "ji5", "ji5"], conditions: "子・ロン・満貫", answer: "8000点", explanation: "子の満貫ロンは8000点です。" },
        { prompt: "第14問", tiles: ["man2", "man3", "man4", "pin2", "pin3", "pin4", "sou2", "sou3", "sou4", "man6", "man7", "man8", "ji7", "ji7"], conditions: "親・ロン・満貫", answer: "12000点", explanation: "親の満貫ロンは12000点です。" },
        { prompt: "第15問", tiles: ["man1", "man1", "man1", "pin2", "pin2", "pin2", "sou3", "sou3", "sou3", "man4", "man5", "man6", "pin7", "pin7"], conditions: "子・ツモ・満貫", answer: "2000・4000", explanation: "子2人が2000点ずつ、親が4000点を支払います。" },
        { prompt: "第16問", tiles: ["man7", "man8", "man9", "pin7", "pin8", "pin9", "sou7", "sou8", "sou9", "man1", "man2", "man3", "pin5", "pin5"], conditions: "親・ツモ・満貫", answer: "4000オール", explanation: "3人が4000点ずつ支払います。" },
        { prompt: "第17問", tiles: ["man2", "man3", "man4", "pin2", "pin3", "pin4", "sou2", "sou3", "sou4", "man5", "man6", "man7", "pin8", "pin8"], conditions: "子・ロン・跳満", answer: "12000点", explanation: "子の跳満ロンは12000点です。" },
        { prompt: "第18問", tiles: ["man3", "man4", "man5", "pin3", "pin4", "pin5", "sou3", "sou4", "sou5", "man7", "man8", "man9", "pin2", "pin2"], conditions: "親・ロン・跳満", answer: "18000点", explanation: "親の跳満ロンは18000点です。" },
        { prompt: "第19問", tiles: ["man1", "man1", "man3", "man3", "pin5", "pin5", "pin7", "pin7", "sou2", "sou2", "sou6", "sou6", "ji1", "ji1"], conditions: "子・ロン・倍満", answer: "16000点", explanation: "子の倍満ロンは16000点です。" },
        { prompt: "第20問", tiles: ["man2", "man2", "man4", "man4", "pin6", "pin6", "pin8", "pin8", "sou3", "sou3", "sou7", "sou7", "ji7", "ji7"], conditions: "親・ロン・倍満", answer: "24000点", explanation: "親の倍満ロンは24000点です。" }
      ]
    },
    toolLink: { href: "/tools", label: "点数計算ツールで答え合わせする", description: "役、符、親子、ロン・ツモを入力して支払い点数を確認できます。" },
    relatedSlugs: ["wait-types", "calling-decision", "fu-calculation", "orasu-score-conditions"]
  },
  {
    slug: "what-is-tile-efficiency",
    title: "牌効率とは何か",
    seoTitle: "麻雀の牌効率とは？初心者向けに意味と考え方をやさしく解説",
    description: "麻雀の牌効率とは何かを、シャンテン数、有効牌、ブロックという基本用語から初心者向けに解説します。",
    lead: "牌効率は、アガリに近づきやすい牌を残すための考え方です。この入門記事では、計算へ進む前に知っておきたい意味と基本用語を整理します。具体的な受け入れ枚数の数え方は、実践編の「牌効率と受け入れの基本」で確認できます。",
    takeaways: ["牌効率はアガリまでの道筋を比べる考え方", "シャンテン数で現在地を知る", "有効牌と受け入れは次の段階で数える"],
    sections: [
      {
        heading: "牌効率は手牌の進みやすさを比べるもの",
        paragraphs: ["シャンテン数は、テンパイまであと何段階かを表します。打牌候補を比べるときは、まずシャンテン数を悪化させない候補を残します。", "受け入れが多そうに見えても、シャンテン数を一つ戻す牌は通常別の比較になります。距離と幅を混ぜないことが基本です。"]
      },
      {
        heading: "有効牌と受け入れを知る",
        paragraphs: ["有効牌は、引くとシャンテン数が進む牌です。種類が同じでも、自分の手牌や河に多く見えていれば残り枚数は少なくなります。", "両面は通常2種類、カンチャンとペンチャンは1種類です。手牌全体の複合形では、見た目より多くの有効牌を持つことがあります。"]
      },
      {
        heading: "実戦では速度以外を足す",
        paragraphs: ["牌効率上の候補が分かったら、ドラ、役、良形率、安全牌、巡目、点棒状況を加えます。速度の基準があるからこそ、どれだけ速度を譲っているかを把握できます。", "牌効率は正解を一つに固定する理論ではありません。候補と損得を見えるようにする共通言語です。"]
      }
    ],
    figures: [
      {
        title: "牌効率の比較手順",
        description: "同じ一向聴を保つ候補なら、次に受け入れを比べます。",
        badges: ["シャンテン", "受け入れ"],
        rows: [
          { label: "両面", tiles: ["man4", "man5"], resultLabel: "有効牌", resultTiles: ["man3", "man6"], tone: "answer", note: "2種類の受け入れがあります。" },
          { label: "カンチャン", tiles: ["pin3", "pin5"], resultLabel: "有効牌", resultTiles: ["pin4"], note: "1種類の受け入れです。" },
          { label: "役牌対子", tiles: ["ji5", "ji5"], resultLabel: "有効牌", resultTiles: ["ji5"], note: "枚数は少なくても、鳴いて役を作れる価値があります。" }
        ]
      }
    ],
    toolLink: { href: "/learn/guides/tile-efficiency-and-ukeire", label: "受け入れの数え方へ進む", description: "実際の牌姿で、有効牌の種類と残り枚数を比べる手順を学べます。" },
    relatedSlugs: ["tile-efficiency-and-ukeire", "five-block-theory", "one-shanten-ukeire"]
  },
  {
    slug: "one-shanten-ukeire",
    title: "イーシャンテンの受け入れの考え方",
    seoTitle: "麻雀イーシャンテンの受け入れとは？何切るで数える順番を解説",
    description: "イーシャンテンで打牌候補ごとの受け入れを数える方法を、完全一向聴、ヘッドレス、くっつき、良形率から解説します。",
    lead: "イーシャンテンは、あと1回手が進めばテンパイする状態です。同じイーシャンテンでも、受け入れ枚数とテンパイした後の待ちの質には大きな差があります。",
    takeaways: ["打牌後もイーシャンテンかを最初に確認する", "有効牌は重複を除いて残り枚数を数える", "枚数差が小さければ良形テンパイ率を見る"],
    sections: [
      {
        heading: "候補ごとにテンパイする牌を全部出す",
        paragraphs: ["まず1枚切った後の13枚を作り、どの牌を引くとテンパイするかを列挙します。同じ牌が複数の部分に効いても1種類として数えます。", "残り枚数は4枚から自分で使っている枚数と、実戦なら場に見えている枚数を引きます。種類が多くても残り枚数が少ない場合があります。"]
      },
      {
        heading: "完全一向聴は受け入れが広い",
        paragraphs: ["2つのターツと2つの対子を持つ完全一向聴は、面子完成と対子の刻子化の両方でテンパイできます。形が重なるため、受け入れが広くなりやすい構造です。", "雀頭のないヘッドレス一向聴や、孤立牌へのくっつきを待つ一向聴にも独自の広さがあります。形の名前より、実際の有効牌を数えることが確実です。"]
      },
      {
        heading: "テンパイ後の待ちまで比較する",
        paragraphs: ["受け入れ最大でも、ほとんどがカンチャンや単騎になる候補があります。枚数差が小さいときは、両面以上でテンパイする割合を比べます。", "終盤は形よりテンパイ枚数、序盤は将来の良形や打点を重視しやすくなります。巡目によって評価の順番を変えます。"]
      }
    ],
    figures: [
      {
        title: "一向聴の受け入れを部分ごとに探す",
        description: "面子になる牌、対子が刻子になる牌、雀頭を作る牌を重複なく数えます。",
        badges: ["一向聴", "受け入れ"],
        rows: [
          { label: "両面部分", tiles: ["man4", "man5"], resultLabel: "テンパイ牌", resultTiles: ["man3", "man6"], tone: "answer", note: "両側の2種類を数えます。" },
          { label: "カンチャン部分", tiles: ["pin3", "pin5"], resultLabel: "テンパイ牌", resultTiles: ["pin4"], note: "間の1種類を数えます。" },
          { label: "対子部分", tiles: ["sou7", "sou7"], resultLabel: "テンパイ牌", resultTiles: ["sou7"], tone: "answer", note: "残りは最大2枚です。" },
          { label: "良形変化", tiles: ["man3", "man5"], resultLabel: "変化", resultTiles: ["man2", "man4", "man6"], note: "テンパイ枚数だけでなく、その先の待ちの質も確認します。" }
        ]
      }
    ],
    toolLink: { href: "/analysis/mahjong-tool", label: "一向聴の受け入れを自動比較する", description: "打牌候補ごとの受け入れ枚数、良形率、有効牌を同じ画面で確認できます。" },
    relatedSlugs: ["tile-efficiency-and-ukeire", "good-shape-rate", "mahjong-checker-examples"]
  }
];

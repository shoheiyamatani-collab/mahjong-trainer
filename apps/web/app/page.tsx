"use client";

import { useMemo, useReducer, useState } from "react";
import {
  addTile,
  analyzeDiscards,
  bestDiscardsForReview,
  buildSevenShapeQuestion,
  chinitsuHandKey,
  chinitsuTile,
  chinitsuTiles,
  calculateHandScore,
  countsToTiles,
  emptyCounts,
  evaluateChinitsuWaitAnswer,
  evaluateSevenShapeAnswer,
  evaluateUkeireMaxAnswer,
  generateChinitsuWaitQuestion,
  generateHardUkeireMaxQuestion,
  generateSevenShapeQuestion,
  generateUkeireMaxQuestion,
  nextChinitsuSuit,
  parseHand,
  removeTile,
  sevenShapeQuestionKey,
  sortedHandText,
  sumCounts,
  TILE_NAMES,
  toggleChinitsuRankSelection,
  toggleSevenShapeRankSelection,
  toggleUkeireMaxSelection,
  type ChinitsuWaitQuestion,
  type Counts34,
  type DiscardAnalysis,
  type HandScoreResult,
  type ScoreResult,
  type SevenShapeMode,
  type SevenShapeQuestion,
  type Tile,
  type UkeireMaxQuestion
} from "@mahjong-trainer/mahjong-core";

type Mode = "checker" | "ukeireMax" | "ukeireMaxHard" | "scoring" | "chinitsu" | "sevenShape";

interface AppState {
  counts: Counts34;
  textInput: string;
  error: string | null;
}

type Action =
  | { type: "add"; tile: Tile }
  | { type: "remove"; tile: Tile }
  | { type: "undo" }
  | { type: "clear" }
  | { type: "sample" }
  | { type: "text"; value: string }
  | { type: "applyText" };

const SAMPLE_HAND = "345688m1234p3456s";
const SCORE_SAMPLE_HAND = "123m456m234p456p22s";
const IMAGE_SUFFIX = "-66-90-l-emb.png";
const HONOR_IMAGE_NUMBERS = new Map<string, number>([
  ["東", 1],
  ["南", 2],
  ["西", 3],
  ["北", 4],
  ["白", 5],
  ["發", 6],
  ["中", 7]
]);

const initialCounts = parseHand(SAMPLE_HAND);

function reducer(state: AppState, action: Action): AppState {
  try {
    if (action.type === "add") {
      if (sumCounts(state.counts) >= 14) {
        return { ...state, error: "手牌は14枚までです。" };
      }
      const counts = addTile(state.counts, action.tile);
      return syncCounts(counts);
    }
    if (action.type === "remove") {
      const counts = removeTile(state.counts, action.tile);
      return syncCounts(counts);
    }
    if (action.type === "undo") {
      const tiles = countsToTiles(state.counts);
      const last = tiles.at(-1);
      if (!last) return state;
      return syncCounts(removeTile(state.counts, last));
    }
    if (action.type === "clear") {
      return syncCounts(emptyCounts());
    }
    if (action.type === "sample") {
      return syncCounts(parseHand(SAMPLE_HAND));
    }
    if (action.type === "text") {
      return { ...state, textInput: action.value, error: null };
    }
    if (action.type === "applyText") {
      const counts = parseHand(state.textInput);
      if (sumCounts(counts) > 14) {
        return { ...state, error: "手牌は14枚までです。" };
      }
      return syncCounts(counts);
    }
    return state;
  } catch (error) {
    return { ...state, error: error instanceof Error ? error.message : String(error) };
  }
}

function syncCounts(counts: Counts34): AppState {
  return {
    counts,
    textInput: sortedHandText(counts),
    error: null
  };
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("checker");
  const [state, dispatch] = useReducer(reducer, syncCounts(initialCounts));

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Mahjong Trainer</p>
          <h1>麻雀 牌理トレーナー</h1>
        </div>
        <div className="countBadge">{sumCounts(state.counts)} / 14</div>
      </header>

      <nav className="modeGroups" aria-label="モード">
        <section className="modeGroup analysisModeGroup" aria-labelledby="analysis-mode-heading">
          <div className="modeGroupTitle" id="analysis-mode-heading">解析モード</div>
          <div className="segments">
            <ModeButton active={mode === "checker"} onClick={() => setMode("checker")}>牌理チェッカー</ModeButton>
            <ModeButton active={mode === "scoring"} onClick={() => setMode("scoring")}>点数計算チェッカー</ModeButton>
          </div>
        </section>
        <section className="modeGroup practiceModeGroup" aria-labelledby="practice-mode-heading">
          <div className="modeGroupTitle" id="practice-mode-heading">問題演習モード</div>
          <div className="segments practiceSegments">
            <ModeButton active={mode === "ukeireMax"} onClick={() => setMode("ukeireMax")}>受け入れMAX星人何切る</ModeButton>
            <ModeButton active={mode === "ukeireMaxHard"} onClick={() => setMode("ukeireMaxHard")}>受け入れMAX高難度</ModeButton>
            <ModeButton active={mode === "chinitsu"} onClick={() => setMode("chinitsu")}>清一色待ち当て</ModeButton>
            <ModeButton active={mode === "sevenShape"} onClick={() => setMode("sevenShape")}>7枚形トレーニング</ModeButton>
          </div>
        </section>
      </nav>

      {mode === "checker" ? <CheckerMode state={state} dispatch={dispatch} /> : null}
      {mode === "ukeireMax" ? <UkeireMaxMode variant="normal" /> : null}
      {mode === "ukeireMaxHard" ? <UkeireMaxMode variant="hard" /> : null}
      {mode === "chinitsu" ? <ChinitsuMode /> : null}
      {mode === "sevenShape" ? <SevenShapeTrainingMode /> : null}
      {mode === "scoring" ? <ScoringMode /> : null}
    </main>
  );
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={active ? "segment active" : "segment"} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function CheckerMode({ state, dispatch }: { state: AppState; dispatch: React.Dispatch<Action> }) {
  const tiles = countsToTiles(state.counts);
  const analysis = useMemo(() => {
    if (sumCounts(state.counts) !== 14) return null;
    try {
      const results = analyzeDiscards(state.counts);
      const best = new Set(bestDiscardsForReview(results).map((result) => result.discard));
      return { results, best };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }, [state.counts]);

  return (
    <section className="modeGrid">
      <section className="panel handPanel">
        <div className="panelHeader">
          <h2>手牌</h2>
          <span>{tiles.length} / 14</span>
        </div>
        <TileStrip tiles={tiles} onTileClick={(tile) => dispatch({ type: "remove", tile })} emptyText="牌を追加してください" />
        <div className="actions">
          <button type="button" onClick={() => dispatch({ type: "undo" })}>一枚戻す</button>
          <button type="button" onClick={() => dispatch({ type: "clear" })}>クリア</button>
          <button type="button" onClick={() => dispatch({ type: "sample" })}>サンプル</button>
        </div>
        <div className="textInputRow">
          <input
            aria-label="手牌文字列"
            value={state.textInput}
            onChange={(event) => dispatch({ type: "text", value: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter") dispatch({ type: "applyText" });
            }}
          />
          <button type="button" onClick={() => dispatch({ type: "applyText" })}>反映</button>
        </div>
        {state.error ? <p className="error">{state.error}</p> : null}
      </section>

      <section className="panel palettePanel">
        <div className="panelHeader">
          <h2>牌を追加</h2>
        </div>
        <TilePalette counts={state.counts} onAdd={(tile) => dispatch({ type: "add", tile })} />
      </section>

      <section className="resultsPanel">
        <div className="panelHeader">
          <h2>打牌候補・有効牌比較</h2>
        </div>
        {analysis == null ? (
          <div className="emptyState">14枚の手牌を入力すると、打牌候補を比較します。</div>
        ) : "error" in analysis ? (
          <div className="error">{analysis.error}</div>
        ) : (
          <DiscardResults results={analysis.results} best={analysis.best} />
        )}
      </section>
    </section>
  );
}

function UkeireMaxMode({ variant }: { variant: "normal" | "hard" }) {
  const isHard = variant === "hard";
  const [question, setQuestion] = useState<UkeireMaxQuestion>(() => isHard ? generateHardUkeireMaxQuestion() : generateUkeireMaxQuestion());
  const [selected, setSelected] = useState<Tile[]>([]);
  const [checked, setChecked] = useState(false);
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const result = checked ? evaluateUkeireMaxAnswer(question, selected) : null;
  const best = useMemo(() => new Set(question.bestDiscards), [question]);

  function toggle(tile: Tile) {
    if (checked) return;
    setSelected((current) => toggleUkeireMaxSelection(current, tile));
  }

  function nextQuestion() {
    setQuestion(isHard ? generateHardUkeireMaxQuestion() : generateUkeireMaxQuestion());
    setSelected([]);
    setChecked(false);
  }

  return (
    <section className="modeGrid ukeireMaxMode">
      <section className="panel handPanel">
        <div className="panelHeader">
          <h2>{isHard ? "受け入れMAX星人何切る 高難易度ver" : "受け入れMAX星人何切る"}</h2>
          <span>14 / 14</span>
        </div>
        <ProblemTileStrip counts={question.counts} selected={selectedSet} onTileClick={toggle} />
        <div className="actions">
          <button disabled={selected.length === 0} onClick={() => setChecked(true)} type="button">答え合わせ</button>
          <button onClick={nextQuestion} type="button">次の問題</button>
        </div>
      </section>

      <section className="panel selectedPanel">
        <div className="panelHeader">
          <h2>選択中の牌</h2>
        </div>
        <TileStrip tiles={selected} emptyText="問題の牌をクリックして選んでください" />
        {result ? <AnswerResult result={result} /> : null}
        {checked ? (
          <div className="answerDetail">
            <div className="smallLabel">正解打牌</div>
            <TileStrip tiles={question.bestDiscards} />
            <p>最大受け入れ: {question.bestUkeireTypes}種 / {question.bestUkeireTiles}枚</p>
          </div>
        ) : null}
      </section>

      <section className="resultsPanel">
        <div className="panelHeader">
          <h2>打牌候補・有効牌比較</h2>
        </div>
        {checked ? (
          <DiscardResults results={question.results} best={best} />
        ) : (
          <div className="emptyState">答え合わせ後に、各打牌候補の受け入れを確認できます。</div>
        )}
      </section>
    </section>
  );
}

function ChinitsuMode() {
  const [question, setQuestion] = useState<ChinitsuWaitQuestion>(() => generateChinitsuWaitQuestion(Math.random, "m"));
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [recentKeys, setRecentKeys] = useState<string[]>([]);
  const isCorrect = checked ? evaluateChinitsuWaitAnswer(question.waits, selected) : false;

  function toggle(rank: number) {
    if (checked) return;
    setSelected((current) => toggleChinitsuRankSelection(current, rank));
  }

  function nextQuestion() {
    if (!checked) {
      setChecked(true);
      return;
    }

    const recent = [...recentKeys, chinitsuHandKey(question.counts)].slice(-80);
    const next = generateChinitsuWaitQuestion(Math.random, nextChinitsuSuit(question.suit), recent);
    setRecentKeys(recent);
    setQuestion(next);
    setSelected([]);
    setChecked(false);
  }

  return (
    <section className="modeGrid chinitsuMode">
      <section className="panel handPanel">
        <div className="panelHeader">
          <h2>清一色待ち当て特訓</h2>
          <span>13 / 13</span>
        </div>
        <TileStrip tiles={chinitsuTiles(question.counts, question.suit)} />
      </section>

      <section className="panel selectedPanel">
        <div className="panelHeader">
          <h2>待ち牌選択</h2>
        </div>
        <RankAnswerPalette suit={question.suit} selected={selected} disabled={checked} onToggle={toggle} />
        <div className="answerDetail compactAnswerDetail">
          <div className="smallLabel">選択中</div>
          <TileStrip tiles={selected.map((rank) => chinitsuTile(rank, question.suit))} emptyText="1〜9から待ち牌を選んでください" />
        </div>
        <div className="actions">
          <button disabled={selected.length === 0 || checked} onClick={() => setChecked(true)} type="button">決定</button>
          <button onClick={nextQuestion} type="button">次の問題</button>
        </div>
        {checked ? <AnswerResult result={isCorrect ? "correct" : "wrong"} /> : null}
        {checked ? (
          <div className="answerDetail">
            <div className="smallLabel">正解</div>
            <TileStrip tiles={question.waits.map((rank) => chinitsuTile(rank, question.suit))} />
            <p>{question.waits.length}種 / {question.waits.reduce((sum, rank) => sum + (question.remainingTiles[rank] ?? 0), 0)}枚</p>
          </div>
        ) : null}
      </section>
    </section>
  );
}

function SevenShapeTrainingMode() {
  const [trainingMode, setTrainingMode] = useState<SevenShapeMode>("basic");
  const [question, setQuestion] = useState<SevenShapeQuestion>(() => generateSevenShapeQuestion("basic"));
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [recentKeys, setRecentKeys] = useState<string[]>([]);
  const [courseScore, setCourseScore] = useState(0);
  const [courseFinished, setCourseFinished] = useState(false);
  const isCorrect = checked ? evaluateSevenShapeAnswer(question.waits, selected) : false;
  const isAllCourse = trainingMode === "all";

  function changeTrainingMode(nextMode: SevenShapeMode) {
    const next = nextMode === "all" ? buildSevenShapeQuestion(1) : generateSevenShapeQuestion("basic");
    setTrainingMode(nextMode);
    setQuestion(next);
    setSelected([]);
    setChecked(false);
    setShowHint(false);
    setRecentKeys([]);
    setCourseScore(0);
    setCourseFinished(false);
  }

  function toggle(rank: number) {
    if (checked) return;
    setSelected((current) => toggleSevenShapeRankSelection(current, rank));
  }

  function nextQuestion() {
    if (isAllCourse) {
      if (courseFinished) {
        restartAllCourse();
        return;
      }
      const nextPatternId = Math.min(question.patternId + 1, 19);
      setQuestion(buildSevenShapeQuestion(nextPatternId));
      setSelected([]);
      setChecked(false);
      setShowHint(false);
      return;
    }

    const recent = [...recentKeys, sevenShapeQuestionKey(question)].slice(-12);
    const next = generateSevenShapeQuestion(trainingMode, Math.random, recent);
    setRecentKeys(recent);
    setQuestion(next);
    setSelected([]);
    setChecked(false);
    setShowHint(false);
  }

  function submitAnswer() {
    if (selected.length === 0 || checked) return;
    const correct = evaluateSevenShapeAnswer(question.waits, selected);
    if (isAllCourse) {
      setCourseScore((current) => current + (correct ? 1 : 0));
      if (question.patternId === 19) {
        setCourseFinished(true);
      }
    }
    setChecked(true);
  }

  function restartAllCourse() {
    setQuestion(buildSevenShapeQuestion(1));
    setSelected([]);
    setChecked(false);
    setShowHint(false);
    setCourseScore(0);
    setCourseFinished(false);
  }

  return (
    <section className="modeGrid sevenShapeMode">
      <section className="panel handPanel learningPanel">
        <div className="panelHeader">
          <h2>7枚形トレーニング</h2>
          <span>{isAllCourse ? `${question.patternId} / 19` : "ランダム"}</span>
        </div>
        <p className="modeLead">メンチン・多面待ちの基礎になる7枚形を覚える練習です</p>
        <SegmentPair
          leftLabel="基本モード"
          rightLabel="全19パターン"
          rightActive={trainingMode === "all"}
          onLeft={() => changeTrainingMode("basic")}
          onRight={() => changeTrainingMode("all")}
        />
        <div className="questionMeta">
          <Stat label="問題番号" value={isAllCourse ? `${question.patternId}/19` : "ランダム"} />
          <Stat label="カテゴリ" value={question.category} />
          <Stat label="難度" value={question.difficulty} />
        </div>
        <TileStrip tiles={question.tiles.map((rank) => chinitsuTile(rank, question.suit))} />
      </section>

      <section className="panel selectedPanel">
        <div className="panelHeader">
          <h2>待ち牌選択</h2>
        </div>
        <RankAnswerPalette suit={question.suit} selected={selected} disabled={checked} onToggle={toggle} />
        <div className="answerDetail compactAnswerDetail">
          <div className="smallLabel">選択中</div>
          <TileStrip tiles={selected.map((rank) => chinitsuTile(rank, question.suit))} emptyText="1〜9から待ち牌を選んでください" />
        </div>
        <div className="actions">
          <button disabled={checked} onClick={() => setShowHint((current) => !current)} type="button">ヒントを見る</button>
          <button disabled={selected.length === 0 || checked} onClick={submitAnswer} type="button">回答する</button>
          {checked ? <button onClick={nextQuestion} type="button">{courseFinished ? "もう一度" : "次の問題"}</button> : null}
        </div>
        {showHint ? <div className="hintBox">{question.hint}</div> : null}
        {checked ? <AnswerResult result={isCorrect ? "correct" : "wrong"} /> : null}
        {checked ? (
          <div className="answerDetail">
            <div className="answerCompare">
              <div>
                <div className="smallLabel">正解の待ち牌</div>
                <TileStrip tiles={question.waits.map((rank) => chinitsuTile(rank, question.suit))} />
                <p>{question.waits.length}種 / {question.waits.reduce((sum, rank) => sum + (question.remainingTiles[rank] ?? 0), 0)}枚</p>
              </div>
              <div>
                <div className="smallLabel">自分の選択</div>
                <TileStrip tiles={selected.map((rank) => chinitsuTile(rank, question.suit))} emptyText="未選択" />
              </div>
            </div>
            <div className="explanationBox">{question.explanation}</div>
            {courseFinished ? (
              <div className="resultCard">
                <div className="smallLabel">リザルト</div>
                <div className="resultScore">{courseScore} / 19問正解</div>
                <p>全19パターン終了です。もう一度押すと1問目からやり直せます。</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </section>
  );
}

function ScoringMode() {
  const [counts, setCounts] = useState<Counts34>(() => parseHand(SCORE_SAMPLE_HAND));
  const [winningTile, setWinningTile] = useState<Tile | null>("4p");
  const [isDealer, setIsDealer] = useState(false);
  const [winMethod, setWinMethod] = useState<"ron" | "tsumo">("ron");
  const [roundWind, setRoundWind] = useState<Tile>("東");
  const [seatWind, setSeatWind] = useState<Tile>("南");
  const [riichi, setRiichi] = useState(true);
  const [ippatsu, setIppatsu] = useState(false);
  const [dora, setDora] = useState(0);
  const [honba, setHonba] = useState(0);
  const [riichiSticks, setRiichiSticks] = useState(0);

  const tiles = countsToTiles(counts);
  const winningOptions = tiles;

  const result = useMemo(() => {
    if (sumCounts(counts) !== 14) {
      return { error: "14枚の和了形を入力してください。" };
    }
    if (!winningTile) {
      return { error: "和了牌を選択してください。" };
    }
    try {
      return {
        value: calculateHandScore({
          counts,
          winningTile,
          isDealer,
          winMethod,
          roundWind,
          seatWind,
          riichi,
          ippatsu,
          dora,
          honba,
          riichiSticks
        })
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }, [counts, dora, honba, ippatsu, isDealer, riichi, riichiSticks, roundWind, seatWind, winMethod, winningTile]);

  function addScoreTile(tile: Tile) {
    if (sumCounts(counts) >= 14) return;
    setCounts((current) => addTile(current, tile));
  }

  function removeScoreTile(tile: Tile) {
    const next = removeTile(counts, tile);
    setCounts(next);
    if (winningTile === tile && !countsToTiles(next).includes(tile)) {
      setWinningTile(null);
    }
  }

  function clearScoreHand() {
    setCounts(emptyCounts());
    setWinningTile(null);
  }

  function sampleScoreHand() {
    setCounts(parseHand(SCORE_SAMPLE_HAND));
    setWinningTile("4p");
    setRiichi(true);
    setWinMethod("ron");
  }

  return (
    <section className="modeGrid scoringMode">
      <section className="panel handPanel">
        <div className="panelHeader">
          <h2>点数計算チェッカー</h2>
          <span>{sumCounts(counts)} / 14</span>
        </div>
        <TileStrip tiles={tiles} onTileClick={removeScoreTile} emptyText="牌を追加してください" />
        <div className="actions">
          <button onClick={clearScoreHand} type="button">クリア</button>
          <button onClick={sampleScoreHand} type="button">サンプル</button>
        </div>
        <div className="panelHeader compactHeader">
          <h2>牌を追加</h2>
        </div>
        <TilePalette counts={counts} onAdd={addScoreTile} />
      </section>

      <section className="panel selectedPanel">
        <div className="panelHeader">
          <h2>条件</h2>
        </div>
        <div className="answerDetail compactAnswerDetail">
          <div className="smallLabel">和了牌</div>
          <WinningTilePicker tiles={winningOptions} selected={winningTile} onSelect={setWinningTile} />
          <div className="selectedWinningTilePreview">
            <div className="smallLabel">選択中の和了牌</div>
            <TileStrip tiles={winningTile ? [winningTile] : []} emptyText="未選択" />
          </div>
        </div>
        <SegmentPair
          leftLabel="子"
          rightLabel="親"
          rightActive={isDealer}
          onLeft={() => setIsDealer(false)}
          onRight={() => setIsDealer(true)}
        />
        <SegmentPair
          leftLabel="ロン"
          rightLabel="ツモ"
          rightActive={winMethod === "tsumo"}
          onLeft={() => setWinMethod("ron")}
          onRight={() => setWinMethod("tsumo")}
        />
        <div className="scoreToggles">
          <label><input checked={riichi} onChange={(event) => setRiichi(event.target.checked)} type="checkbox" /> リーチ</label>
          <label><input checked={ippatsu} onChange={(event) => setIppatsu(event.target.checked)} type="checkbox" /> 一発</label>
        </div>
        <div className="scoreInputs">
          <WindField label="場風" value={roundWind} onChange={setRoundWind} />
          <WindField label="自風" value={seatWind} onChange={setSeatWind} />
          <NumberField label="ドラ" min={0} value={dora} onChange={setDora} />
          <NumberField label="本場" min={0} value={honba} onChange={setHonba} />
          <NumberField label="供託" min={0} value={riichiSticks} onChange={setRiichiSticks} />
        </div>
      </section>

      <section className="panel selectedPanel scoreResultPanel">
        <div className="panelHeader">
          <h2>結果</h2>
        </div>
        {"error" in result ? <div className="error">{result.error}</div> : <HandScoreResultCard result={result.value} />}
      </section>
    </section>
  );
}

function SegmentPair({
  leftLabel,
  rightLabel,
  rightActive,
  onLeft,
  onRight
}: {
  leftLabel: string;
  rightLabel: string;
  rightActive: boolean;
  onLeft: () => void;
  onRight: () => void;
}) {
  return (
    <div className="scoreSegments">
      <button className={!rightActive ? "scoreSegment active" : "scoreSegment"} onClick={onLeft} type="button">{leftLabel}</button>
      <button className={rightActive ? "scoreSegment active" : "scoreSegment"} onClick={onRight} type="button">{rightLabel}</button>
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  step = 1,
  disabled,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="numberField">
      <span>{label}</span>
      <input
        disabled={disabled}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="number"
        value={value}
      />
    </label>
  );
}

function ScoreResultCard({ result }: { result: ScoreResult }) {
  return (
    <div className="scoreCard">
      <div>
        <div className="smallLabel">点数</div>
        <div className="scoreTotal">{result.totalPoints.toLocaleString()}点</div>
      </div>
      <div className="scoreMeta">
        <Stat label="区分" value={result.limitLabel} />
        <Stat label="翻 / 符" value={result.fu == null ? `${result.han}翻 / 役満` : `${result.han}翻 / ${result.fu}符`} />
      </div>
      <div className="paymentList">
        {result.payments.map((payment) => (
          <div className="paymentRow" key={payment.label}>
            <span>{payment.label}</span>
            <strong>{payment.points.toLocaleString()}点</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function HandScoreResultCard({ result }: { result: HandScoreResult }) {
  return (
    <div className="scoreResultStack">
      <ScoreResultCard result={result.score} />
      <div className="answerDetail">
        <div className="smallLabel">役</div>
        <div className="yakuList">
          {result.yaku.length ? result.yaku.map((yaku, index) => (
            <div className="paymentRow" key={`${yaku.name}-${index}`}>
              <span>{yaku.name}</span>
              <strong>{yaku.isYakuman ? "役満" : `${yaku.han}翻`}</strong>
            </div>
          )) : <p>役満数指定</p>}
        </div>
      </div>
      {result.fu ? (
        <div className="answerDetail">
          <div className="smallLabel">符</div>
          <p>{result.fu.totalBeforeRounding}符 → {result.fu.roundedFu}符</p>
          <div className="yakuList">
            {result.fu.items.map((item) => (
              <div className="paymentRow" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.fu}符</strong>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function WinningTilePicker({ tiles, selected, onSelect }: { tiles: Tile[]; selected: Tile | null; onSelect: (tile: Tile) => void }) {
  if (tiles.length === 0) {
    return <div className="emptyState">手牌を入力してください</div>;
  }
  return (
    <div className="tileStrip">
      {tiles.map((tile, index) => (
        <button className={selected === tile ? "stripTileButton selected" : "stripTileButton"} key={`${tile}-${index}`} onClick={() => onSelect(tile)} type="button">
          <TileImage tile={tile} />
        </button>
      ))}
    </div>
  );
}

function WindField({ label, value, onChange }: { label: string; value: Tile; onChange: (tile: Tile) => void }) {
  return (
    <label className="numberField">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as Tile)}>
        {(["東", "南", "西", "北"] as Tile[]).map((wind) => (
          <option key={wind} value={wind}>{wind}</option>
        ))}
      </select>
    </label>
  );
}

function RankAnswerPalette({
  suit,
  selected,
  disabled,
  onToggle
}: {
  suit: "m" | "p" | "s";
  selected: number[];
  disabled: boolean;
  onToggle: (rank: number) => void;
}) {
  const selectedSet = new Set(selected);
  return (
    <div className="chinitsuAnswerPalette">
      {Array.from({ length: 9 }, (_, index) => index + 1).map((rank) => (
        <button
          className={selectedSet.has(rank) ? "tileButton selected" : "tileButton"}
          disabled={disabled}
          key={rank}
          onClick={() => onToggle(rank)}
          title={`${rank}${suit}`}
          type="button"
        >
          <TileImage tile={chinitsuTile(rank, suit)} />
        </button>
      ))}
    </div>
  );
}

function ProblemTileStrip({ counts, selected, onTileClick }: { counts: Counts34; selected: Set<Tile>; onTileClick: (tile: Tile) => void }) {
  const tiles = countsToTiles(counts);
  return (
    <div className="tileStrip problemTileStrip" style={{ "--tile-count": tiles.length } as React.CSSProperties}>
      {tiles.map((tile, index) => (
        <button
          className={selected.has(tile) ? "stripTileButton selected" : "stripTileButton"}
          key={`${tile}-${index}`}
          onClick={() => onTileClick(tile)}
          type="button"
        >
          <TileImage tile={tile} />
        </button>
      ))}
    </div>
  );
}

function AnswerResult({ result }: { result: "correct" | "partial" | "wrong" }) {
  if (result === "correct") {
    return (
      <div className="answerResult answerCorrect">
        <span className="answerSymbol">○</span> 正解！
      </div>
    );
  }
  if (result === "partial") {
    return (
      <div className="answerResult answerPartial">
        <span className="answerSymbol">△</span> もう一歩！
      </div>
    );
  }
  return (
    <div className="answerResult answerWrong">
      <span className="answerSymbol">×</span> 不正解…
    </div>
  );
}

function TilePalette({ counts, onAdd }: { counts: Counts34; onAdd: (tile: Tile) => void }) {
  const rows = [TILE_NAMES.slice(0, 9), TILE_NAMES.slice(9, 18), TILE_NAMES.slice(18, 27), TILE_NAMES.slice(27)];
  return (
    <div className="paletteRows">
      {rows.map((row, rowIndex) => (
        <div className="paletteRow" key={rowIndex}>
          {row.map((tile) => (
            <button
              className="tileButton"
              disabled={counts[TILE_NAMES.indexOf(tile)] >= 4}
              key={tile}
              onClick={() => onAdd(tile)}
              title={tile}
              type="button"
            >
              <TileImage tile={tile} />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function TileStrip({ tiles, onTileClick, emptyText }: { tiles: Tile[]; onTileClick?: (tile: Tile) => void; emptyText?: string }) {
  if (tiles.length === 0) {
    return <div className="emptyStrip">{emptyText ?? "-"}</div>;
  }
  return (
    <div className="tileStrip" style={{ "--tile-count": tiles.length } as React.CSSProperties}>
      {tiles.map((tile, index) =>
        onTileClick ? (
          <button className="stripTileButton" key={`${tile}-${index}`} onClick={() => onTileClick(tile)} type="button">
            <TileImage tile={tile} />
          </button>
        ) : (
          <TileImage key={`${tile}-${index}`} tile={tile} />
        )
      )}
    </div>
  );
}

function DiscardResults({ results, best }: { results: DiscardAnalysis[]; best: Set<Tile> }) {
  return (
    <div className="discardList">
      {results.map((result) => {
        const isBest = best.has(result.discard);
        const goodRate = result.tenpaiDetails.length ? formatPercent(result.goodShapeRate) : "-";
        const superRate = result.tenpaiDetails.length ? formatPercent(result.superGoodShapeRate) : "-";
        return (
          <article className={isBest ? "discardCard best" : "discardCard"} key={result.discard}>
            <div className="discardGrid">
              <div>
                <div className="smallLabel">{isBest ? "打牌☆" : "打牌"}</div>
                <TileImage tile={result.discard} />
              </div>
              <Stat label="進牌数" value={`${result.ukeireTypes}種`} />
              <Stat label="進む枚数" value={`${result.ukeireTiles}枚`} />
              <Stat className={result.goodShapeRate >= 1 ? "redText" : undefined} label="良系率" value={goodRate} />
              <Stat className={result.superGoodShapeRate >= 0.01 ? "greenText" : undefined} label="超良系率" value={superRate} />
              <div className="ukeireCell">
                <div className="smallLabel">有効牌</div>
                <TileStrip tiles={result.ukeire} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <div className="smallLabel">{label}</div>
      <div className={className ? `statValue ${className}` : "statValue"}>{value}</div>
    </div>
  );
}

function PlaceholderMode({ mode }: { mode: Mode }) {
  const labels: Record<Mode, string> = {
    checker: "牌理チェッカー",
    ukeireMax: "受け入れMAX星人何切る",
    ukeireMaxHard: "受け入れMAX高難度",
    scoring: "点数計算チェッカー",
    chinitsu: "清一色待ち当て",
    sevenShape: "7枚形トレーニング"
  };
  return (
    <section className="panel placeholder">
      <h2>{labels[mode]}</h2>
      <p>Next.js版ではまず牌理チェッカーを移植済みです。このモードは次の段階で移植します。</p>
    </section>
  );
}

function TileImage({ tile }: { tile: Tile }) {
  return <img alt={tile} src={tileImageSrc(tile)} />;
}

function tileImageSrc(tile: Tile): string {
  if (tile.endsWith("m")) return `/tiles/man${tile[0]}${IMAGE_SUFFIX}`;
  if (tile.endsWith("p")) return `/tiles/pin${tile[0]}${IMAGE_SUFFIX}`;
  if (tile.endsWith("s")) return `/tiles/sou${tile[0]}${IMAGE_SUFFIX}`;
  return `/tiles/ji${HONOR_IMAGE_NUMBERS.get(tile) ?? 1}${IMAGE_SUFFIX}`;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import QRCode from "qrcode";
import sharp from "sharp";
import type { Tile } from "@mahjong-trainer/mahjong-core";
import type { RenderedFrame, ResolvedConfig, ShortsProblem } from "./types.js";
import { tileDisplay, xmlEscape } from "./utils.js";

type Phase = "brand" | "intro" | "question" | "reveal" | "answer" | "cta";

interface FrameSpec {
  name: string;
  phase: Phase;
  durationSeconds: number;
  countdown?: number;
}

interface Overlay {
  input: Buffer;
  left: number;
  top: number;
}

const HONOR_IMAGE_NUMBERS = new Map<Tile, number>([
  ["東", 1], ["南", 2], ["西", 3], ["北", 4], ["白", 5], ["發", 6], ["中", 7]
]);
const IMAGE_SUFFIX = "-66-90-l-emb.png";

export async function renderFrames(problem: ShortsProblem, jobDir: string, config: ResolvedConfig, showQr: boolean): Promise<RenderedFrame[]> {
  const framesDir = resolve(jobDir, "frames");
  await mkdir(framesDir, { recursive: true });
  const specs: FrameSpec[] = [
    { name: "00-brand", phase: "brand", durationSeconds: 1 },
    { name: "01-intro", phase: "intro", durationSeconds: 3 },
    ...Array.from({ length: 8 }, (_, index) => ({ name: `${String(index + 2).padStart(2, "0")}-countdown-${8 - index}`, phase: "question" as const, durationSeconds: 1, countdown: 8 - index })),
    { name: "10-reveal", phase: "reveal", durationSeconds: 1 },
    { name: "11-answer", phase: "answer", durationSeconds: 7 },
    { name: "12-cta", phase: "cta", durationSeconds: 5 }
  ];
  const logo = await brandLogo(config);
  const qr = showQr ? await QRCode.toBuffer(problem.toolUrl, {
    type: "png",
    width: 250,
    margin: 1,
    color: { dark: "#061a3b", light: "#ffffff" }
  }) : null;
  const rendered: RenderedFrame[] = [];
  for (const spec of specs) {
    const path = resolve(framesDir, `${spec.name}.png`);
    const overlays = await frameOverlays(problem, spec.phase, logo, qr, config);
    const svg = frameSvg(problem, spec.phase, spec.countdown, showQr, config);
    await sharp(Buffer.from(svg)).composite(overlays).png().toFile(path);
    rendered.push({ path, durationSeconds: spec.durationSeconds });
  }
  return rendered;
}

async function frameOverlays(problem: ShortsProblem, phase: Phase, logo: Buffer, qr: Buffer | null, config: ResolvedConfig): Promise<Overlay[]> {
  const overlays: Overlay[] = [{ input: logo, left: 70, top: 155 }];
  if (phase === "brand") return overlays;
  if (phase === "cta") {
    if (qr) overlays.push({ input: qr, left: 105, top: 1165 });
    return overlays;
  }

  const handSize = { width: 64, height: 87, gap: 4 };
  const handTop = phase === "answer" ? 650 : 858;
  overlays.push(...await centeredTiles(problem.hand, handTop, handSize, config));

  if (phase === "answer") {
    const answerSize = problem.answer.length > 3 ? { width: 112, height: 153, gap: 18 } : { width: 132, height: 180, gap: 22 };
    overlays.push(...await centeredTiles(problem.answer, 970, answerSize, config));
    if (problem.type === "nani-kiru") {
      const ukeireSize = problem.ukeire.length > 12
        ? { width: 64, height: 87, gap: 6 }
        : problem.ukeire.length > 7
          ? { width: 70, height: 95, gap: 7 }
          : { width: 82, height: 112, gap: 10 };
      overlays.push(...await centeredTiles(problem.ukeire, 1495, ukeireSize, config));
    }
  }
  return overlays;
}

async function centeredTiles(
  tiles: Tile[],
  top: number,
  size: { width: number; height: number; gap: number },
  config: ResolvedConfig
): Promise<Overlay[]> {
  const totalWidth = tiles.length * size.width + Math.max(0, tiles.length - 1) * size.gap;
  const start = Math.round((config.video.width - totalWidth) / 2);
  return Promise.all(tiles.map(async (tile, index) => ({
    input: await sharp(tilePath(tile, config)).resize(size.width, size.height).png().toBuffer(),
    left: start + index * (size.width + size.gap),
    top
  })));
}

async function brandLogo(config: ResolvedConfig): Promise<Buffer> {
  const source = resolve(config.webPublicDir, "brand", "janfolio-brand-board.png");
  const metadata = await sharp(source).metadata();
  const width = metadata.width ?? 1254;
  const height = metadata.height ?? 1254;
  const cropped = await sharp(source)
    .extract({
      left: Math.round(width * 0.045),
      top: Math.round(height * 0.19),
      width: Math.round(width * 0.91),
      height: Math.round(height * 0.35)
    })
    .png()
    .toBuffer();
  return sharp(cropped)
    .trim({ background: "#ffffff" })
    .resize({ width: 680 })
    .png()
    .toBuffer();
}

function tilePath(tile: Tile, config: ResolvedConfig): string {
  let filename: string;
  if (tile.endsWith("m")) filename = `man${tile[0]}${IMAGE_SUFFIX}`;
  else if (tile.endsWith("p")) filename = `pin${tile[0]}${IMAGE_SUFFIX}`;
  else if (tile.endsWith("s")) filename = `sou${tile[0]}${IMAGE_SUFFIX}`;
  else filename = `ji${HONOR_IMAGE_NUMBERS.get(tile) ?? 1}${IMAGE_SUFFIX}`;
  return resolve(config.webPublicDir, "tiles", filename);
}

function frameSvg(problem: ShortsProblem, phase: Phase, countdown: number | undefined, showQr: boolean, config: ResolvedConfig): string {
  const { width, height } = config.video;
  const fontUrl = pathToFileURL(resolve(config.webPublicDir, "fonts", "NotoSansJP-VF.ttf")).href;
  const typeLabel = problem.type === "nani-kiru" ? "毎日何切る" : "毎日何待ち";
  const header = `
    <rect x="70" y="420" width="300" height="82" rx="41" fill="url(#accentGradient)"/>
    <text x="220" y="474" text-anchor="middle" class="pill">${xmlEscape(typeLabel)}</text>
    <text x="1010" y="318" text-anchor="end" class="sequence">#${String(problem.sequence).padStart(3, "0")}</text>
    <line x1="825" y1="345" x2="1010" y2="345" stroke="#2f75cf" stroke-width="2" opacity="0.75"/>
    <text x="1010" y="397" text-anchor="end" class="series">${xmlEscape(typeLabel)}</text>`;
  const content = phase === "brand"
    ? brandContent(problem, config)
    : phase === "intro"
      ? questionContent(problem, "今日の問題", undefined)
      : phase === "question"
        ? questionContent(problem, problem.type === "nani-kiru" ? "この手牌、何を切る？" : "この清一色、何待ち？", countdown)
        : phase === "reveal"
          ? questionContent(problem, "正解は……", undefined, true)
          : phase === "answer"
            ? answerContent(problem)
            : ctaContent(problem, showQr, config);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <style>
        @font-face { font-family: 'Mahjong Noto Sans JP'; src: url('${fontUrl}'); }
        text { font-family: 'Mahjong Noto Sans JP', 'Noto Sans JP', sans-serif; fill: #061a3b; }
        .pill { fill: #fff; font-size: 35px; font-weight: 850; }
        .sequence { fill: #08366c; font-size: 36px; font-weight: 650; letter-spacing: 2px; }
        .series { fill: #08366c; font-size: 32px; font-weight: 700; }
        .hero { font-size: 76px; font-weight: 950; letter-spacing: -2px; }
        .title { font-size: 62px; font-weight: 900; }
        .subtitle { fill: #2d5271; font-size: 36px; font-weight: 650; }
        .large { font-size: 102px; font-weight: 950; }
        .counter { font-size: 112px; font-weight: 950; }
        .label { fill: #4f8ed9; font-size: 28px; font-weight: 700; letter-spacing: 8px; }
        .metric { font-size: 44px; font-weight: 850; }
        .footerEn { fill: #418fe4; font-size: 25px; font-weight: 520; letter-spacing: 8px; }
        .footerJa { fill: #234d70; font-size: 29px; font-weight: 650; letter-spacing: 2px; }
      </style>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="22" flood-color="#4f87b5" flood-opacity="0.13"/></filter>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="11" flood-color="#376a9a" flood-opacity="0.13"/></filter>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.52" stop-color="#fbfdff"/><stop offset="1" stop-color="#f0faff"/></linearGradient>
      <linearGradient id="accentGradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1858f4"/><stop offset="1" stop-color="#20c8e7"/></linearGradient>
      <linearGradient id="orangeGradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff9e21"/><stop offset="1" stop-color="#ff5f20"/></linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    ${backgroundPattern()}
    ${header}
    ${content}
    <text x="66" y="1650" class="footerEn">LEARN</text>
    <text x="66" y="1700" class="footerEn">PRACTICE</text>
    <text x="66" y="1750" class="footerEn">GET STRONGER</text>
    <line x1="66" y1="1792" x2="170" y2="1792" stroke="#3e91e9" stroke-width="2"/>
    <text x="1010" y="1760" text-anchor="end" class="footerJa">${xmlEscape(config.brand.tagline)}</text>
  </svg>`;
}

function backgroundPattern(): string {
  const dots = Array.from({ length: 12 }, (_, index) => {
    const x = 955 + (index % 3) * 28;
    const y = 1370 + Math.floor(index / 3) * 28;
    return `<circle cx="${x}" cy="${y}" r="4" fill="#53b6f3" opacity="0.62"/>`;
  }).join("");
  return `
    <path d="M-160 1590 L980 330 L1160 500 L20 1770 Z" fill="#eaf7ff" opacity="0.62"/>
    <path d="M310 -80 L500 -80 L-90 640 L-90 430 Z" fill="#f1f9ff" opacity="0.9"/>
    <circle cx="965" cy="-35" r="225" fill="#d9f3ff" opacity="0.68"/>
    <circle cx="70" cy="1350" r="180" fill="#dff5ff" opacity="0.72"/>
    <circle cx="45" cy="1540" r="250" fill="#e8f7ff" opacity="0.72"/>
    <circle cx="950" cy="1785" r="260" fill="#dff4ff" opacity="0.72"/>
    <g>${dots}</g>`;
}

function brandContent(problem: ShortsProblem, config: ResolvedConfig): string {
  const main = problem.type === "nani-kiru" ? "何切る" : "何待ち";
  const label = problem.type === "nani-kiru" ? "今日の一打を考えよう" : "この清一色、見抜ける？";
  return `
    <text x="540" y="700" text-anchor="middle" class="hero">今日の<tspan fill="url(#accentGradient)">${xmlEscape(main)}</tspan></text>
    <text x="540" y="785" text-anchor="middle" class="subtitle">${xmlEscape(label)}</text>
    <line x1="470" y1="835" x2="610" y2="835" stroke="#3294ed" stroke-width="3"/>
    <rect x="150" y="915" width="780" height="285" rx="46" fill="#fff" filter="url(#shadow)"/>
    <text x="540" y="1010" text-anchor="middle" class="label">${xmlEscape(config.brand.englishName)} SHORTS</text>
    <text x="540" y="1100" text-anchor="middle" class="title">1日1問、牌理を磨く。</text>
    <text x="540" y="1160" text-anchor="middle" class="subtitle" style="font-size:28px">${xmlEscape(problem.date)}</text>`;
}

function questionContent(problem: ShortsProblem, title: string, countdown: number | undefined, reveal = false): string {
  const finalSeconds = countdown != null && countdown <= 3;
  const radius = 150;
  const circumference = Math.round(2 * Math.PI * radius);
  const progress = countdown == null ? 0 : countdown / 8;
  const dash = Math.round(circumference * progress);
  const counter = countdown == null ? "" : `
    <circle cx="540" cy="1240" r="${radius}" fill="#fff" filter="url(#softShadow)"/>
    <circle cx="540" cy="1240" r="${radius}" fill="none" stroke="#dfedf6" stroke-width="${finalSeconds ? 30 : 24}"/>
    <circle cx="540" cy="1240" r="${radius}" fill="none" stroke="url(#accentGradient)" stroke-width="${finalSeconds ? 30 : 24}" stroke-linecap="round" stroke-dasharray="${dash} ${circumference}" transform="rotate(-90 540 1240)"/>
    <text x="540" y="1280" text-anchor="middle" class="counter">${countdown}</text>`;
  const hero = reveal
    ? `<text x="540" y="690" text-anchor="middle" class="large" fill="url(#accentGradient)">${xmlEscape(title)}</text>`
    : title === "今日の問題"
      ? `<text x="540" y="675" text-anchor="middle" class="hero">今日の<tspan fill="url(#accentGradient)">問題</tspan></text>`
      : problem.type === "nani-kiru"
        ? `<text x="540" y="675" text-anchor="middle" class="hero">この手牌、<tspan fill="url(#accentGradient)">何を切る？</tspan></text>`
        : `<text x="540" y="675" text-anchor="middle" class="hero">この清一色、<tspan fill="url(#accentGradient)">何待ち？</tspan></text>`;
  return `
    ${hero}
    <text x="540" y="755" text-anchor="middle" class="subtitle">${problem.type === "nani-kiru" ? "14枚から最善の1枚を選ぼう" : "待ち牌をすべて見つけよう"}</text>
    <rect x="34" y="820" width="1012" height="190" rx="34" fill="#fff" filter="url(#softShadow)"/>
    ${counter}
    ${reveal ? `<line x1="430" y1="1190" x2="650" y2="1190" stroke="url(#accentGradient)" stroke-width="7" stroke-linecap="round"/>` : ""}`;
}

function answerContent(problem: ShortsProblem): string {
  const answerLabel = problem.type === "nani-kiru" ? problem.answerDisplay : `${problem.answerDisplay}待ち`;
  const lines = wrapJapanese(problem.explanation, 25);
  const explanation = lines.map((line, index) => `<text x="540" y="${1235 + index * 52}" text-anchor="middle" class="metric" style="font-size:39px">${xmlEscape(line)}</text>`).join("");
  return `
    <text x="540" y="585" text-anchor="middle" class="label">問題の手牌</text>
    <rect x="34" y="615" width="1012" height="165" rx="32" fill="#fff" filter="url(#softShadow)"/>
    <text x="540" y="900" text-anchor="middle" class="title">正解　<tspan fill="url(#accentGradient)">${xmlEscape(answerLabel)}</tspan></text>
    <rect x="100" y="930" width="880" height="245" rx="38" fill="#fff" filter="url(#softShadow)"/>
    ${explanation}
    ${problem.type === "nani-kiru" ? `<text x="540" y="1450" text-anchor="middle" class="label">受け入れ牌</text><rect x="34" y="1470" width="1012" height="155" rx="32" fill="#fff" filter="url(#softShadow)"/>` : ""}`;
}

function ctaContent(problem: ShortsProblem, showQr: boolean, config: ResolvedConfig): string {
  const headline = problem.type === "nani-kiru" ? "もっと牌理を試したい？" : "もっと難しい待ちに挑戦";
  const tool = problem.type === "nani-kiru" ? "雀フォリオ 牌理チェッカー" : "雀フォリオ 清一色トレーニング";
  const textX = showQr ? 725 : 540;
  const headlineText = problem.type === "nani-kiru"
    ? `もっと牌理を<tspan fill="url(#accentGradient)">試したい？</tspan>`
    : `もっと難しい待ちに<tspan fill="url(#accentGradient)">挑戦</tspan>`;
  return `
    <text x="540" y="655" text-anchor="middle" class="hero" aria-label="${xmlEscape(headline)}">${headlineText}</text>
    <text x="540" y="745" text-anchor="middle" class="title" style="fill:#315675">続きは<tspan fill="url(#accentGradient)">雀フォリオ</tspan>で</text>
    <line x1="485" y1="790" x2="595" y2="790" stroke="#3d98ef" stroke-width="3"/>
    <rect x="40" y="830" width="1000" height="680" rx="48" fill="#fff" filter="url(#shadow)"/>
    <text x="540" y="915" text-anchor="middle" class="label">WEB TOOL</text>
    <rect x="76" y="945" width="928" height="120" rx="28" fill="#e9f6ff"/>
    <text x="540" y="1025" text-anchor="middle" class="metric">${xmlEscape(tool)}</text>
    ${showQr ? `<text x="230" y="1135" text-anchor="middle" class="subtitle" style="font-size:27px">＼ QRから直接 ／</text><rect x="85" y="1145" width="290" height="290" rx="30" fill="#fff" filter="url(#softShadow)"/><line x1="425" y1="1120" x2="425" y2="1445" stroke="#d5eafa" stroke-width="2"/>` : ""}
    <text x="${textX}" y="1160" text-anchor="middle" class="subtitle" style="font-size:28px">＼ プロフィールを開く ／</text>
    <rect x="${showQr ? 485 : 290}" y="1215" width="${showQr ? 470 : 500}" height="132" rx="66" fill="url(#orangeGradient)" filter="url(#softShadow)"/>
    <text x="${textX}" y="1303" text-anchor="middle" class="metric" style="fill:#fff;font-size:40px">先頭リンクから挑戦</text>
    <text x="${textX}" y="1400" text-anchor="middle" class="subtitle" style="font-size:25px">見つからない時は</text>
    <text x="${textX}" y="1440" text-anchor="middle" class="subtitle" style="font-size:27px;font-weight:800">「雀フォリオ」で検索</text>`;
}

function wrapJapanese(value: string, maxLength: number): string[] {
  const lines: string[] = [];
  let remaining = value;
  while (remaining.length > maxLength) {
    const window = remaining.slice(0, maxLength + 1);
    const punctuation = [...window.matchAll(/[。！、]/g)].map((match) => match.index ?? -1).filter((index) => index >= Math.floor(maxLength * 0.55));
    const splitAt = punctuation.length > 0 ? punctuation[punctuation.length - 1]! + 1 : maxLength;
    lines.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt);
  }
  if (remaining) lines.push(remaining);
  return lines.slice(0, 4);
}

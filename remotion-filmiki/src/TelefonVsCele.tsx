// „PHONE vs GOALS” – minutowa animacja motywacyjna w stylu vintage-plakatu (jak wzór @mondayschallenge).
// Pionowo 1080×1920 (TikTok / Shorts / Reels), 12 fps, 60 s = 12 scen po 5 s.
// Każda scena ma rytm ze wzoru:
//   spokój 2 s (przedmiot na środku + mały podpis)  →  UDERZENIE 2,75 s (wielki tytuł, rzeczy wybuchają, wszystko drży)
//   →  zassanie 0,25 s do środka  →  następna scena.
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { boil, Bolt, C, Coin, Grain, Hourglass, PixelTile, SANS, Sparkle, Stopwatch, Title } from "./vintage";
import { FONT } from "./theme";

export type TelefonVsCeleProps = { handle: string; theme: string };

export const SCENE_SEC = 5;
const W = 1080;
const CX = 540;
const CY = 1080; // środek przedmiotu
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Center = "phone" | "clock" | "notebook" | "phoneOff" | "notebookCheck" | "blocks3" | "blocksFall" | "blocks6" | "calendar" | "chart" | "trophy" | "flag";
type BurstSet = "social" | "time" | "question" | "zzz" | "check" | "build" | "fail" | "up" | "win";

// ------------------------------------------------ scenariusz (12 × 5 s)
export const SCENES: { cap: string; title: string; sub: string; center: Center; burst: BurstSet }[] = [
  { cap: "11:47 PM...", title: "SCROLL.", sub: "5 HOURS A DAY", center: "phone", burst: "social" },
  { cap: "every. single. day.", title: "TIME FLIES", sub: "1,825 HOURS A YEAR", center: "clock", burst: "time" },
  { cap: "meanwhile...", title: "YOUR GOALS?", sub: "STILL WAITING", center: "notebook", burst: "question" },
  { cap: "so today...", title: "PUT IT DOWN", sub: "JUST ONE HOUR", center: "phoneOff", burst: "zzz" },
  { cap: "one small step", title: "START.", sub: "SMALL IS OK", center: "notebookCheck", burst: "check" },
  { cap: "block by block", title: "BUILD.", sub: "SOMETHING YOURS", center: "blocks3", burst: "build" },
  { cap: "oops...", title: "FAIL.", sub: "TRY AGAIN", center: "blocksFall", burst: "fail" },
  { cap: "one more time", title: "AGAIN.", sub: "AND AGAIN", center: "blocks6", burst: "build" },
  { cap: "day after day", title: "DAY 100", sub: "DON'T BREAK THE CHAIN", center: "calendar", burst: "check" },
  { cap: "slowly... then fast", title: "LEVEL UP", sub: "1% BETTER DAILY", center: "chart", burst: "up" },
  { cap: "look back now", title: "YOU WIN.", sub: "WHILE THEY SCROLL", center: "trophy", burst: "win" },
  { cap: "remember:", title: "PHONE DOWN", sub: "GOALS UP", center: "flag", burst: "win" },
];

const phaseOf = (t: number) => {
  if (t < 2) return { name: "calm" as const, t };
  if (t < 4.75) return { name: "smash" as const, t: t - 2 };
  return { name: "implode" as const, t: t - 4.75 };
};

// ------------------------------------------------ ramka (pionowa wersja nagłówka i stopki ze wzoru)
const Frame: React.FC<{ handle: string; issue: string; theme: string }> = ({ handle, issue, theme }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 110, width: 330, height: 76, background: C.orangeLight }} />
    <div style={{ position: "absolute", left: 56, top: 110, height: 76, display: "flex", alignItems: "center", fontFamily: SANS, fontSize: 32, color: C.ink }}>{handle}</div>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: "absolute", left: 350 + i * 44, top: 110, width: 28, height: 76, background: C.orangeLight, transform: "skewX(-25deg)" }} />
    ))}
    <div style={{ position: "absolute", left: 520, right: 170, top: 144, height: 9, background: C.orangeLight }} />
    <div style={{ position: "absolute", right: 56, top: 110, height: 76, display: "flex", alignItems: "center", fontFamily: SANS, fontSize: 32, color: C.ink }}>{issue}</div>
    <div style={{ position: "absolute", left: 56, top: 1600, fontFamily: SANS, fontSize: 32, color: C.ink }}>Theme of the week</div>
    <div style={{ position: "absolute", left: 360, right: 290, top: 1617, height: 9, background: C.orangeLight }} />
    <div style={{ position: "absolute", right: 56, top: 1600, fontFamily: SANS, fontSize: 32, color: C.ink }}>{theme}</div>
  </>
);

const Sunburst: React.FC<{ rotate: number; scale: number }> = ({ rotate, scale }) => (
  <div style={{ position: "absolute", left: 56, top: 600, width: 968, height: 940, overflow: "hidden", transform: `scale(${scale})` }}>
    <div style={{ position: "absolute", left: 484 - 1100, top: 480 - 1100, width: 2200, height: 2200, background: `repeating-conic-gradient(${C.orange} 0 11.25deg, ${C.orangeLight} 11.25deg 22.5deg)`, transform: `rotate(${rotate}deg)` }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${C.orangeDeep} 1.6px, transparent 2px)`, backgroundSize: "9px 9px", opacity: 0.35 }} />
  </div>
);

const GridBack: React.FC = () => (
  <svg width={760} height={560} viewBox="0 0 380 280" style={{ transform: "rotate(-12deg)" }}>
    {[...new Array(10)].map((_, i) => <line key={`v${i}`} x1={i * 40 + 10} y1="0" x2={i * 40 + 10} y2="280" stroke="#FFF6E4" strokeWidth="3" />)}
    {[...new Array(7)].map((_, i) => <line key={`h${i}`} x1="0" y1={i * 40 + 10} x2="380" y2={i * 40 + 10} stroke="#FFF6E4" strokeWidth="3" />)}
  </svg>
);

// ------------------------------------------------ małe obiekty do wybuchu (nowe, w tej samej palecie)
const Glyph: React.FC<{ ch: string; size: number; fill: string }> = ({ ch, size, fill }) => (
  <div style={{ fontFamily: FONT, fontSize: size, color: fill, lineHeight: 1, textShadow: `-6px 8px 0 ${C.ink}` }}>{ch}</div>
);
const Heart: React.FC = () => (
  <svg width="140" height="130" viewBox="0 0 100 92">
    <path d="M50 88 L10 46 A22 22 0 0 1 50 16 A22 22 0 0 1 90 46 Z" fill={C.ink} transform="translate(6,4)" />
    <path d="M50 88 L10 46 A22 22 0 0 1 50 16 A22 22 0 0 1 90 46 Z" fill={C.orange} />
  </svg>
);
const Bell: React.FC = () => (
  <svg width="130" height="140" viewBox="0 0 100 108">
    <path d="M20 78 Q24 22 50 18 Q76 22 80 78 Z" fill={C.ink} transform="translate(6,5)" />
    <path d="M20 78 Q24 22 50 18 Q76 22 80 78 Z" fill={C.sand} />
    <rect x="12" y="76" width="76" height="10" fill={C.orange} />
    <circle cx="50" cy="96" r="9" fill={C.orange} />
    <circle cx="80" cy="22" r="14" fill={C.orange} />
  </svg>
);
const Check: React.FC = () => (
  <svg width="140" height="120" viewBox="0 0 100 86">
    <polyline points="10,46 38,74 92,14" fill="none" stroke={C.ink} strokeWidth="18" transform="translate(6,6)" />
    <polyline points="10,46 38,74 92,14" fill="none" stroke="#FFF6E4" strokeWidth="18" />
  </svg>
);
const XMark: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={130 * s} height={130 * s} viewBox="0 0 100 100">
    <g transform="translate(7,7)" stroke={C.ink} strokeWidth="20"><line x1="12" y1="12" x2="84" y2="84" /><line x1="84" y1="12" x2="12" y2="84" /></g>
    <g stroke={C.orange} strokeWidth="20"><line x1="12" y1="12" x2="84" y2="84" /><line x1="84" y1="12" x2="12" y2="84" /></g>
  </svg>
);
const Brick: React.FC<{ color?: string }> = ({ color = C.orangeLight }) => (
  <svg width="130" height="100" viewBox="0 0 100 76">
    <rect x="8" y="16" width="88" height="58" fill={C.ink} />
    <rect x="2" y="10" width="88" height="58" fill={color} />
    <rect x="14" y="2" width="22" height="10" fill={color} />
    <rect x="56" y="2" width="22" height="10" fill={color} />
    <rect x="2" y="54" width="88" height="6" fill={C.orangeDeep} opacity={0.5} />
  </svg>
);
const ArrowUp: React.FC = () => (
  <svg width="120" height="160" viewBox="0 0 80 106">
    <g transform="translate(6,6)" fill={C.ink}><rect x="26" y="40" width="28" height="60" /><polygon points="0,44 40,0 80,44" /></g>
    <rect x="26" y="40" width="28" height="60" fill={C.sand} />
    <polygon points="0,44 40,0 80,44" fill={C.sand} />
  </svg>
);
const Star: React.FC = () => (
  <svg width="140" height="140" viewBox="0 0 100 100">
    <polygon points="50,4 62,36 96,38 69,59 79,93 50,74 21,93 31,59 4,38 38,36" fill={C.ink} transform="translate(6,6)" />
    <polygon points="50,4 62,36 96,38 69,59 79,93 50,74 21,93 31,59 4,38 38,36" fill={C.sand} />
  </svg>
);

type BurstItem = { key: string; x: number; y: number; rot: number; s: number; front?: boolean; el: React.ReactNode };
// pozycje wokół środka (te same miejsca w każdej scenie – jak we wzorze, zmieniają się tylko przedmioty)
const SLOTS = [
  { x: -360, y: -330, rot: -14 },
  { x: 350, y: -360, rot: 12 },
  { x: -400, y: 40, rot: 8, front: true },
  { x: 400, y: 0, rot: -10, front: true },
  { x: -320, y: 360, rot: 14, front: true },
  { x: 330, y: 340, rot: -16, front: true },
  { x: 0, y: -390, rot: 4 },
  { x: 150, y: 430, rot: -6 },
];
const SETS: Record<BurstSet, React.ReactNode[]> = {
  social: [<Heart key="a" />, <Bell key="b" />, <PixelTile key="c" />, <Heart key="d" />, <Bell key="e" />, <PixelTile key="f" />, <Heart key="g" />, <Glyph key="h" ch="99+" size={90} fill={C.cream} />],
  time: [<Stopwatch key="a" />, <Hourglass key="b" />, <Hourglass key="c" />, <Stopwatch key="d" />, <Glyph key="e" ch="24H" size={100} fill={C.cream} />, <Hourglass key="f" />, <Glyph key="g" ch="365" size={90} fill={C.sand} />, <Coin key="h" />],
  question: [<Glyph key="a" ch="?" size={200} fill={C.cream} />, <Glyph key="b" ch="?" size={150} fill={C.sand} />, <Glyph key="c" ch="?" size={170} fill={C.sand} />, <Hourglass key="d" />, <Glyph key="e" ch="?" size={140} fill={C.cream} />, <Glyph key="f" ch="..." size={140} fill={C.cream} />, <Glyph key="g" ch="?" size={120} fill={C.cream} />, <Hourglass key="h" />],
  zzz: [<Glyph key="a" ch="Z" size={170} fill={C.cream} />, <Glyph key="b" ch="z" size={130} fill={C.sand} />, <Glyph key="c" ch="Z" size={150} fill={C.sand} />, <Glyph key="d" ch="z" size={120} fill={C.cream} />, <XMark key="e" />, <Glyph key="f" ch="OFF" size={100} fill={C.cream} />, <Glyph key="g" ch="z" size={110} fill={C.cream} />, <Bell key="h" />],
  check: [<Check key="a" />, <Star key="b" />, <Check key="c" />, <Check key="d" />, <Bolt key="e" />, <Check key="f" />, <Star key="g" />, <Bolt key="h" />],
  build: [<Brick key="a" />, <Brick key="b" color={C.sand} />, <Bolt key="c" />, <Brick key="d" color={C.cream} />, <Brick key="e" color={C.sand} />, <Bolt key="f" />, <Brick key="g" />, <PixelTile key="h" />],
  fail: [<XMark key="a" />, <Brick key="b" />, <XMark key="c" s={1.2} />, <Brick key="d" color={C.sand} />, <Brick key="e" color={C.cream} />, <XMark key="f" />, <Glyph key="g" ch="!" size={180} fill={C.cream} />, <Brick key="h" />],
  up: [<ArrowUp key="a" />, <Star key="b" />, <ArrowUp key="c" />, <Coin key="d" />, <ArrowUp key="e" />, <Bolt key="f" />, <Glyph key="g" ch="+1%" size={100} fill={C.cream} />, <Coin key="h" />],
  win: [<Star key="a" />, <Coin key="b" />, <Star key="c" />, <Bolt key="d" />, <Coin key="e" />, <Star key="f" />, <Sparkle key="g" size={130} />, <Coin key="h" />],
};

const renderBurst = (set: BurstSet, burst: number, frame: number, front: boolean) =>
  SLOTS.map((o, i) => ({ ...o, el: SETS[set][i], key: `${set}${i}`, s: 1.15 }) as BurstItem)
    .filter((o) => Boolean(o.front) === front)
    .map((o) => {
      const j = boil(o.key, frame, 4);
      const s = burst * o.s;
      if (s <= 0.01) return null;
      return (
        <div key={o.key} style={{ position: "absolute", left: CX + o.x * burst + j.x, top: CY + o.y * burst + j.y, transform: `translate(-50%, -50%) rotate(${o.rot + j.r * 2}deg) scale(${s})` }}>
          {o.el}
        </div>
      );
    });

// ------------------------------------------------ PRZEDMIOTY NA ŚRODKU (viewBox 260×260, kremowy przód, czarny bok)
const ext = (d = 8) => `translate(${d},${d})`;

const PhoneShape: React.FC<{ screen: React.ReactNode; dark?: boolean }> = ({ screen, dark }) => (
  <g>
    <rect x="72" y="20" width="116" height="224" rx="18" fill={C.ink} transform={ext(12)} />
    <rect x="72" y="20" width="116" height="224" rx="18" fill={C.cream} />
    <rect x="82" y="40" width="96" height="176" rx="6" fill={dark ? C.ink : "#FFF6E4"} stroke={C.ink} strokeWidth="4" />
    <rect x="114" y="28" width="32" height="6" rx="3" fill={C.ink} />
    <circle cx="130" cy="230" r="6" fill={C.ink} />
    <svg x="82" y="40" width="96" height="176" viewBox="0 0 96 176">{screen}</svg>
  </g>
);

const Feed: React.FC<{ t: number }> = ({ t }) => {
  const off = (t * 160) % 60;
  return (
    <g>
      {[...new Array(5)].map((_, i) => (
        <g key={i} transform={`translate(0, ${i * 60 - off})`}>
          <rect x="8" y="6" width="80" height="34" fill={i % 2 ? C.orangeLight : C.sand} />
          <circle cx="16" cy="48" r="5" fill={C.ink} />
          <rect x="26" y="45" width="40" height="6" fill={C.ink} />
          <path d="M78 52 l-6 -6 a4 4 0 0 1 6 -4 a4 4 0 0 1 6 4 z" fill={C.orange} />
        </g>
      ))}
    </g>
  );
};

const Notebook: React.FC<{ checks: number; draw: number; q?: boolean }> = ({ checks, draw, q }) => (
  <g>
    <rect x="44" y="30" width="172" height="210" fill={C.ink} transform={ext(12)} />
    <rect x="44" y="30" width="172" height="210" fill="#FFF6E4" />
    <rect x="44" y="30" width="22" height="210" fill={C.orangeLight} />
    <text x="80" y="66" fontFamily={FONT} fontSize="24" fill={C.ink}>MY GOALS</text>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x="80" y={92 + i * 46} width="26" height="26" fill="none" stroke={C.ink} strokeWidth="5" />
        <rect x="118" y={102 + i * 46} width={[78, 60, 70][i]} height="7" fill={C.ink} opacity={0.75} />
        {i < checks || (i === checks && draw > 0) ? (
          <polyline points={`${80},${104 + i * 46} ${92},${118 + i * 46} ${116},${84 + i * 46}`} fill="none" stroke={C.orange} strokeWidth="8" pathLength={1} strokeDasharray={1} strokeDashoffset={i < checks ? 0 : 1 - draw} />
        ) : null}
      </g>
    ))}
    {q ? <text x="160" y="232" fontFamily={FONT} fontSize="70" fill={C.orange} textAnchor="middle">?</text> : null}
  </g>
);

const Block: React.FC<{ x: number; y: number; color: string; rot?: number }> = ({ x, y, color, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot} 32 24)`}>
    <rect x="0" y="0" width="64" height="44" fill={C.ink} transform={ext(7)} />
    <rect x="0" y="0" width="64" height="44" fill={color} />
    <rect x="9" y="-8" width="16" height="9" fill={color} />
    <rect x="39" y="-8" width="16" height="9" fill={color} />
  </g>
);
const BLOCK_COLORS = [C.orangeLight, C.sand, C.cream, C.orange, C.sand, C.orangeLight];

// spadające klocki: i-ty spada w chwili at[i] z odbiciem
const Stack: React.FC<{ n: number; t: number; at: number[]; fall?: number }> = ({ n, t, at, fall = 0 }) => (
  <g>
    <rect x="40" y="236" width="180" height="12" fill={C.ink} />
    {[...new Array(n)].map((_, i) => {
      const drop = interpolate(t, [at[i], at[i] + 0.2, at[i] + 0.28, at[i] + 0.34], [-150, 0, -10, 0], clamp);
      const col = i % 2;
      const row = Math.floor(i / 2);
      const bx = 66 + col * 66 - (row % 2) * 0;
      const by = 192 - row * 50 + drop;
      // przewracanie się wieży (scena „FAIL”)
      const fx = fall * (60 + row * 50) * (col ? 1 : 0.6);
      const fy = fall * row * 46;
      return <Block key={i} x={bx + fx} y={by + fy} color={BLOCK_COLORS[i]} rot={fall * (col ? 70 : -40)} />;
    })}
  </g>
);

const ClockFace: React.FC<{ t: number; fast: number }> = ({ t, fast }) => (
  <g>
    <circle cx="138" cy="138" r="104" fill={C.ink} />
    <circle cx="130" cy="130" r="104" fill={C.cream} />
    <circle cx="130" cy="130" r="86" fill="#FFF6E4" stroke={C.ink} strokeWidth="5" />
    {[...new Array(12)].map((_, i) => (
      <rect key={i} x="126" y="52" width="8" height="16" fill={C.ink} transform={`rotate(${i * 30} 130 130)`} />
    ))}
    <rect x="125" y="78" width="10" height="56" fill={C.ink} transform={`rotate(${t * 60 * fast} 130 130)`} />
    <rect x="126" y="62" width="8" height="72" fill={C.orange} transform={`rotate(${t * 720 * fast} 130 130)`} />
    <circle cx="130" cy="130" r="10" fill={C.ink} />
    <rect x="60" y="14" width="40" height="22" fill={C.orange} transform="rotate(-30 80 25)" />
    <rect x="160" y="14" width="40" height="22" fill={C.orange} transform="rotate(30 180 25)" />
  </g>
);

const Calendar: React.FC<{ filled: number; big: boolean }> = ({ filled, big }) => (
  <g>
    <rect x="28" y="40" width="204" height="196" fill={C.ink} transform={ext(12)} />
    <rect x="28" y="40" width="204" height="196" fill="#FFF6E4" />
    <rect x="28" y="40" width="204" height="40" fill={C.orange} />
    <rect x="60" y="28" width="12" height="28" fill={C.ink} />
    <rect x="188" y="28" width="12" height="28" fill={C.ink} />
    {[...new Array(20)].map((_, i) => {
      const x = 40 + (i % 5) * 38;
      const y = 92 + Math.floor(i / 5) * 35;
      return (
        <g key={i}>
          <rect x={x} y={y} width="32" height="28" fill="none" stroke={C.ink} strokeWidth="3" />
          {i < filled ? <polyline points={`${x + 5},${y + 14} ${x + 13},${y + 22} ${x + 28},${y + 4}`} fill="none" stroke={C.orange} strokeWidth="6" /> : null}
        </g>
      );
    })}
    {big ? <text x="130" y="72" fontFamily={FONT} fontSize="34" fill={C.cream} textAnchor="middle">STREAK 100</text> : null}
  </g>
);

const Chart: React.FC<{ g: number }> = ({ g }) => {
  const hs = [30, 46, 70, 104, 150, 200];
  return (
    <g>
      <rect x="24" y="236" width="212" height="10" fill={C.ink} />
      {hs.map((h, i) => {
        const hh = h * interpolate(g, [i * 0.12, i * 0.12 + 0.35], [0, 1], clamp);
        return (
          <g key={i}>
            <rect x={36 + i * 34} y={236 - hh} width="26" height={hh} fill={C.ink} transform={ext(6)} />
            <rect x={36 + i * 34} y={236 - hh} width="26" height={hh} fill={i === 5 ? C.orange : C.cream} />
          </g>
        );
      })}
      <polyline points="40,200 110,170 170,110 226,30" fill="none" stroke={C.ink} strokeWidth="10" strokeDasharray={1} pathLength={1} strokeDashoffset={1 - g} />
      {g > 0.95 ? <polygon points="206,30 236,18 230,52" fill={C.ink} /> : null}
    </g>
  );
};

const Trophy: React.FC = () => (
  <g>
    <g transform={ext(12)} fill={C.ink}>
      <path d="M70 40 H190 V90 Q190 150 130 160 Q70 150 70 90 Z" />
      <rect x="116" y="158" width="28" height="36" />
      <rect x="80" y="194" width="100" height="40" />
    </g>
    <path d="M70 60 Q30 60 34 92 Q40 122 78 120" fill="none" stroke={C.sand} strokeWidth="12" />
    <path d="M190 60 Q230 60 226 92 Q220 122 182 120" fill="none" stroke={C.sand} strokeWidth="12" />
    <path d="M70 40 H190 V90 Q190 150 130 160 Q70 150 70 90 Z" fill={C.sand} />
    <rect x="116" y="158" width="28" height="36" fill={C.sand} />
    <rect x="80" y="194" width="100" height="40" fill={C.cream} />
    <text x="130" y="224" fontFamily={FONT} fontSize="26" fill={C.ink} textAnchor="middle">#1</text>
    <polygon points="130,62 138,84 160,84 142,98 150,120 130,106 110,120 118,98 100,84 122,84" fill={C.orange} />
  </g>
);

const FlagTop: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Stack n={6} t={9} at={[0, 0, 0, 0, 0, 0]} />
    <rect x="127" y="-40" width="10" height="132" fill={C.ink} />
    <circle cx="132" cy="-42" r="9" fill={C.sand} />
    <path d={`M137 -36 Q170 ${-46 + Math.sin(t * 8) * 8} 214 -32 L214 14 Q170 ${4 + Math.sin(t * 8) * 8} 137 10 Z`} fill={C.ink} transform="translate(6,6)" />
    <path d={`M137 -36 Q170 ${-46 + Math.sin(t * 8) * 8} 214 -32 L214 14 Q170 ${4 + Math.sin(t * 8) * 8} 137 10 Z`} fill={C.cream} />
    <polygon points="166,-26 170,-14 182,-14 172,-6 176,6 166,-2 156,6 160,-6 150,-14 162,-14" fill={C.orange} />
    {/* telefon leży ekranem w dół obok wieży */}
    <g transform="translate(176,214) rotate(-8)">
      <rect x="0" y="0" width="70" height="24" rx="6" fill={C.ink} />
      <rect x="-4" y="-6" width="70" height="24" rx="6" fill={C.cream} />
    </g>
  </g>
);

const CenterObject: React.FC<{ kind: Center; ph: ReturnType<typeof phaseOf>; t: number }> = ({ kind, ph, t }) => {
  const smash = ph.name !== "calm";
  let el: React.ReactNode = null;
  switch (kind) {
    case "phone":
      el = <PhoneShape screen={smash ? <path d="M48 120 L18 88 A16 16 0 0 1 48 66 A16 16 0 0 1 78 88 Z" fill={C.orange} /> : <Feed t={t} />} />;
      break;
    case "clock":
      el = <ClockFace t={t} fast={smash ? 4 : 1.2} />;
      break;
    case "notebook":
      el = <Notebook checks={0} draw={0} q={smash} />;
      break;
    case "phoneOff": {
      const off = !smash && t < 1.1;
      el = <PhoneShape dark={!off} screen={off ? <Feed t={t} /> : <text x="48" y="100" fontFamily={FONT} fontSize="40" fill={C.cream} textAnchor="middle">zzz</text>} />;
      break;
    }
    case "notebookCheck":
      el = <Notebook checks={smash ? 1 : 0} draw={interpolate(t, [0.8, 1.3], [0, 1], clamp)} />;
      break;
    case "blocks3":
      el = <Stack n={3} t={smash ? 9 : t} at={[0.2, 0.7, 1.2]} />;
      break;
    case "blocksFall":
      el = (
        <g>
          <Stack n={4} t={9} at={[0, 0, 0, 0]} fall={smash ? 1 : interpolate(t, [1.0, 1.6], [0, 1], clamp)} />
          {smash ? <g transform="translate(80,40) scale(1)"><line x1="10" y1="10" x2="90" y2="90" stroke={C.ink} strokeWidth="20" /><line x1="90" y1="10" x2="10" y2="90" stroke={C.ink} strokeWidth="20" /></g> : null}
        </g>
      );
      break;
    case "blocks6":
      el = <Stack n={6} t={smash ? 9 : t} at={[0.1, 0.35, 0.6, 0.85, 1.1, 1.35]} />;
      break;
    case "calendar":
      el = <Calendar filled={smash ? 20 : Math.floor(interpolate(t, [0.2, 1.8], [0, 20], clamp))} big={smash} />;
      break;
    case "chart":
      el = <Chart g={smash ? 1 : interpolate(t, [0.1, 1.8], [0, 1], clamp)} />;
      break;
    case "trophy":
      el = <Trophy />;
      break;
    case "flag":
      el = <FlagTop t={t} />;
      break;
  }
  return (
    <svg width="680" height="680" viewBox="-10 -30 280 290" style={{ overflow: "visible" }}>
      {el}
    </svg>
  );
};

// ------------------------------------------------ dźwięki (pliki z dzwieki/generuj_dzwieki_telefon.py)
// efekty w każdej scenie: [plik, sekunda sceny, głośność]
const COMMON_SFX: [string, number, number][] = [
  ["narastanie.wav", 1.4, 0.45],
  ["uderzenie.wav", 2.0, 0.55],
  ["pyki.wav", 2.05, 0.55],
  ["zassanie.wav", 4.4, 0.6],
];
const SCENE_SFX: Record<Center, [string, number, number][]> = {
  phone: [["powiadomienie.wav", 0.3, 0.6], ["powiadomienie.wav", 1.0, 0.5]],
  clock: [["tykanie.wav", 0.0, 0.7]],
  notebook: [["dzwonek.wav", 0.4, 0.3]],
  phoneOff: [["wylacz.wav", 1.1, 0.7]],
  notebookCheck: [["pisanie.wav", 0.8, 0.7]],
  blocks3: [["klocek.wav", 0.4, 0.7], ["klocek.wav", 0.9, 0.7], ["klocek.wav", 1.4, 0.7]],
  blocksFall: [["porazka.wav", 1.0, 0.7]],
  blocks6: [0.3, 0.55, 0.8, 1.05, 1.3, 1.55].map((s) => ["klocek.wav", s, 0.6] as [string, number, number]),
  calendar: [0.3, 0.6, 0.9, 1.2, 1.5].map((s) => ["klik.wav", s, 0.45] as [string, number, number]),
  chart: [["narastanie.wav", 0.4, 0.3]],
  trophy: [["dzwonek.wav", 0.3, 0.5]],
  flag: [["dzwonek.wav", 0.3, 0.5]],
};

const Dzwieki: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Audio src={staticFile("dzwieki/telefon_muzyka.wav")} volume={0.7} />
      {SCENES.flatMap((sc, i) =>
        [...SCENE_SFX[sc.center], ...COMMON_SFX].map(([file, at, volume], k) => (
          <Audio key={`${i}-${k}`} from={Math.round((i * SCENE_SEC + at) * fps)} src={staticFile(`dzwieki/${file}`)} volume={volume} />
        )),
      )}
      <Audio from={Math.round((11 * SCENE_SEC + 2) * fps)} src={staticFile("dzwieki/final.wav")} volume={0.6} />
    </>
  );
};

// rozmiar tytułu tak, żeby zmieścił się w jednej linii
const fit = (text: string, max: number, width = 980) => Math.min(max, Math.floor(width / (text.length * 0.56)));

// ------------------------------------------------ cała animacja
export const TelefonVsCele: React.FC<TelefonVsCeleProps> = ({ handle, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const idx = Math.min(SCENES.length - 1, Math.floor(sec / SCENE_SEC));
  const sc = SCENES[idx];
  const t = sec - idx * SCENE_SEC;
  const last = idx === SCENES.length - 1;
  // ostatnia scena nie zasysa się – kończy się na tytule
  const ph = last && t >= 4.75 ? { name: "smash" as const, t: t - 2 } : phaseOf(t);

  let objScale = 1;
  let objRot = 0;
  let objY = 0;
  let sunRot = 0;
  let titleScale = 0;
  let burst = 0;
  if (ph.name === "calm") {
    objScale = interpolate(ph.t, [0, 0.25, 0.4], [0.6, 1.08, 1], clamp);
    objRot = interpolate(ph.t, [0, 0.25], [-14, 0], clamp);
  } else if (ph.name === "smash") {
    titleScale = interpolate(ph.t, [0, 0.08, 0.17, 0.25], [0.55, 1.12, 0.97, 1], clamp);
    burst = interpolate(ph.t, [0, 0.17, 0.25], [0, 1.1, 1], clamp);
    objScale = interpolate(ph.t, [0, 0.17, 0.25], [1, 1.22, 1.14], clamp) + Math.sin(ph.t * 6) * 0.02;
    objRot = -8 + Math.sin(ph.t * 3) * 1.5;
    objY = 40;
  } else {
    const k = ph.t / 0.25;
    titleScale = 1 - k;
    burst = 1 - k;
    objScale = 1.14 * (1 - k * 0.9);
    objRot = -8 - 40 * k;
    objY = 40 * (1 - k);
    sunRot = 25 * k;
  }
  const b = boil(`m${idx}`, frame, ph.name === "smash" ? 3 : 1.5);
  // podpis w spokoju – pisany literka po literce
  const capChars = Math.floor(interpolate(t, [0.15, 1.0], [0, sc.cap.length], clamp));
  const sparkle = ph.name === "calm" ? interpolate(ph.t, [1.5, 1.65, 1.9], [0, 1, 0], clamp) : 0;
  // na końcu filmu: zaproszenie do obserwowania
  const outro = last ? interpolate(t, [3.2, 3.5], [0, 1], clamp) : 0;

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Sunburst rotate={sunRot + idx * 5.6} scale={ph.name === "smash" ? 1.01 : 1} />
      <Frame handle={handle} issue={`#${String(idx + 1).padStart(2, "0")}/12`} theme={theme} />

      {burst > 0.05 ? (
        <div style={{ position: "absolute", left: CX + 20, top: CY + 20, transform: `translate(-50%, -50%) scale(${burst})`, opacity: 0.9 }}>
          <GridBack />
        </div>
      ) : null}
      {renderBurst(sc.burst, burst, frame, false)}

      <div style={{ position: "absolute", left: CX + b.x, top: CY + objY + b.y, transform: `translate(-50%, -50%) rotate(${objRot + b.r}deg) scale(${objScale})` }}>
        <CenterObject kind={sc.center} ph={ph} t={t} />
      </div>

      {renderBurst(sc.burst, burst, frame, true)}

      {sparkle > 0 ? (
        <div style={{ position: "absolute", left: CX + 250, top: CY - 300, transform: `translate(-50%, -50%) scale(${sparkle}) rotate(${sparkle * 45}deg)` }}>
          <Sparkle size={120} />
        </div>
      ) : null}

      {/* mały podpis w spokoju */}
      {ph.name === "calm" ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 64, color: C.ink, letterSpacing: 1 }}>
          {sc.cap.slice(0, capChars)}
          <span style={{ opacity: frame % 6 < 3 ? 1 : 0 }}>_</span>
        </div>
      ) : null}

      {/* wielki tytuł przy uderzeniu */}
      {titleScale > 0.01 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 270, transform: `scale(${titleScale}) rotate(${-2 + b.r * 0.4}deg)`, transformOrigin: "50% 50%" }}>
          <Title text={sc.title} size={fit(sc.title, 190, 920)} fill={C.orange} />
          <div style={{ marginTop: 6 }}>
            <Title text={sc.sub} size={fit(sc.sub, 96, 1000)} fill={C.sand} />
          </div>
        </div>
      ) : null}

      {outro > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1680, textAlign: "center", transform: `scale(${outro})` }}>
          <Title text="FOLLOW FOR DAILY MOTIVATION" size={52} fill={C.orange} />
        </div>
      ) : null}

      <Grain id="grain-tvc" opacity={0.12} />
      <Dzwieki />
    </AbsoluteFill>
  );
};

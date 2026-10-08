// Animacja motywacyjna w stylu „vintage poster” (wzór: filmik @mondayschallenge #27).
// Tempo jak we wzorze: 12 fps (lekko „poklatkowe”), 15 s = 3 pętle po 5 s:
//   spokój (2 s, maszyna + kursor klika) → UDERZENIE (tytuł wjeżdża, rzeczy wybuchają, wszystko „drży”) 2,75 s
//   → szybkie zassanie do środka (0,25 s) → znowu spokój.
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "./theme";

export type MotywacjaProps = {
  handle: string;
  issue: string;
  theme: string;
  title: string;
  subtitle: string;
};

// Paleta ze wzoru: kremowy papier, palony pomarańcz, jasny pomarańcz, czerń, piaskowa żółć
const C = {
  paper: "#F8E2BC",
  orange: "#DD5A1E",
  orangeLight: "#EC8550",
  orangeDeep: "#B9431A",
  cream: "#FBE8C4",
  ink: "#1C1915",
  sand: "#F3D088",
};
const SANS = "'DejaVu Sans', Arial, Helvetica, sans-serif";

// ------------------------------------------------ faza animacji (w sekundach pętli 5 s)
const phaseOf = (sec: number) => {
  const tl = (sec + 1) % 5; // film zaczyna się w połowie spokoju, jak wzór
  if (tl < 2) return { name: "calm" as const, t: tl };
  if (tl < 4.75) return { name: "smash" as const, t: tl - 2 };
  return { name: "implode" as const, t: tl - 4.75 };
};

// drżenie ręcznie rysowanej animacji („boil”) – inne przy każdej klatce
const boil = (seed: string, frame: number, amp = 3) => ({
  x: (random(`${seed}x${frame}`) - 0.5) * amp * 2,
  y: (random(`${seed}y${frame}`) - 0.5) * amp * 2,
  r: (random(`${seed}r${frame}`) - 0.5) * amp,
});

// ------------------------------------------------ tekstura papieru i ziarno
const Grain: React.FC<{ id: string; opacity: number }> = ({ id, opacity }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity }}>
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#${id})`} />
  </svg>
);

// ------------------------------------------------ ramka: nagłówek i stopka jak we wzorze
const Frame: React.FC<{ handle: string; issue: string; theme: string }> = ({ handle, issue, theme }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 50, width: 300, height: 66, background: C.orangeLight }} />
    <div style={{ position: "absolute", left: 50, top: 50, height: 66, display: "flex", alignItems: "center", fontFamily: SANS, fontSize: 26, color: C.ink }}>{handle}</div>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: "absolute", left: 318 + i * 40, top: 50, width: 26, height: 66, background: C.orangeLight, transform: "skewX(-25deg)" }} />
    ))}
    <div style={{ position: "absolute", left: 480, right: 140, top: 66, height: 8, background: C.orangeLight }} />
    <div style={{ position: "absolute", right: 52, top: 50, height: 66, display: "flex", alignItems: "center", fontFamily: SANS, fontSize: 26, color: C.ink }}>{issue}</div>
    <div style={{ position: "absolute", left: 52, bottom: 50, fontFamily: SANS, fontSize: 26, color: C.ink }}>Theme of the week</div>
    <div style={{ position: "absolute", left: 300, right: 210, bottom: 58, height: 8, background: C.orangeLight }} />
    <div style={{ position: "absolute", right: 52, bottom: 50, fontFamily: SANS, fontSize: 26, color: C.ink }}>{theme}</div>
  </>
);

// ------------------------------------------------ panel z promieniami (słońce)
const Sunburst: React.FC<{ rotate: number; scale: number }> = ({ rotate, scale }) => (
  <div style={{ position: "absolute", left: 56, top: 250, width: 968, height: 580, overflow: "hidden", transform: `scale(${scale})` }}>
    <div style={{ position: "absolute", left: 484 - 900, top: 290 - 900, width: 1800, height: 1800, background: `repeating-conic-gradient(${C.orange} 0 11.25deg, ${C.orangeLight} 11.25deg 22.5deg)`, transform: `rotate(${rotate}deg)` }} />
    {/* raster kropek jak w druku */}
    <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${C.orangeDeep} 1.6px, transparent 2px)`, backgroundSize: "9px 9px", opacity: 0.35 }} />
  </div>
);

// ------------------------------------------------ maszyna dropiąca w stylu vintage (kremowa, czarne boki)
const Machine: React.FC<{ icon: number; smile: boolean }> = ({ icon, smile }) => (
  <svg width="520" height="520" viewBox="0 0 260 260">
    {/* podstawa */}
    <polygon points="40,190 200,190 232,170 72,170" fill={C.cream} />
    <polygon points="40,190 200,190 200,214 40,214" fill={C.orangeLight} />
    <polygon points="200,190 232,170 232,194 200,214" fill={C.ink} />
    <rect x="52" y="198" width="120" height="6" fill={C.ink} />
    {/* korpus */}
    <polygon points="62,60 182,60 210,42 90,42" fill="#FFF3DA" />
    <polygon points="62,60 182,60 182,180 62,180" fill={C.cream} />
    <polygon points="182,60 210,42 210,162 182,180" fill={C.ink} />
    {/* ekran */}
    <rect x="76" y="74" width="92" height="70" rx="8" fill={C.ink} />
    {/* lejek na górze */}
    <polygon points="100,42 152,42 160,24 92,24" fill={C.orange} />
    <polygon points="152,42 160,24 172,18 164,36" fill={C.ink} />
    {/* wylot */}
    <rect x="98" y="152" width="48" height="22" fill={C.ink} />
    {/* ikonka na ekranie: pikselowa */}
    <g transform="translate(122,109)" fill="#FFF6E4">
      {smile ? (
        <>
          <rect x="-24" y="-16" width="8" height="10" />
          <rect x="16" y="-16" width="8" height="10" />
          <rect x="-28" y="4" width="8" height="6" />
          <rect x="20" y="4" width="8" height="6" />
          <rect x="-20" y="10" width="40" height="6" />
        </>
      ) : icon === 0 ? (
        // kostka do gry (RNG)
        <>
          <rect x="-22" y="-22" width="44" height="44" rx="6" />
          <rect x="-14" y="-14" width="8" height="8" fill={C.ink} />
          <rect x="6" y="6" width="8" height="8" fill={C.ink} />
          <rect x="-4" y="-4" width="8" height="8" fill={C.ink} />
        </>
      ) : icon === 1 ? (
        // strzałka w górę (postęp)
        <>
          <rect x="-6" y="-8" width="12" height="28" />
          <polygon points="-22,-6 0,-26 22,-6" />
        </>
      ) : (
        // gwiazdka (rzadki drop)
        <polygon points="0,-24 7,-7 24,-7 10,4 15,22 0,11 -15,22 -10,4 -24,-7 -7,-7" />
      )}
    </g>
  </svg>
);

// ------------------------------------------------ małe obiekty wokół (wybuchają przy uderzeniu)
const Bolt: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={150 * s} height={150 * s} viewBox="0 0 100 100">
    <polygon points="44,6 16,56 42,56 30,94 84,36 56,36 70,6" fill={C.ink} transform="translate(7,7)" />
    <polygon points="44,6 16,56 42,56 30,94 84,36 56,36 70,6" fill={C.sand} />
  </svg>
);
const Stopwatch: React.FC = () => (
  <svg width="210" height="230" viewBox="0 0 100 110">
    <rect x="44" y="2" width="12" height="12" fill={C.ink} />
    <circle cx="56" cy="64" r="40" fill={C.ink} />
    <circle cx="50" cy="60" r="40" fill={C.orangeLight} />
    <circle cx="50" cy="60" r="30" fill={C.orange} />
    {[...new Array(12)].map((_, i) => (
      <circle key={i} cx={50 + Math.sin((i / 12) * Math.PI * 2) * 25} cy={60 - Math.cos((i / 12) * Math.PI * 2) * 25} r="2" fill={C.cream} />
    ))}
    <polygon points="50,60 72,44 54,64" fill={C.cream} />
    <circle cx="50" cy="60" r="5" fill={C.cream} />
  </svg>
);
const Hourglass: React.FC = () => (
  <svg width="120" height="150" viewBox="0 0 80 100">
    <polygon points="14,10 70,10 46,50 70,90 14,90 38,50" fill={C.ink} transform="translate(6,4)" />
    <polygon points="10,8 66,8 42,50 66,92 10,92 34,50" fill={C.cream} />
    <polygon points="22,20 54,20 38,44" fill={C.orange} />
    <polygon points="38,62 58,86 18,86" fill={C.orange} />
  </svg>
);
const Dice: React.FC = () => (
  <svg width="140" height="140" viewBox="0 0 100 100">
    <rect x="18" y="18" width="70" height="70" rx="10" fill={C.ink} />
    <rect x="10" y="10" width="70" height="70" rx="10" fill="#FFF6E4" />
    {[[28, 28], [62, 28], [45, 45], [28, 62], [62, 62]].map(([x, y], i) => (
      <rect key={i} x={x - 5} y={y - 5} width="10" height="10" fill={C.ink} />
    ))}
  </svg>
);
const Coin: React.FC = () => (
  <svg width="120" height="120" viewBox="0 0 100 100">
    <circle cx="56" cy="56" r="38" fill={C.ink} />
    <circle cx="48" cy="48" r="38" fill={C.sand} />
    <circle cx="48" cy="48" r="26" fill="none" stroke={C.orange} strokeWidth="6" />
    <rect x="44" y="30" width="8" height="36" fill={C.orange} />
  </svg>
);
const Sparkle: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <polygon points="50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40" fill="#FFFFFF" />
  </svg>
);
const Cursor: React.FC = () => (
  <svg width="140" height="170" viewBox="0 0 70 85">
    <polygon points="6,6 6,64 22,50 34,78 46,72 34,46 56,46" fill={C.ink} transform="translate(4,4)" />
    <polygon points="6,6 6,64 22,50 34,78 46,72 34,46 56,46" fill="#FFFFFF" />
  </svg>
);
const PixelTile: React.FC = () => (
  <svg width="110" height="110" viewBox="0 0 50 50">
    <rect x="6" y="6" width="44" height="44" fill={C.ink} />
    <rect x="2" y="2" width="44" height="44" fill="#FFFFFF" />
    {[[2, 2], [24, 2], [13, 13], [35, 13], [2, 24], [24, 24], [13, 35], [35, 35]].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="11" height="11" fill={C.ink} />
    ))}
  </svg>
);

// ------------------------------------------------ tytuł z czarną ekstruzją 3D i rastrem
const Title: React.FC<{ text: string; size: number; fill: string }> = ({ text, size, fill }) => {
  const depth = Math.round(size / 9);
  const shadow = new Array(depth).fill(0).map((_, i) => `${-(i + 1) * 0.6}px ${i + 1}px 0 ${C.ink}`).join(", ");
  return (
    <div style={{ fontFamily: FONT, fontSize: size, lineHeight: 0.95, color: fill, textShadow: shadow, letterSpacing: 2, textAlign: "center", whiteSpace: "nowrap" }}>{text}</div>
  );
};

// ------------------------------------------------ cała animacja
const BURST: BurstItem[] = [
  { key: "bolt1", x: -330, y: -20, rot: -14, s: 1.5, front: true, el: <Bolt /> },
  { key: "bolt2", x: 330, y: 120, rot: 18, s: 1.5, front: true, el: <Bolt /> },
  { key: "bolt3", x: 300, y: -140, rot: -30, s: 1.0, el: <Bolt /> },
  { key: "watch", x: 250, y: -110, rot: 8, s: 1.45, el: <Stopwatch /> },
  { key: "glass", x: -270, y: -170, rot: -14, s: 1.3, el: <Hourglass /> },
  { key: "dice", x: -330, y: 200, rot: 10, s: 1.4, front: true, el: <Dice /> },
  { key: "coin", x: 160, y: 250, rot: -8, s: 1.3, el: <Coin /> },
  { key: "tile1", x: -170, y: 260, rot: 6, s: 1.3, front: true, el: <PixelTile /> },
  { key: "tile2", x: 400, y: 10, rot: -10, s: 1.1, el: <PixelTile /> },
  { key: "glass2", x: 230, y: 230, rot: 20, s: 0.9, front: true, el: <Hourglass /> },
];

// biała kratka za maszyną przy uderzeniu (jak we wzorze)
const GridBack: React.FC<{ s: number }> = ({ s }) => (
  <svg width={620 * s} height={420 * s} viewBox="0 0 310 210" style={{ transform: "rotate(-12deg)" }}>
    {[...new Array(8)].map((_, i) => <line key={`v${i}`} x1={i * 40 + 10} y1="0" x2={i * 40 + 10} y2="210" stroke="#FFF6E4" strokeWidth="3" />)}
    {[...new Array(6)].map((_, i) => <line key={`h${i}`} x1="0" y1={i * 40 + 10} x2="310" y2={i * 40 + 10} stroke="#FFF6E4" strokeWidth="3" />)}
  </svg>
);

type BurstItem = { key: string; x: number; y: number; rot: number; s: number; front?: boolean; el: React.ReactNode };
const renderBurst = (items: BurstItem[], burst: number, frame: number) =>
  items.map((o) => {
    const j = boil(o.key, frame, 4);
    const s = burst * o.s;
    if (s <= 0.01) return null;
    return (
      <div key={o.key} style={{ position: "absolute", left: 540 + o.x * burst + j.x, top: 560 + o.y * burst + j.y, transform: `translate(-50%, -50%) rotate(${o.rot + j.r * 2}deg) scale(${s})` }}>
        {o.el}
      </div>
    );
  });

// ------------------------------------------------ dźwięki (własne, z dzwieki/generuj_dzwieki.py)
// czasy w sekundach pętli 5 s – takie same jak fazy obrazu
const SFX: { file: string; at: number; volume: number }[] = [
  { file: "klik.wav", at: 0.35, volume: 0.7 }, // kursor klika w ekran
  { file: "narastanie.wav", at: 0.4, volume: 0.5 }, // świst przed uderzeniem
  { file: "uderzenie.wav", at: 1.0, volume: 0.75 }, // BUM – tytuł wjeżdża
  { file: "pyki.wav", at: 1.05, volume: 0.6 }, // przedmioty wyskakują
  { file: "zassanie.wav", at: 3.3, volume: 0.7 }, // wszystko zassane do środka
  { file: "dzwonek.wav", at: 4.4, volume: 0.5 }, // iskierka
];

const Dzwieki: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const loops = Math.ceil(durationInFrames / fps / 5);
  return (
    <>
      <Audio src={staticFile("dzwieki/muzyka.wav")} volume={0.7} />
      {Array.from({ length: loops }).flatMap((_, k) =>
        SFX.map((s) => {
          const from = Math.round((s.at + k * 5) * fps);
          return from < durationInFrames ? (
            <Audio key={`${s.file}${k}`} from={from} src={staticFile(`dzwieki/${s.file}`)} volume={s.volume} />
          ) : null;
        }),
      )}
    </>
  );
};

export const Motywacja: React.FC<MotywacjaProps> = ({ handle, issue, theme, title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const ph = phaseOf(sec);
  const loop = Math.floor((sec + 1) / 5);

  // --- spokój: mała maszyna, iskierka, kursor klika w ekran
  // --- uderzenie: duża maszyna przechylona, tytuł, obiekty dookoła, wszystko drży
  // --- zassanie: wszystko maleje do środka, promienie się kręcą
  let machineScale = 1;
  let machineRot = 0;
  let machineY = 0;
  let sunRot = 0;
  let sunScale = 1;
  let titleScale = 0;
  let burst = 0;
  if (ph.name === "calm") {
    machineScale = interpolate(ph.t, [0, 0.25, 0.4], [0.85, 1.22, 1.15], { extrapolateRight: "clamp" });
    machineRot = interpolate(ph.t, [0, 0.25], [-14, 0], { extrapolateRight: "clamp" });
  } else if (ph.name === "smash") {
    // wejście w ~3 klatki z przestrzeleniem, potem lekkie „oddychanie”
    titleScale = interpolate(ph.t, [0, 0.08, 0.17, 0.25], [0.55, 1.12, 0.97, 1], { extrapolateRight: "clamp" });
    burst = interpolate(ph.t, [0, 0.17, 0.25], [0, 1.1, 1], { extrapolateRight: "clamp" });
    machineScale = interpolate(ph.t, [0, 0.17, 0.25], [1.15, 1.42, 1.32], { extrapolateRight: "clamp" }) + Math.sin(ph.t * 6) * 0.02;
    machineRot = -10 + Math.sin(ph.t * 3) * 1.5;
    machineY = 120;
    sunScale = 1.02;
  } else {
    const k = ph.t / 0.25; // 0..1
    titleScale = 1 - k;
    burst = 1 - k;
    machineScale = 1.32 - 0.5 * k;
    machineRot = -10 - 30 * k;
    machineY = 120 * (1 - k);
    sunRot = 25 * k;
  }

  const b = boil("m", frame, ph.name === "smash" ? 3 : 1.5);
  const iconIdx = ph.name === "smash" ? Math.floor(ph.t / 0.5 + loop) % 3 : 0;
  const smile = ph.name === "calm" && ph.t > 0.3;
  // kursor: wjeżdża od dołu w spokoju i klika na ekran
  const cursorIn = ph.name === "calm" ? interpolate(ph.t, [0.7, 1.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : ph.name === "smash" ? interpolate(ph.t, [0, 0.4], [1, 0], { extrapolateRight: "clamp" }) : 0;
  const click = ph.name === "calm" && ph.t > 1.35 && ph.t < 1.55 ? 0.85 : 1;
  const sparkle = ph.name === "calm" ? interpolate(ph.t, [0.3, 0.45, 0.7], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Sunburst rotate={sunRot} scale={sunScale} />
      <Frame handle={handle} issue={issue} theme={theme} />

      {/* kratka za maszyną */}
      {burst > 0.05 ? (
        <div style={{ position: "absolute", left: 560, top: 600, transform: `translate(-50%, -50%) scale(${burst})`, opacity: 0.9 }}>
          <GridBack s={1} />
        </div>
      ) : null}

      {/* obiekty za maszyną */}
      {renderBurst(BURST.filter((o) => !o.front), burst, frame)}

      {/* maszyna */}
      <div style={{ position: "absolute", left: 540 + b.x, top: 560 + machineY + b.y, transform: `translate(-50%, -50%) rotate(${machineRot + b.r}deg) scale(${machineScale * click})` }}>
        <Machine icon={iconIdx} smile={smile} />
      </div>

      {/* obiekty przed maszyną */}
      {renderBurst(BURST.filter((o) => o.front), burst, frame)}

      {/* iskierka przy maszynie */}
      {sparkle > 0 ? (
        <div style={{ position: "absolute", left: 330, top: 360, transform: `translate(-50%, -50%) scale(${sparkle}) rotate(${sparkle * 45}deg)` }}>
          <Sparkle size={110} />
        </div>
      ) : null}

      {/* kursor */}
      {cursorIn > 0 ? (
        <div style={{ position: "absolute", left: interpolate(cursorIn, [0, 1], [820, 560]), top: interpolate(cursorIn, [0, 1], [820, 620]), transform: `scale(${click})` }}>
          <Cursor />
        </div>
      ) : null}

      {/* tytuł */}
      {titleScale > 0.01 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 96, transform: `scale(${titleScale}) rotate(${-1.5 + b.r * 0.4}deg)`, transformOrigin: "50% 50%" }}>
          <Title text={title} size={160} fill={C.orange} />
          <div style={{ marginTop: 2 }}>
            <Title text={subtitle} size={78} fill={C.sand} />
          </div>
        </div>
      ) : null}

      <Grain id="grain" opacity={0.12} />
      <Dzwieki />
    </AbsoluteFill>
  );
};

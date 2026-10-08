// SHOWREEL – „CV” motion designera. 24 s, 1080×1920, 30 fps, 120 BPM (takt = 15 klatek, 4 takty = 60 klatek).
// Każda część pokazuje inną technikę i kończy się innym przejściem:
//   01 INTRO      0– 60  kropka → kreska (squash & stretch) → litery
//   02 TYPE      60–150  kinetyczna typografia na bity, „automat” ze słowami     → przejście: iris (koło)
//   03 SHAPES   150–270  morfing kształtów + skacząca piłka                      → whip-pan (smuga ruchu)
//   04 LIQUID   270–360  płynne bloby (filtr „goo”)                               → blob zalewa ekran
//   05 PARTICLES 360–450 1200 cząsteczek układa się w napis i odlatuje           → błysk + zoom
//   06 3D       450–570  fala sześcianów 3D + kryształ, kamera krąży              → twarde cięcie na bit
//   07 DATA     570–630  liczniki, słupki, wykres kołowy
//   08 OUTRO    630–720  wszystko zwija się w kropkę (klamra z początkiem) → podpis
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Easing, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const DISPLAY = "Archivo Black";
const GROTESK = "Space Grotesk";
loadFont({ family: DISPLAY, url: staticFile("fonts/ArchivoBlack.woff2") });
loadFont({ family: GROTESK, url: staticFile("fonts/SpaceGrotesk-500.woff2"), weight: "500" });
loadFont({ family: GROTESK, url: staticFile("fonts/SpaceGrotesk-700.woff2"), weight: "700" });

// spójna paleta całego reela
const P = {
  ink: "#0E0E10",
  paper: "#F2EFE9",
  blue: "#2D5BFF",
  coral: "#FF4D3D",
  lime: "#C6F432",
  violet: "#8B5CF6",
  pink: "#FF7AD9",
};
const B = 15; // jeden bit
const W = 1080;
const H = 1920;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.65, 0, 0.35, 1);
const outE = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, from: number, to: number, e: (n: number) => number = io) => interpolate(f, [a, b], [from, to], { ...cl, easing: e });

const SECTIONS = [
  { from: 0, name: "INTRO" },
  { from: 60, name: "KINETIC TYPE" },
  { from: 150, name: "SHAPE MORPH" },
  { from: 270, name: "LIQUID" },
  { from: 360, name: "PARTICLES" },
  { from: 450, name: "3D" },
  { from: 570, name: "DATA" },
  { from: 630, name: "OUTRO" },
];

// ------------------------------------------------ HUD: ten sam we wszystkich częściach (system projektu)
const Hud: React.FC<{ f: number; dark: boolean }> = ({ f, dark }) => {
  const idx = SECTIONS.filter((s) => f >= s.from).length - 1;
  const c = dark ? P.paper : P.ink;
  const sec = Math.floor(f / 30);
  const fr = f % 30;
  return (
    <>
      <div style={{ position: "absolute", left: 64, top: 90, fontFamily: GROTESK, fontWeight: 700, fontSize: 30, color: c, letterSpacing: 2 }}>CLAUDE — MOTION REEL</div>
      <div style={{ position: "absolute", right: 64, top: 90, fontFamily: GROTESK, fontWeight: 500, fontSize: 30, color: c, letterSpacing: 2 }}>
        {String(idx + 1).padStart(2, "0")} / 08 · {SECTIONS[idx].name}
      </div>
      <div style={{ position: "absolute", left: 64, bottom: 110, fontFamily: GROTESK, fontWeight: 500, fontSize: 28, color: c, opacity: 0.7 }}>
        00:{String(sec).padStart(2, "0")}:{String(fr).padStart(2, "0")}
      </div>
      <div style={{ position: "absolute", left: 260, right: 64, bottom: 124, height: 3, background: c, opacity: 0.25 }} />
      <div style={{ position: "absolute", left: 260, bottom: 124, height: 3, width: (W - 324) * (f / 720), background: c }} />
    </>
  );
};

// ------------------------------------------------ 01 INTRO
const Intro: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 9, stiffness: 180 } });
  // kropka rozciąga się w kreskę (squash & stretch), potem kreska „rozcina” się na litery
  const stretch = lerp(f, 15, 27, 0, 1, outE);
  const lineW = 40 + stretch * 760;
  const lineH = 40 - stretch * 30;
  const word = "CLAUDE";
  const lettersOn = f >= 28;
  return (
    <AbsoluteFill style={{ background: P.ink }}>
      {!lettersOn ? (
        <div style={{ position: "absolute", left: W / 2 - lineW / 2, top: 900 - lineH / 2, width: lineW, height: lineH, borderRadius: 40, background: P.lime, transform: `scale(${pop})` }} />
      ) : (
        <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", gap: 6 }}>
          {word.split("").map((ch, i) => {
            const s = spring({ frame: f - 28 - i * 2, fps, config: { damping: 12, stiffness: 200 } });
            return (
              <div key={i} style={{ overflow: "hidden", height: 230 }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 200, lineHeight: "230px", color: P.paper, transform: `translateY(${(1 - s) * 230}px)` }}>{ch}</div>
              </div>
            );
          })}
        </div>
      )}
      {lettersOn ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center", fontFamily: GROTESK, fontWeight: 500, fontSize: 44, letterSpacing: 14, color: P.lime, opacity: lerp(f, 40, 50, 0, 1) }}>
          MOTION DESIGNER
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ------------------------------------------------ 02 KINETIC TYPE
const WORDS = [
  { t: "I DESIGN.", bg: P.paper, c: P.ink },
  { t: "I ANIMATE.", bg: P.blue, c: P.paper },
  { t: "I CODE.", bg: P.coral, c: P.ink },
  { t: "EVERY", bg: P.ink, c: P.lime },
  { t: "FRAME.", bg: P.ink, c: P.lime },
];
const SLOT = ["2D", "3D", "TYPE", "FX", "UI", "DATA", "LOOPS"];
const KineticType: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const l = f - 60;
  if (l < 60) {
    // co bit nowe słowo, wjeżdża maską od dołu z lekkim przechyłem
    const i = Math.min(WORDS.length - 1, Math.floor(l / 12));
    const w = WORDS[i];
    const s = spring({ frame: l - i * 12, fps, config: { damping: 14, stiffness: 260 } });
    const big = w.t.length <= 6 ? 250 : 170;
    return (
      <AbsoluteFill style={{ background: w.bg, justifyContent: "center", alignItems: "center" }}>
        <div style={{ overflow: "hidden", padding: "0 20px" }}>
          <div style={{ fontFamily: DISPLAY, fontSize: big, color: w.c, transform: `translateY(${(1 - s) * 260}px) skewY(${(1 - s) * -8}deg)`, whiteSpace: "nowrap" }}>{w.t}</div>
        </div>
      </AbsoluteFill>
    );
  }
  // „automat”: kolumna słów przewija się i zatrzymuje (90..150)
  const ll = l - 60;
  const pos = lerp(ll, 0, 16, 0, SLOT.length * 3 - 1, Easing.bezier(0.2, 0.8, 0.2, 1));
  const iris = lerp(ll, 18, 30, 0, 1500, Easing.in(Easing.cubic));
  const rowH = 220;
  return (
    <AbsoluteFill style={{ background: P.ink }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", fontFamily: GROTESK, fontWeight: 700, fontSize: 64, color: P.paper, letterSpacing: 6 }}>I MAKE</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, height: rowH, overflow: "hidden" }}>
        <div style={{ transform: `translateY(${-pos * rowH}px)` }}>
          {[...SLOT, ...SLOT, ...SLOT].map((s, i) => (
            <div key={i} style={{ height: rowH, lineHeight: `${rowH}px`, textAlign: "center", fontFamily: DISPLAY, fontSize: 200, color: i === SLOT.length * 3 - 1 ? P.lime : P.paper }}>{s}</div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", fontFamily: GROTESK, fontWeight: 500, fontSize: 48, color: P.paper, opacity: lerp(ll, 12, 18, 0, 1) }}>…and a bit of everything.</div>
      {/* przejście: koło (iris) rośnie z kropki */}
      <div style={{ position: "absolute", left: W / 2 - iris, top: 1200 - iris, width: iris * 2, height: iris * 2, borderRadius: "50%", background: P.violet }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------ 03 SHAPE MORPH (własny morfing: 120 punktów na kształt)
const N = 120;
const shapePoints = (kind: number, r: number): [number, number][] =>
  [...new Array(N)].map((_, i) => {
    const t = (i / N) * Math.PI * 2;
    const ct = Math.cos(t);
    const st = Math.sin(t);
    if (kind === 0) return [ct * r, st * r]; // koło
    if (kind === 1) {
      // kwadrat
      const m = Math.max(Math.abs(ct), Math.abs(st));
      return [(ct / m) * r * 0.82, (st / m) * r * 0.82];
    }
    if (kind === 2) {
      // gwiazda (5 ramion)
      const k = 0.5 + 0.5 * Math.cos(5 * (t + Math.PI / 2));
      const rr = r * (0.48 + 0.52 * Math.pow(k, 1.6));
      return [ct * rr, st * rr];
    }
    if (kind === 3) {
      // trójkąt
      const a = ((t + Math.PI / 2) % ((Math.PI * 2) / 3)) - Math.PI / 3;
      const rr = (r * 0.55) / Math.cos(a);
      return [ct * rr, st * rr];
    }
    // serce
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return [x * r * 0.058, y * r * 0.058];
  });
const SHAPE_ORDER = [0, 1, 2, 3, 4, 0];
const SHAPE_BG = [P.violet, P.lime, P.blue, P.coral, P.pink, P.violet];
const SHAPE_FG = [P.lime, P.ink, P.paper, P.ink, P.ink, P.lime];
const Shapes: React.FC<{ f: number }> = ({ f }) => {
  const l = f - 150;
  const step = Math.min(SHAPE_ORDER.length - 2, Math.floor(l / 24));
  const k = lerp(l - step * 24, 0, 14, 0, 1, Easing.bezier(0.7, 0, 0.2, 1.3));
  const a = shapePoints(SHAPE_ORDER[step], 330);
  const b = shapePoints(SHAPE_ORDER[step + 1], 330);
  const d = a.map(([x, y], i) => `${i ? "L" : "M"}${x + (b[i][0] - x) * k},${y + (b[i][1] - y) * k}`).join(" ") + "Z";
  const rot = step * 72 + k * 72;
  const bg = k > 0.5 ? SHAPE_BG[step + 1] : SHAPE_BG[step];
  const fg = k > 0.5 ? SHAPE_FG[step + 1] : SHAPE_FG[step];
  // piłka: odbija się co 2 bity, ściska się przy ziemi
  const ph = (l % 30) / 30;
  const hgt = 4 * ph * (1 - ph);
  const squash = ph < 0.08 || ph > 0.92 ? 1.35 : 1 - hgt * 0.15;
  const ballY = 1640 - hgt * 300;
  // whip-pan do następnej części
  const whip = lerp(l, 104, 120, 0, 1, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill style={{ background: bg }}>
      <AbsoluteFill style={{ transform: `translateX(${-whip * 1400}px)`, filter: `blur(${whip * 40}px)` }}>
        <svg width={W} height={H} viewBox={`${-W / 2} -900 ${W} ${H}`} style={{ position: "absolute" }}>
          <path d={d} fill={fg} transform={`rotate(${rot})`} />
        </svg>
        <div style={{ position: "absolute", left: W / 2 - 60 * squash, top: ballY - 120 / squash, width: 120 * squash, height: 120 / squash, borderRadius: "50%", background: P.ink }} />
        <div style={{ position: "absolute", left: W / 2 - 90 * (1 - hgt * 0.5), top: 1640, width: 180 * (1 - hgt * 0.5), height: 26, borderRadius: "50%", background: P.ink, opacity: 0.2 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------ 04 LIQUID (bloby + filtr goo)
const Liquid: React.FC<{ f: number }> = ({ f }) => {
  const l = f - 270;
  const enter = lerp(l, 0, 12, 1400, 0, outE); // dokończenie whip-pana
  const merge = lerp(l, 60, 88, 0, 1, Easing.in(Easing.cubic));
  const blobs = [...new Array(9)].map((_, i) => {
    const sp = 0.03 + random(`bs${i}`) * 0.04;
    const ph = random(`bp${i}`) * 6.28;
    const x = Math.cos(l * sp + ph) * (180 + random(`bx${i}`) * 200) * (1 - merge);
    const y = Math.sin(l * sp * 1.3 + ph) * (300 + random(`by${i}`) * 260) * (1 - merge);
    const r = 90 + random(`br${i}`) * 90;
    return { x, y, r };
  });
  const big = merge * 1400;
  return (
    <AbsoluteFill style={{ background: P.blue, transform: `translateX(${enter}px)` }}>
      <svg width={W} height={H} viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -18" />
          </filter>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={P.lime} />
            <stop offset="1" stopColor={P.pink} />
          </linearGradient>
        </defs>
        <g filter="url(#goo)" fill="url(#lg)">
          {blobs.map((bb, i) => (
            <circle key={i} cx={bb.x} cy={bb.y} r={bb.r} />
          ))}
          <circle cx={0} cy={0} r={120 + big} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 840, textAlign: "center", fontFamily: DISPLAY, fontSize: 150, color: P.paper, opacity: 1 - merge }}>FLUID</div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------ 05 PARTICLES (napis z cząsteczek)
const useTextPoints = (text: string, count: number) =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1000;
    c.height = 300;
    const g = c.getContext("2d")!;
    g.fillStyle = "#fff";
    g.font = "bold 230px 'DejaVu Sans'";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 500, 150);
    const data = g.getImageData(0, 0, 1000, 300).data;
    const pts: [number, number][] = [];
    for (let y = 0; y < 300; y += 5) for (let x = 0; x < 1000; x += 5) if (data[(y * 1000 + x) * 4 + 3] > 128) pts.push([x - 500, y - 150]);
    return [...new Array(count)].map((_, i) => pts[Math.floor(random(`tp${i}`) * pts.length)] ?? [0, 0]);
  }, [text, count]);
const COUNT = 1200;
const Particles: React.FC<{ f: number }> = ({ f }) => {
  const l = f - 360;
  const target = useTextPoints("MOTION", COUNT);
  const gather = lerp(l, 8, 40, 0, 1, Easing.bezier(0.2, 0.9, 0.3, 1));
  const blow = lerp(l, 62, 90, 0, 1, Easing.in(Easing.quad));
  const zoom = lerp(l, 80, 90, 1, 3, Easing.in(Easing.cubic));
  const cols = [P.lime, P.paper, P.pink, P.blue];
  return (
    <AbsoluteFill style={{ background: P.ink }}>
      <svg width={W} height={H} viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} style={{ transform: `scale(${zoom})` }}>
        {target.map(([tx, ty], i) => {
          const a = random(`pa${i}`) * Math.PI * 2;
          const r = 300 + random(`pr${i}`) * 900;
          const sx = Math.cos(a) * r;
          const sy = Math.sin(a) * r;
          const delay = random(`pd${i}`) * 0.25;
          const g = Math.max(0, Math.min(1, (gather - delay) / (1 - delay)));
          const wob = Math.sin(l * 0.2 + i) * 2 * g;
          const wx = blow * (300 + random(`pw${i}`) * 900);
          const wy = blow * (random(`pv${i}`) - 0.6) * 500;
          const x = sx + (tx - sx) * g + wob + wx;
          const y = sy + (ty - sy) * g + wy;
          return <circle key={i} cx={x} cy={y} r={2.2 + random(`ps${i}`) * 2.6} fill={cols[i % 4]} opacity={0.9} />;
        })}
      </svg>
      <AbsoluteFill style={{ background: P.paper, opacity: lerp(l, 84, 90, 0, 1, Easing.linear) }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------ 06 3D (fala sześcianów + kryształ, kamera krąży)
const Cam: React.FC<{ pos: [number, number, number]; look: [number, number, number] }> = ({ pos, look }) => {
  const { camera } = useThree();
  camera.position.set(...pos);
  camera.lookAt(...look);
  return null;
};
const GRID = 16;
const Three3D: React.FC<{ f: number }> = ({ f }) => {
  const l = f - 450;
  const { width, height } = useVideoConfig();
  const colA = useMemo(() => new THREE.Color(P.blue), []);
  const colB = useMemo(() => new THREE.Color(P.pink), []);
  const colC = useMemo(() => new THREE.Color(P.lime), []);
  const orbit = lerp(l, 0, 120, -0.6, 1.4, Easing.inOut(Easing.sin));
  const camR = lerp(l, 0, 120, 22, 15, Easing.inOut(Easing.sin));
  const rise = lerp(l, 40, 70, -6, 2.6, outE);
  const flashOut = lerp(l, 0, 8, 1, 0, Easing.linear);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#120B3A 0%, #2D1A8A 50%, #0E0E10 100%)" }}>
      <ThreeCanvas width={width} height={height} flat gl={{ antialias: true, alpha: true }} camera={{ fov: 45 }}>
        <Cam pos={[Math.cos(orbit) * camR, 15 - l * 0.04, Math.sin(orbit) * camR]} look={[0, 0, 0]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 12, 4]} intensity={1.6} />
        <directionalLight position={[-8, 4, -6]} intensity={0.8} color={P.pink} />
        {[...new Array(GRID * GRID)].map((_, i) => {
          const gx = (i % GRID) - GRID / 2 + 0.5;
          const gz = Math.floor(i / GRID) - GRID / 2 + 0.5;
          const d = Math.sqrt(gx * gx + gz * gz);
          const h = 0.6 + (Math.sin(d * 0.8 - l * 0.22) + 1) * 1.3;
          const c = colA.clone().lerp(d < 4 ? colC : colB, Math.min(1, (h - 0.6) / 2.6));
          return (
            <mesh key={i} position={[gx * 1.1, h / 2 - 2, gz * 1.1]} scale={[1, h, 1]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={c} flatShading roughness={0.5} />
            </mesh>
          );
        })}
        <mesh position={[0, rise, 0]} rotation={[l * 0.03, l * 0.05, 0]}>
          <icosahedronGeometry args={[1.8, 0]} />
          <meshStandardMaterial color={P.paper} emissive={P.violet} emissiveIntensity={0.35} flatShading metalness={0.3} roughness={0.2} />
        </mesh>
      </ThreeCanvas>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: DISPLAY, fontSize: 130, color: P.paper, opacity: lerp(l, 20, 32, 0, 1), transform: `translateY(${lerp(l, 20, 32, 40, 0, outE)}px)` }}>
        DEPTH.
      </div>
      <AbsoluteFill style={{ background: P.paper, opacity: flashOut }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------ 07 DATA (liczniki, słupki, wykres kołowy)
const Data: React.FC<{ f: number }> = ({ f }) => {
  const l = f - 570;
  const n = Math.round(lerp(l, 0, 36, 0, 720, Easing.out(Easing.cubic)));
  const bars = [0.35, 0.6, 0.45, 0.8, 1];
  const pie = lerp(l, 6, 40, 0, 0.82, outE);
  return (
    <AbsoluteFill style={{ background: P.lime }}>
      <div style={{ position: "absolute", left: 80, top: 300, fontFamily: DISPLAY, fontSize: 220, color: P.ink, lineHeight: 1 }}>{n}</div>
      <div style={{ position: "absolute", left: 86, top: 540, fontFamily: GROTESK, fontWeight: 700, fontSize: 44, color: P.ink }}>FRAMES IN THIS REEL</div>
      <div style={{ position: "absolute", left: 80, top: 700, width: 420, height: 520, display: "flex", alignItems: "flex-end", gap: 18 }}>
        {bars.map((v, i) => (
          <div key={i} style={{ width: 66, height: 520 * v * lerp(l, 4 + i * 4, 24 + i * 4, 0, 1, outE), background: i === 4 ? P.coral : P.ink }} />
        ))}
      </div>
      <svg width="420" height="420" viewBox="-110 -110 220 220" style={{ position: "absolute", right: 70, top: 760 }}>
        <circle r="80" fill="none" stroke={P.ink} strokeOpacity={0.15} strokeWidth="34" />
        <circle r="80" fill="none" stroke={P.coral} strokeWidth="34" pathLength={1} strokeDasharray={`${pie} 1`} transform="rotate(-90)" />
        <text y="14" textAnchor="middle" fontFamily={DISPLAY} fontSize="44" fill={P.ink}>{Math.round(pie * 100)}%</text>
      </svg>
      <div style={{ position: "absolute", right: 70, top: 1200, width: 420, textAlign: "center", fontFamily: GROTESK, fontWeight: 700, fontSize: 36, color: P.ink }}>MADE IN CODE</div>
      <div style={{ position: "absolute", left: 80, top: 1290, fontFamily: GROTESK, fontWeight: 500, fontSize: 40, color: P.ink }}>0 keyframes drawn by hand.</div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------ 08 OUTRO (klamra: wszystko wraca do kropki)
const Outro: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const l = f - 630;
  const shrink = lerp(l, 0, 14, 1, 0, Easing.in(Easing.cubic));
  const dot = spring({ frame: l - 14, fps, config: { damping: 10, stiffness: 160 } });
  const nameS = spring({ frame: l - 24, fps, config: { damping: 14, stiffness: 200 } });
  const sub = lerp(l, 34, 46, 0, 1, outE);
  const cta = lerp(l, 48, 60, 0, 1, outE);
  return (
    <AbsoluteFill style={{ background: P.ink }}>
      {shrink > 0 ? (
        <div style={{ position: "absolute", left: W / 2 - (W / 2) * shrink, top: 960 - 960 * shrink, width: W * shrink, height: H * shrink, borderRadius: `${(1 - shrink) * 50}%`, background: P.lime, overflow: "hidden" }} />
      ) : null}
      <div style={{ position: "absolute", left: W / 2 - 20, top: 640 - 20, width: 40, height: 40, borderRadius: 20, background: P.lime, transform: `scale(${dot})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", overflow: "hidden", height: 230 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 200, lineHeight: "230px", color: P.paper, transform: `translateY(${(1 - nameS) * 230}px)` }}>CLAUDE</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 970, textAlign: "center", fontFamily: GROTESK, fontWeight: 500, fontSize: 46, letterSpacing: 14, color: P.lime, opacity: sub }}>MOTION DESIGNER</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1130, textAlign: "center", opacity: cta, transform: `translateY(${(1 - cta) * 30}px)` }}>
        <span style={{ fontFamily: GROTESK, fontWeight: 700, fontSize: 40, color: P.ink, background: P.paper, padding: "18px 40px", borderRadius: 60 }}>available for hire →</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", fontFamily: GROTESK, fontWeight: 500, fontSize: 30, color: P.paper, opacity: cta * 0.6 }}>2D · 3D · type · liquid · particles · data · sound</div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  const f = useCurrentFrame();
  let el: React.ReactNode;
  let dark = true;
  if (f < 60) el = <Intro f={f} />;
  else if (f < 150) {
    el = <KineticType f={f} />;
    const i = Math.floor((f - 60) / 12);
    dark = f >= 120 || i >= 3 || i === 1;
  } else if (f < 270) {
    el = <Shapes f={f} />;
    dark = false;
  } else if (f < 360) el = <Liquid f={f} />;
  else if (f < 450) el = <Particles f={f} />;
  else if (f < 570) el = <Three3D f={f} />;
  else if (f < 630) {
    el = <Data f={f} />;
    dark = false;
  } else el = <Outro f={f} />;
  return (
    <AbsoluteFill style={{ background: P.ink }}>
      {el}
      <Hud f={f} dark={dark} />
      <Audio src={staticFile("dzwieki/reel.wav")} />
    </AbsoluteFill>
  );
};

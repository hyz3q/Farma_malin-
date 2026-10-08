// „ISKRA” – krótka filmowa animacja motywacyjna (12 s, pionowo, 30 fps).
// INSPIRACJA (nie kopia) filmikiem motiondesigners2d: ciemne tło z gradientem, jeden symbol na ujęcie,
// mocna poświata, każde ujęcie w innej palecie, płynny ruch (30 fps, łagodne krzywe), jeden motyw
// przewodni, który łączy ujęcia, i różna długość ujęć (bez powtarzanego w kółko schematu).
// Własna historia: telefon gaśnie → zostaje mała iskra → wspina się po schodach → wschodzi słońce.
//
// Ujęcia (100 BPM, 1 takt = 0,6 s = 18 klatek):
//   1   0– 72  noc, świecący telefon, obok malutka iskra       (4 takty – wolno)
//   2  72–108  KONTRAST: telefon gaśnie, iskra rośnie            (2 takty)
//   3 108–126  iskra leci w kamerę i zalewa ekran               (1 takt – szybko)
//   4 126–234  schody na górę – zapala się 1 stopień na takt     (6 taktów)
//   5 234–252  błysk na szczycie                                  (1 takt)
//   6 252–360  wschód słońca, telefon leży ekranem w dół, napis  (6 taktów – oddech)
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, random, staticFile, useCurrentFrame } from "remotion";

const W = 1080;
const H = 1920;
const BEAT = 18;
const ease = Easing.bezier(0.45, 0, 0.2, 1);
const out = Easing.out(Easing.cubic);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (f: number, a: number, b: number, from: number, to: number, e = ease) => interpolate(f, [a, b], [from, to], { ...cl, easing: e });
const SANS = "'DejaVu Sans', Arial, Helvetica, sans-serif";

// ------------------------------------------------ poświata: kształt + rozmyta kopia pod spodem
const Glow: React.FC<{ blur: number; opacity?: number; children: React.ReactNode }> = ({ blur, opacity = 0.9, children }) => (
  <div style={{ position: "relative" }}>
    <div style={{ position: "absolute", inset: 0, filter: `blur(${blur}px)`, opacity }}>{children}</div>
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

// ziarno filmowe, inne w każdej klatce
const Grain: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay" }}>
    <filter id={`g${frame % 4}`}>
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 4} />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#g${frame % 4})`} />
  </svg>
);

// ------------------------------------------------ ISKRA – motyw przewodni (płomyk, który żyje)
const Spark: React.FC<{ size: number; frame: number; hue?: "warm" | "gold" }> = ({ size, frame, hue = "warm" }) => {
  const fl = 1 + Math.sin(frame * 0.9) * 0.05 + (random(`s${frame}`) - 0.5) * 0.06;
  const tilt = Math.sin(frame * 0.35) * 5;
  const [a, b, c] = hue === "warm" ? ["#FFF4D6", "#FFB347", "#FF5A1F"] : ["#FFFFFF", "#FFE08A", "#FF9A3C"];
  const flame = (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{ transform: `rotate(${tilt}deg) scaleY(${fl})`, transformOrigin: "50% 100%" }}>
      <defs>
        <radialGradient id={`sp${hue}`} cx="50%" cy="72%" r="60%">
          <stop offset="0%" stopColor={a} />
          <stop offset="45%" stopColor={b} />
          <stop offset="100%" stopColor={c} />
        </radialGradient>
      </defs>
      <path d="M50 4 C64 34 92 52 90 92 C88 122 70 136 50 136 C30 136 12 122 10 92 C8 62 34 50 50 4 Z" fill={`url(#sp${hue})`} />
      <path d="M50 60 C58 78 70 86 68 106 C66 120 58 126 50 126 C42 126 34 120 32 106 C30 90 44 82 50 60 Z" fill={a} opacity={0.9} />
    </svg>
  );
  return (
    <Glow blur={size * 0.35} opacity={1}>
      {flame}
    </Glow>
  );
};

// ------------------------------------------------ UJĘCIE 1–2: noc i telefon
const PhoneScene: React.FC<{ f: number }> = ({ f }) => {
  const off = f >= 72; // cięcie kontrastowe
  const push = lerp(f, 0, 108, 1, 1.12, Easing.linear);
  const sparkSize = off ? lerp(f, 72, 108, 60, 150, out) : 46 + Math.sin(f * 0.2) * 4;
  // przesuwający się feed na ekranie
  const scroll = (f * 9) % 120;
  // odblask światła sunący po telefonie
  const sweep = lerp(f % 54, 0, 30, -60, 160, Easing.inOut(Easing.quad));
  const bg = off
    ? "radial-gradient(circle at 62% 56%, #3A1606 0%, #120604 38%, #050302 100%)"
    : "linear-gradient(180deg, #050A1E 0%, #0B1A44 55%, #10275E 64%, #050A1A 100%)";
  return (
    <AbsoluteFill style={{ background: bg }}>
      {!off ? (
        // zimna poświata ekranu na „blacie”
        <div style={{ position: "absolute", left: 140, top: 1020, width: 800, height: 520, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(90,170,255,0.55), rgba(90,170,255,0))", transform: `scale(${push})` }} />
      ) : null}
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 62%" }}>
        {/* blat / horyzont */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1190, height: 730, background: off ? "linear-gradient(180deg,#1A0A04,#050302)" : "linear-gradient(180deg,#0E2050 0%, #08132E 40%, #040814 100%)" }} />
        {/* telefon (stoi lekko pochylony) */}
        <div style={{ position: "absolute", left: 330, top: 640, transform: "rotate(-4deg)" }}>
          {off ? (
            <div style={{ width: 300, height: 560, borderRadius: 46, background: "linear-gradient(160deg,#1C130E,#0A0605)", border: "10px solid #24180F" }} />
          ) : (
            <Glow blur={50} opacity={0.8}>
              <div style={{ width: 300, height: 560, borderRadius: 46, background: "#0A1430", border: "10px solid #1C2C5C", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#5FB4FF,#2A6BFF)" }} />
                {[...new Array(6)].map((_, i) => (
                  <div key={i} style={{ position: "absolute", left: 26, right: 26, top: i * 120 - scroll + 20, height: 90, borderRadius: 14, background: "rgba(255,255,255,0.35)" }} />
                ))}
                <div style={{ position: "absolute", top: 0, bottom: 0, left: sweep + "%", width: 70, background: "linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.55),rgba(255,255,255,0))", transform: "skewX(-20deg)" }} />
              </div>
            </Glow>
          )}
        </div>
        {/* iskra obok telefonu */}
        <div style={{ position: "absolute", left: 760 - sparkSize / 2, top: 1190 - sparkSize * 1.4 }}>
          <Spark size={sparkSize} frame={f} />
        </div>
        {off ? (
          <div style={{ position: "absolute", left: 760 - 300, top: 1190 - 330, width: 600, height: 500, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,120,40,0.35), rgba(255,120,40,0))", opacity: lerp(f, 72, 100, 0, 1) }} />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------ UJĘCIE 3: iskra leci w kamerę
const ZoomScene: React.FC<{ f: number }> = ({ f }) => {
  const k = lerp(f, 108, 126, 0, 1, Easing.in(Easing.cubic));
  const size = 150 + k * 2600;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, #3A1606 0%, #050302 70%)" }}>
      <div style={{ position: "absolute", left: 540 - size / 2 + (1 - k) * 220, top: 1000 - size * 0.8 + (1 - k) * 150 }}>
        <Spark size={size} frame={f} />
      </div>
      <AbsoluteFill style={{ background: "#FFB347", opacity: lerp(f, 120, 126, 0, 1) }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------ UJĘCIE 4: schody na szczyt (1 stopień = 1 takt)
const STEPS = 6;
const stepPos = (i: number) => ({ x: 170 + i * 128, y: 1500 - i * 150 });
const StairsScene: React.FC<{ f: number }> = ({ f }) => {
  const local = f - 126;
  const beat = local / BEAT; // 0..6
  const lit = Math.min(STEPS, Math.floor(beat) + 1);
  // iskra skacze na kolejny stopień na początku każdego taktu
  const i = Math.min(STEPS - 1, Math.floor(beat));
  const ph = beat - Math.floor(beat);
  const from = stepPos(Math.max(0, i - 1));
  const to = stepPos(i);
  const hop = i === 0 ? 1 : lerp(ph, 0, 0.45, 0, 1, Easing.out(Easing.quad));
  const sx = from.x + (to.x - from.x) * hop + 64;
  const sy = from.y + (to.y - from.y) * hop - Math.sin(hop * Math.PI) * 90;
  const camY = lerp(local, 0, 108, 0, 420, Easing.inOut(Easing.sin));
  const flashIn = lerp(local, 0, 8, 1, 0, Easing.linear);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#081A22 0%, #0E3A40 45%, #1F6B5E 80%, #3FA37E 100%)" }}>
      {/* odległe góry */}
      <svg width={W} height={H} style={{ position: "absolute", transform: `translateY(${camY * 0.3}px)` }}>
        <polygon points="0,1240 260,980 470,1180 720,900 1080,1220 1080,1920 0,1920" fill="#0B2A30" opacity={0.9} />
      </svg>
      <AbsoluteFill style={{ transform: `translateY(${camY}px)` }}>
        {/* zbocze */}
        <svg width={W} height={H + 600} style={{ position: "absolute" }}>
          <polygon points="0,1620 1080,620 1080,2520 0,2520" fill="#06161B" />
        </svg>
        {[...new Array(STEPS)].map((_, k) => {
          const p = stepPos(k);
          const on = k < lit;
          const pop = on ? lerp(local, k * BEAT, k * BEAT + 6, 0.3, 1, out) : 0;
          return (
            <div key={k} style={{ position: "absolute", left: p.x, top: p.y }}>
              <div style={{ position: "absolute", left: -40, top: -120, width: 208, height: 200, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,190,90,0.6), rgba(255,190,90,0))", opacity: pop }} />
              <div style={{ position: "relative", width: 128, height: 40, borderRadius: 6, background: on ? "linear-gradient(180deg,#FFE3A3,#FF9A3C)" : "linear-gradient(180deg,#1C3B40,#0D2226)", boxShadow: on ? `0 0 ${40 * pop}px rgba(255,170,80,0.9)` : "none" }} />
              <div style={{ width: 128, height: 150, background: "linear-gradient(180deg,#0B2227,#06161B)" }} />
            </div>
          );
        })}
        {/* flaga na szczycie */}
        <div style={{ position: "absolute", left: stepPos(5).x + 90, top: stepPos(5).y - 230 }}>
          <div style={{ width: 8, height: 230, background: "#06161B" }} />
          <div style={{ position: "absolute", left: 8, top: 4, width: 110, height: 66, background: lit >= STEPS ? "#FFE3A3" : "#123036", clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
        </div>
        <div style={{ position: "absolute", left: sx - 40, top: sy - 112 }}>
          <Spark size={80} frame={f} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#FFB347", opacity: flashIn }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------ UJĘCIE 5–6: błysk i wschód słońca
const SunScene: React.FC<{ f: number }> = ({ f }) => {
  const local = f - 234;
  const flash = local < 18 ? lerp(local, 0, 4, 0, 1, Easing.linear) * lerp(local, 6, 18, 1, 0) : 0;
  const rise = lerp(local, 10, 120, 0, 1, Easing.out(Easing.cubic));
  const sunY = 1330 - rise * 440;
  const rays = local * 0.25;
  const t1 = lerp(local, 66, 80, 0, 1, out);
  const t2 = lerp(local, 90, 104, 0, 1, out);
  const fadeEnd = lerp(local, 118, 126, 1, 0, Easing.linear);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#2A0F3A 0%, #8C2F5A 38%, #FF7A4D 66%, #FFC27A 78%, #3A1630 100%)" }}>
      {/* promienie */}
      <div style={{ position: "absolute", left: 540 - 1100, top: sunY - 1100, width: 2200, height: 2200, borderRadius: "50%", background: "repeating-conic-gradient(rgba(255,230,180,0.18) 0 6deg, rgba(255,230,180,0) 6deg 18deg)", transform: `rotate(${rays}deg)`, WebkitMaskImage: "radial-gradient(closest-side, black 20%, transparent 75%)", maskImage: "radial-gradient(closest-side, black 20%, transparent 75%)", opacity: rise }} />
      {/* słońce */}
      <div style={{ position: "absolute", left: 540 - 230, top: sunY - 230 }}>
        <Glow blur={90} opacity={1}>
          <div style={{ width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #FFFFFF 0%, #FFE9B0 35%, #FFB347 100%)" }} />
        </Glow>
      </div>
      {/* góry na pierwszym planie */}
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <polygon points="0,1360 240,1180 420,1300 640,1080 860,1260 1080,1150 1080,1920 0,1920" fill="#2A0E2A" />
        <polygon points="0,1520 300,1400 560,1500 820,1380 1080,1480 1080,1920 0,1920" fill="#16061A" />
        {/* flaga na szczycie środkowej góry */}
        <rect x="636" y="980" width="8" height="104" fill="#16061A" />
        <polygon points="644,984 730,1012 644,1040" fill="#FFE3A3" />
      </svg>
      {/* telefon leży ekranem w dół na pierwszym planie */}
      <div style={{ position: "absolute", left: 120, top: 1610, width: 280, height: 56, borderRadius: 18, background: "#0B030C", transform: "rotate(-3deg)", boxShadow: "0 0 40px rgba(255,140,90,0.25)" }} />
      {/* napis */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: SANS, fontWeight: 700, color: "#FFF4E2", letterSpacing: 18 }}>
        <div style={{ fontSize: 92, opacity: t1, transform: `translateY(${(1 - t1) * 30}px)`, textShadow: "0 0 40px rgba(255,200,140,0.8)" }}>PHONE DOWN.</div>
        <div style={{ fontSize: 92, marginTop: 24, opacity: t2, transform: `translateY(${(1 - t2) * 30}px)`, color: "#FFE3A3", textShadow: "0 0 50px rgba(255,180,90,0.9)" }}>GOALS UP.</div>
      </div>
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
      <AbsoluteFill style={{ background: "#000", opacity: 1 - fadeEnd }} />
    </AbsoluteFill>
  );
};

export const Iskra: React.FC = () => {
  const f = useCurrentFrame();
  let scene: React.ReactNode;
  if (f < 108) scene = <PhoneScene f={f} />;
  else if (f < 126) scene = <ZoomScene f={f} />;
  else if (f < 234) scene = <StairsScene f={f} />;
  else scene = <SunScene f={f} />;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {scene}
      {/* winieta */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      <Grain frame={f} />
      <Audio src={staticFile("dzwieki/iskra.wav")} />
    </AbsoluteFill>
  );
};

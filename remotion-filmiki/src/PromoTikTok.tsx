// Filmik promocyjny 15 s (1080 × 1920) do gry „Tycoon, but every drop is RNG”.
// Sceny: 1) haczyk  2) maszyna i zwykłe dropy  3) LEGENDARY  4) SECRET z odliczaniem  5) tytuł + „zagraj”.
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Scenery } from "./Scenery";
import { Machine, Conveyor } from "./Machine";
import { Item } from "./Item";
import { Rays, Confetti } from "./Burst";
import { RARITY, outlined } from "./theme";

type Props = { gameName: string; cta: string };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ------------------------------------------------ 1) haczyk
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 9, stiffness: 160 } });
  const pop2 = spring({ frame: frame - 12, fps, config: { damping: 9, stiffness: 160 } });
  const shake = Math.sin(frame * 1.7) * interpolate(frame, [20, 60], [10, 0], clamp);
  return (
    <AbsoluteFill>
      <Scenery />
      <Machine squash={0} shakeX={0} />
      <div style={{ position: "absolute", top: 300, width: "100%", transform: `translateX(${shake}px) scale(${pop}) rotate(-4deg)`, ...outlined(150, "#FFC93C") }}>1 IN 1,000,000</div>
      <div style={{ position: "absolute", top: 470, width: "100%", transform: `scale(${pop2}) rotate(3deg)`, ...outlined(130) }}>DROP??</div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------ 2) maszyna i zwykłe dropy
const DROPS = [
  { at: 0, name: "COMMON", color: RARITY.Common },
  { at: 30, name: "UNCOMMON", color: RARITY.Uncommon },
  { at: 60, name: "RARE!", color: RARITY.Rare },
  { at: 90, name: "EPIC!", color: RARITY.Epic },
];
const NOZZLE = { x: 350, y: 1190 };

const Drops: React.FC = () => {
  const frame = useCurrentFrame();
  const cycle = frame % 30;
  const squash = interpolate(cycle, [0, 5, 9, 16], [0, 1, -0.6, 0], clamp);
  return (
    <AbsoluteFill>
      <Scenery />
      <Conveyor offset={frame * 6} />
      <Machine squash={squash} shakeX={0} />
      {DROPS.map((d, i) => {
        const t = frame - d.at;
        if (t < 3) return null;
        // lot łukiem z wylotu na taśmę, potem jazda w prawo
        const flight = interpolate(t, [3, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
        const x = interpolate(flight, [0, 1], [NOZZLE.x, 560]) + Math.max(0, t - 18) * 6;
        const y = NOZZLE.y - Math.sin(flight * Math.PI) * 260 + (flight >= 1 ? -Math.abs(Math.sin((t - 18) * 0.5)) * 20 * Math.max(0, 1 - (t - 18) / 12) : 0);
        const land = t >= 18 && t < 22 ? 0.85 : 1;
        const labelPop = interpolate(t, [16, 22], [0, 1], clamp);
        const big = i >= 2;
        return (
          <div key={d.name}>
            <Item x={x} y={y} rot={flight * 360 * (i % 2 ? -1 : 1)} color={d.color} scale={land} glow={big} />
            <div style={{ position: "absolute", left: x - 300, top: y - 190, width: 600, opacity: labelPop * interpolate(t, [40, 55], [1, 0], clamp), transform: `scale(${labelPop})`, ...outlined(big ? 90 : 70, d.color) }}>{d.name}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ------------------------------------------------ 3) LEGENDARY
const Legendary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shaking = frame < 30;
  const shakeX = shaking ? Math.sin(frame * 2.3) * interpolate(frame, [0, 30], [4, 18]) : 0;
  const burst = interpolate(frame, [30, 45], [0, 1], clamp);
  const pop = spring({ frame: frame - 32, fps, config: { damping: 8, stiffness: 140 } });
  const itemY = interpolate(frame, [30, 50], [1190, 940], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const flash = interpolate(frame, [30, 33, 40], [0, 0.8, 0], clamp);
  return (
    <AbsoluteFill>
      <Scenery />
      <Rays color={RARITY.Legendary} progress={burst} rotate={frame * 1.5} />
      <Machine squash={0} shakeX={shakeX} glow={shaking ? RARITY.Legendary : undefined} />
      {frame >= 30 ? <Item x={540} y={itemY} rot={Math.sin(frame / 6) * 10} color={RARITY.Legendary} scale={1.8 + Math.sin(frame / 8) * 0.08} glow /> : null}
      {frame >= 30 ? <Confetti frame={frame - 30} seed="leg" colors={["#FFC93C", "#FFF1B8", "#FF9A1F", "#FFFFFF"]} /> : null}
      <div style={{ position: "absolute", top: 330, width: "100%", transform: `scale(${pop}) rotate(-3deg)`, ...outlined(150, RARITY.Legendary) }}>LEGENDARY!</div>
      <div style={{ position: "absolute", top: 500, width: "100%", opacity: pop, ...outlined(80) }}>1 IN 400</div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------ 4) SECRET z odliczaniem
const Secret: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dim = interpolate(frame, [0, 12], [0, 0.75], clamp) * interpolate(frame, [60, 64], [1, 0.25], clamp);
  const count = frame >= 15 && frame < 60 ? 3 - Math.floor((frame - 15) / 15) : null;
  const countPop = count ? spring({ frame: (frame - 15) % 15, fps, config: { damping: 7, stiffness: 200 } }) : 0;
  const burst = interpolate(frame, [60, 72], [0, 1], clamp);
  const pop = spring({ frame: frame - 62, fps, config: { damping: 8, stiffness: 130 } });
  const hue = (frame * 12) % 360;
  return (
    <AbsoluteFill>
      <Scenery dim={dim} />
      {frame >= 60 ? <Rays color="#fff" progress={burst} rotate={-frame * 2} rainbow /> : null}
      <Machine squash={0} shakeX={frame < 60 ? Math.sin(frame * 3) * 6 : 0} />
      {count ? <div style={{ position: "absolute", top: 800, width: "100%", transform: `scale(${countPop})`, ...outlined(360) }}>{count}</div> : null}
      {frame >= 60 ? (
        <>
          <div style={{ filter: `hue-rotate(${hue}deg)` }}>
            <Item x={540} y={1000} rot={frame * 4} color="#FF4FD8" scale={2.2 * pop} glow />
          </div>
          <Confetti frame={frame - 60} seed="sec" colors={["#F0524B", "#FFC93C", "#5BE34A", "#3A8CFF", "#B064FF"]} />
          <div style={{ position: "absolute", top: 330, width: "100%", transform: `scale(${pop}) rotate(3deg)`, filter: `hue-rotate(${hue}deg)`, ...outlined(190, "#FF4FD8") }}>SECRET!!</div>
          <div style={{ position: "absolute", top: 1380, width: "100%", opacity: pop, ...outlined(90, "#FFFFFF") }}>1 IN 1,000,000</div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ------------------------------------------------ 5) tytuł + wezwanie do gry
const Outro: React.FC<Props> = ({ gameName, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 120 } });
  const btn = spring({ frame: frame - 15, fps, config: { damping: 7, stiffness: 160 } });
  const pulse = 1 + Math.sin(frame / 4) * 0.04;
  // „TYCOON, BUT EVERY DROP IS RNG” → „TYCOON,” / „BUT EVERY DROP” / „IS RNG”
  const [first, ...restParts] = gameName.split(", ");
  const rest = restParts.join(", ").split(" ");
  const lines = [first + (restParts.length ? "," : "")];
  for (let i = 0; i < rest.length; i += 3) lines.push(rest.slice(i, i + 3).join(" "));
  return (
    <AbsoluteFill>
      <Scenery />
      <Rays color="#FFE68A" progress={1} rotate={frame} />
      <div style={{ position: "absolute", top: 480, width: "100%", transform: `scale(${pop}) rotate(-3deg)` }}>
        {lines.map((w, i) => (
          <div key={i} style={{ ...outlined(i === 0 ? 180 : 120, i === 0 ? "#FFC93C" : "#FFFFFF"), marginBottom: 24 }}>{w}</div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1060, width: "100%", opacity: pop, ...outlined(60, "#FFFFFF") }}>MUTATIONS • FUSION • SECRET RECIPES</div>
      <div style={{ position: "absolute", left: 140, top: 1260, width: 800, height: 200, borderRadius: 50, background: "#5BE34A", border: "12px solid #111", boxShadow: "inset 0 -26px 0 #34A82A", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${btn * pulse})` }}>
        <div style={outlined(84)}>{cta}</div>
      </div>
    </AbsoluteFill>
  );
};

export const PromoTikTok: React.FC<Props> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#8FD3FF" }}>
      <Sequence durationInFrames={60}><Hook /></Sequence>
      <Sequence from={60} durationInFrames={120}><Drops /></Sequence>
      <Sequence from={180} durationInFrames={105}><Legendary /></Sequence>
      <Sequence from={285} durationInFrames={90}><Secret /></Sequence>
      <Sequence from={375} durationInFrames={75}><Outro {...props} /></Sequence>
    </AbsoluteFill>
  );
};

// Wybuch promieni i konfetti dla rzadkich dropów
import { random } from "remotion";

export const Rays: React.FC<{ color: string; progress: number; rotate: number; rainbow?: boolean }> = ({ color, progress, rotate, rainbow }) => {
  const bg = rainbow
    ? "repeating-conic-gradient(#F0524B 0 10deg, #FFC93C 10deg 20deg, #5BE34A 20deg 30deg, #3A8CFF 30deg 40deg, #B064FF 40deg 50deg, transparent 50deg 60deg)"
    : `repeating-conic-gradient(${color} 0 12deg, transparent 12deg 24deg)`;
  return (
    <div style={{ position: "absolute", left: 540 - 1200, top: 1000 - 1200, width: 2400, height: 2400, borderRadius: 1200, background: bg, opacity: 0.55 * progress, transform: `rotate(${rotate}deg) scale(${0.3 + progress * 0.7})`, maskImage: "radial-gradient(circle, #000 20%, transparent 65%)", WebkitMaskImage: "radial-gradient(circle, #000 20%, transparent 65%)" }} />
  );
};

export const Confetti: React.FC<{ frame: number; seed: string; colors: string[] }> = ({ frame, seed, colors }) => (
  <>
    {new Array(60).fill(0).map((_, i) => {
      const vx = (random(`${seed}x${i}`) - 0.5) * 34;
      const vy = -20 - random(`${seed}y${i}`) * 28;
      const t = frame;
      const x = 540 + vx * t;
      const y = 1000 + vy * t + 0.9 * t * t;
      const c = colors[i % colors.length];
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 26, height: 16, background: c, border: "4px solid #111", transform: `rotate(${t * 20 + i * 40}deg)` }} />;
    })}
  </>
);

// Klockowa maszyna dropiąca z taśmą (płaski widok z przodu)
import { COLORS } from "./theme";

export const Machine: React.FC<{ squash: number; shakeX: number; glow?: string }> = ({ squash, shakeX, glow }) => {
  const sx = 1 + squash * 0.08;
  const sy = 1 - squash * 0.1;
  const block = (extra: React.CSSProperties): React.CSSProperties => ({
    position: "absolute", border: "8px solid #111", borderRadius: 14, boxSizing: "border-box", ...extra,
  });
  return (
    <div style={{ position: "absolute", left: 140 + shakeX, top: 740, width: 420, height: 560, transform: `scale(${sx * 1.2}, ${sy * 1.2})`, transformOrigin: "50% 100%" }}>
      {glow ? <div style={{ position: "absolute", inset: -60, borderRadius: 60, background: glow, opacity: 0.35, filter: "blur(40px)" }} /> : null}
      <div style={block({ left: 40, top: 300, width: 340, height: 250, background: "#FF9A1F" })} />
      <div style={block({ left: 30, top: 340, width: 360, height: 40, background: COLORS.dark })} />
      <div style={block({ left: 80, top: 130, width: 260, height: 180, background: "#FFC93C" })} />
      <div style={block({ left: 120, top: 170, width: 180, height: 80, background: "#3FE0F2" })} />
      <div style={block({ left: 280, top: 30, width: 60, height: 110, background: "#5E656D" })} />
      <div style={block({ left: 150, top: 430, width: 120, height: 120, background: COLORS.dark })} />
      {/* lampki-wskaźniki */}
      <div style={{ position: "absolute", left: 100, top: 100, width: 34, height: 34, borderRadius: 20, background: "#7CFC00", border: "6px solid #111" }} />
      <div style={{ position: "absolute", left: 180, top: 100, width: 34, height: 34, borderRadius: 20, background: "#F0524B", border: "6px solid #111" }} />
    </div>
  );
};

export const Conveyor: React.FC<{ offset: number }> = ({ offset }) => (
  <div style={{ position: "absolute", left: 400, top: 1260, width: 720, height: 70, background: COLORS.belt, border: "8px solid #111", borderRadius: 10, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 30px, transparent 30px 60px)", backgroundPosition: `${offset}px 0` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, background: COLORS.rail }} />
  </div>
);

// Klockowy przedmiot z droppera, kolor = rzadkość
export const Item: React.FC<{ x: number; y: number; rot: number; color: string; scale?: number; glow?: boolean }> = ({ x, y, rot, color, scale = 1, glow }) => (
  <div style={{ position: "absolute", left: x - 60, top: y - 60, width: 120, height: 120, transform: `rotate(${rot}deg) scale(${scale})` }}>
    {glow ? <div style={{ position: "absolute", inset: -50, borderRadius: 100, background: color, opacity: 0.55, filter: "blur(30px)" }} /> : null}
    <div style={{ position: "absolute", inset: 0, background: color, border: "8px solid #111", borderRadius: 16 }} />
    <div style={{ position: "absolute", left: 18, top: 14, width: 34, height: 18, borderRadius: 6, background: "rgba(255,255,255,0.55)" }} />
    <div style={{ position: "absolute", left: 30, top: 50, width: 16, height: 22, background: "#111", borderRadius: 4 }} />
    <div style={{ position: "absolute", left: 74, top: 50, width: 16, height: 22, background: "#111", borderRadius: 4 }} />
  </div>
);

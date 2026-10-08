// Tło w stylu gry: niebo, ściana w szachownicę i trawa w szachownicę ze studsami
import { AbsoluteFill } from "remotion";
import { COLORS } from "./theme";

const studs = (alpha: number) =>
  `radial-gradient(circle at 50% 45%, rgba(255,255,255,${alpha}) 0 28%, rgba(0,0,0,0.12) 30% 34%, transparent 36%)`;

export const Scenery: React.FC<{ dim?: number }> = ({ dim = 0 }) => {
  return (
    <AbsoluteFill style={{ background: COLORS.sky }}>
      {/* ściana w szachownicę */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: 600, height: 700,
          backgroundColor: COLORS.wall1,
          backgroundImage: `${studs(0.18)}, repeating-conic-gradient(${COLORS.wall1} 0 25%, ${COLORS.wall2} 0 50%)`,
          backgroundSize: "40px 40px, 320px 320px",
        }}
      />
      {/* trawa na górze ściany */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 580, height: 40, background: "#7EDB55", borderBottom: "6px solid #4E9440" }} />
      {/* podłoga z trawy */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: 1300, bottom: 0,
          backgroundColor: COLORS.grass1,
          backgroundImage: `${studs(0.2)}, repeating-conic-gradient(${COLORS.grass1} 0 25%, ${COLORS.grass2} 0 50%)`,
          backgroundSize: "40px 40px, 360px 360px",
        }}
      />
      {dim > 0 ? <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} /> : null}
    </AbsoluteFill>
  );
};

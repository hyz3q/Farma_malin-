// Wspólne klocki stylu „vintage poster” (wzór @mondayschallenge): paleta, ziarno papieru,
// drżenie „boil”, tytuł z czarną ekstruzją i małe obiekty, które wybuchają przy uderzeniu.
import { random } from "remotion";
import { FONT } from "./theme";

// Paleta ze wzoru: kremowy papier, palony pomarańcz, jasny pomarańcz, czerń, piaskowa żółć
export const C = {
  paper: "#F8E2BC",
  orange: "#DD5A1E",
  orangeLight: "#EC8550",
  orangeDeep: "#B9431A",
  cream: "#FBE8C4",
  ink: "#1C1915",
  sand: "#F3D088",
};
export const SANS = "'DejaVu Sans', Arial, Helvetica, sans-serif";

// drżenie ręcznie rysowanej animacji („boil”) – inne przy każdej klatce
export const boil = (seed: string, frame: number, amp = 3) => ({
  x: (random(`${seed}x${frame}`) - 0.5) * amp * 2,
  y: (random(`${seed}y${frame}`) - 0.5) * amp * 2,
  r: (random(`${seed}r${frame}`) - 0.5) * amp,
});

// ------------------------------------------------ tekstura papieru i ziarno
export const Grain: React.FC<{ id: string; opacity: number }> = ({ id, opacity }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity }}>
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#${id})`} />
  </svg>
);

// ------------------------------------------------ małe obiekty wokół (wybuchają przy uderzeniu)
export const Bolt: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={150 * s} height={150 * s} viewBox="0 0 100 100">
    <polygon points="44,6 16,56 42,56 30,94 84,36 56,36 70,6" fill={C.ink} transform="translate(7,7)" />
    <polygon points="44,6 16,56 42,56 30,94 84,36 56,36 70,6" fill={C.sand} />
  </svg>
);
export const Stopwatch: React.FC = () => (
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
export const Hourglass: React.FC = () => (
  <svg width="120" height="150" viewBox="0 0 80 100">
    <polygon points="14,10 70,10 46,50 70,90 14,90 38,50" fill={C.ink} transform="translate(6,4)" />
    <polygon points="10,8 66,8 42,50 66,92 10,92 34,50" fill={C.cream} />
    <polygon points="22,20 54,20 38,44" fill={C.orange} />
    <polygon points="38,62 58,86 18,86" fill={C.orange} />
  </svg>
);
export const Dice: React.FC = () => (
  <svg width="140" height="140" viewBox="0 0 100 100">
    <rect x="18" y="18" width="70" height="70" rx="10" fill={C.ink} />
    <rect x="10" y="10" width="70" height="70" rx="10" fill="#FFF6E4" />
    {[[28, 28], [62, 28], [45, 45], [28, 62], [62, 62]].map(([x, y], i) => (
      <rect key={i} x={x - 5} y={y - 5} width="10" height="10" fill={C.ink} />
    ))}
  </svg>
);
export const Coin: React.FC = () => (
  <svg width="120" height="120" viewBox="0 0 100 100">
    <circle cx="56" cy="56" r="38" fill={C.ink} />
    <circle cx="48" cy="48" r="38" fill={C.sand} />
    <circle cx="48" cy="48" r="26" fill="none" stroke={C.orange} strokeWidth="6" />
    <rect x="44" y="30" width="8" height="36" fill={C.orange} />
  </svg>
);
export const Sparkle: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <polygon points="50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40" fill="#FFFFFF" />
  </svg>
);
export const Cursor: React.FC = () => (
  <svg width="140" height="170" viewBox="0 0 70 85">
    <polygon points="6,6 6,64 22,50 34,78 46,72 34,46 56,46" fill={C.ink} transform="translate(4,4)" />
    <polygon points="6,6 6,64 22,50 34,78 46,72 34,46 56,46" fill="#FFFFFF" />
  </svg>
);
export const PixelTile: React.FC = () => (
  <svg width="110" height="110" viewBox="0 0 50 50">
    <rect x="6" y="6" width="44" height="44" fill={C.ink} />
    <rect x="2" y="2" width="44" height="44" fill="#FFFFFF" />
    {[[2, 2], [24, 2], [13, 13], [35, 13], [2, 24], [24, 24], [13, 35], [35, 35]].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="11" height="11" fill={C.ink} />
    ))}
  </svg>
);

// ------------------------------------------------ tytuł z czarną ekstruzją 3D i rastrem
export const Title: React.FC<{ text: string; size: number; fill: string }> = ({ text, size, fill }) => {
  const depth = Math.round(size / 9);
  const shadow = new Array(depth).fill(0).map((_, i) => `${-(i + 1) * 0.6}px ${i + 1}px 0 ${C.ink}`).join(", ");
  return (
    <div style={{ fontFamily: FONT, fontSize: size, lineHeight: 0.95, color: fill, textShadow: shadow, letterSpacing: 2, textAlign: "center", whiteSpace: "nowrap" }}>{text}</div>
  );
};


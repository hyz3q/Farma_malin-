// Kolory i czcionka – te same co w grze (master prompt, sekcje 4 i 10)
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT = "Lilita One";
loadFont({ family: FONT, url: staticFile("fonts/LilitaOne.woff2") });

export const RARITY = {
  Common: "#B8BCC2",
  Uncommon: "#5BE34A",
  Rare: "#3A8CFF",
  Epic: "#B064FF",
  Legendary: "#FFC93C",
  Mythic: "#F0524B",
};

export const COLORS = {
  grass1: "#6CC24A",
  grass2: "#5DB23F",
  wall1: "#E8954A",
  wall2: "#D9803A",
  sky: "#8FD3FF",
  dark: "#2B2D33",
  belt: "#2B2D33",
  rail: "#FFC93C",
};

// Tekst z grubym czarnym obrysem jak w grach Roblox
export const outlined = (size: number, color = "#fff") => ({
  fontFamily: FONT,
  fontSize: size,
  color,
  WebkitTextStroke: `${Math.round(size / 9)}px #111`,
  paintOrder: "stroke fill" as const,
  textShadow: `0 ${Math.round(size / 14)}px 0 #111`,
  lineHeight: 1,
  textAlign: "center" as const,
});

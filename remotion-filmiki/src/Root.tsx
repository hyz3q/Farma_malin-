// Lista filmików (kompozycji). Każda <Composition> to osobny filmik do podglądu i renderu.
import { Composition } from "remotion";
import { PromoTikTok } from "./PromoTikTok";
import { Motywacja } from "./Motywacja";
import { TelefonVsCele } from "./TelefonVsCele";
import { Iskra } from "./Iskra";
import { Iskra3D } from "./Iskra3D";
import { Reel } from "./Reel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoTikTok"
        component={PromoTikTok}
        durationInFrames={450} // 15 s przy 30 fps
        fps={30}
        width={1080}
        height={1920} // pionowy format: TikTok, YouTube Shorts, Reels
        defaultProps={{
          gameName: "TYCOON, BUT EVERY DROP IS RNG",
          cta: "PLAY NOW ON ROBLOX!",
        }}
      />
      <Composition
        id="Motywacja"
        component={Motywacja}
        durationInFrames={180} // 15 s przy 12 fps – tempo jak we wzorze
        fps={12}
        width={1080}
        height={1080} // kwadrat jak wzór (Instagram / TikTok)
        defaultProps={{
          handle: "@rngtycoon",
          issue: "#01",
          theme: "Motivation",
          title: "KEEP GOING!",
          subtitle: "ONE DROP AT A TIME",
        }}
      />
      <Composition
        id="TelefonVsCele"
        component={TelefonVsCele}
        durationInFrames={720} // 60 s przy 12 fps = 12 scen po 5 s
        fps={12}
        width={1080}
        height={1920} // pionowo: TikTok, Shorts, Reels
        defaultProps={{
          handle: "@rngtycoon",
          theme: "Phone vs Goals",
        }}
      />
      <Composition
        id="Iskra"
        component={Iskra}
        durationInFrames={360} // 12 s przy 30 fps – płynny ruch jak w filmowym motion designie
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Iskra3D"
        component={Iskra3D}
        durationInFrames={360} // 12 s, ta sama historia i dźwięk co Iskra, ale prawdziwe 3D (Three.js)
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Reel"
        component={Reel}
        durationInFrames={720} // 24 s – showreel: 8 technik, 120 BPM
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

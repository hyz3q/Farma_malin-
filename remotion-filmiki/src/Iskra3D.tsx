// „ISKRA 3D” – ta sama historia i dźwięk co Iskra, ale w prawdziwym 3D (Three.js) z ruchomą kamerą
// i żywymi, nasyconymi kolorami. Wszystko sterowane klatką (useCurrentFrame) – bez useFrame.
//   0– 72  noc: telefon 3D świeci, kamera okrąża go i podjeżdża, obok mały płomyk
//  72–108  telefon gaśnie, świat robi się gorący (czerwień/pomarańcz), płomyk rośnie
// 108–126  kamera wlatuje w płomyk
// 126–234  spiralne schody 3D: co takt zapala się stopień, kamera wznosi się i krąży
// 234–252  błysk
// 252–360  góry low-poly, wschodzi słońce, kamera jedzie w górę; napis
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Easing, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const BEAT = 18;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.2, 1);
const lerp = (f: number, a: number, b: number, from: number, to: number, e: (n: number) => number = ease) => interpolate(f, [a, b], [from, to], { ...cl, easing: e });
const SANS = "'DejaVu Sans', Arial, Helvetica, sans-serif";

// ------------------------------------------------ kamera sterowana klatką
const Cam: React.FC<{ pos: [number, number, number]; look: [number, number, number]; fov?: number }> = ({ pos, look, fov = 40 }) => {
  const { camera } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  cam.position.set(...pos);
  cam.fov = fov;
  cam.lookAt(...look);
  cam.updateProjectionMatrix();
  return null;
};

// ------------------------------------------------ poświata = sprite z miękkim gradientem (addytywnie)
const useGlowTexture = () =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.25, "rgba(255,255,255,0.55)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);

const Halo: React.FC<{ color: string; size: number; opacity?: number; position?: [number, number, number] }> = ({ color, size, opacity = 1, position = [0, 0, 0] }) => {
  const tex = useGlowTexture();
  return (
    <sprite position={position} scale={[size, size, size]}>
      <spriteMaterial map={tex} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
    </sprite>
  );
};

// ------------------------------------------------ płomyk 3D (bryła obrotowa w kształcie kropli)
const flameProfile = (w: number, h: number) => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const y = t * h;
    const r = w * Math.sin(Math.PI * Math.pow(1 - t, 0.75)) * (1 - t * 0.15) * (t < 0.5 ? 0.6 + t : 1.1 - (t - 0.5) * 0.4);
    pts.push(new THREE.Vector2(Math.max(0.0001, r * (1 - Math.pow(t, 3))), y));
  }
  return pts;
};
const Flame: React.FC<{ frame: number; scale: number; position: [number, number, number]; light?: number }> = ({ frame, scale, position, light = 6 }) => {
  const outer = useMemo(() => new THREE.LatheGeometry(flameProfile(0.5, 1.6), 32), []);
  const inner = useMemo(() => new THREE.LatheGeometry(flameProfile(0.28, 0.9), 24), []);
  const fl = 1 + Math.sin(frame * 0.9) * 0.06 + (random(`f${frame}`) - 0.5) * 0.08;
  return (
    <group position={position} scale={[scale, scale * fl, scale]} rotation={[0, frame * 0.08, Math.sin(frame * 0.3) * 0.08]}>
      <mesh geometry={outer}>
        <meshBasicMaterial color="#FF5A00" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
      </mesh>
      <mesh geometry={inner} position={[0, 0.04, 0]}>
        <meshBasicMaterial color="#FFF3B0" fog={false} />
      </mesh>
      <Halo color="#FF8A1F" size={4.2} opacity={0.9} position={[0, 0.7, 0]} />
      <Halo color="#FFD27A" size={1.8} opacity={0.8} position={[0, 0.6, 0]} />
      <pointLight color="#FF8A2B" intensity={light} distance={14} decay={1.5} position={[0, 0.8, 0.4]} />
    </group>
  );
};

// ------------------------------------------------ telefon 3D (zaokrąglony, z fazą)
const usePhoneGeo = () =>
  useMemo(() => {
    const w = 1.6, h = 3.2, r = 0.28;
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return new THREE.ExtrudeGeometry(s, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 4, curveSegments: 12 });
  }, []);

const Phone: React.FC<{ frame: number; on: boolean }> = ({ frame, on }) => {
  const geo = usePhoneGeo();
  const scroll = (frame * 0.05) % 0.6;
  return (
    <group>
      <mesh geometry={geo} position={[0, 0, -0.07]}>
        <meshStandardMaterial color={on ? "#1B1446" : "#1A0A08"} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* ekran */}
      <mesh position={[0, 0, 0.14]}>
        <planeGeometry args={[1.42, 2.95]} />
        <meshBasicMaterial color={on ? "#19D9FF" : "#050203"} />
      </mesh>
      {on
        ? [...new Array(6)].map((_, i) => {
            const y = 1.25 - i * 0.6 + scroll;
            if (y > 1.3 || y < -1.3) return null;
            return (
              <mesh key={i} position={[0, y, 0.15]}>
                <planeGeometry args={[1.15, 0.42]} />
                <meshBasicMaterial color={i % 2 ? "#FF4FD8" : "#E9FCFF"} />
              </mesh>
            );
          })
        : null}
      {on ? <Halo color="#2BC8FF" size={7} opacity={0.75} position={[0, 0, -0.4]} /> : null}
      {on ? <pointLight color="#3BD5FF" intensity={10} distance={10} position={[0, 0, 1.2]} /> : null}
    </group>
  );
};

// ------------------------------------------------ UJĘCIA 1–3
const NightScene: React.FC<{ f: number }> = ({ f }) => {
  const on = f < 72;
  // kamera: łuk z boku na przód i podjazd; po zgaśnięciu – najazd na płomyk; potem wlot w płomyk
  const ang = lerp(f, 0, 72, -0.75, 0.15, Easing.inOut(Easing.sin));
  const dist = on ? lerp(f, 0, 72, 12.5, 10, Easing.linear) : lerp(f, 72, 108, 11, 6);
  const target: [number, number, number] = on ? [0.95, -0.2, 0] : [lerp(f, 72, 108, 0.95, 1.9), lerp(f, 72, 108, -0.2, -0.9), lerp(f, 72, 108, 0, 0.6)];
  let pos: [number, number, number] = [target[0] + Math.sin(ang) * dist, 1.4 + (on ? 0 : lerp(f, 72, 108, 0, -1.6)), Math.cos(ang) * dist];
  if (f >= 108) {
    const k = lerp(f, 108, 126, 0, 1, Easing.in(Easing.cubic));
    const flame: [number, number, number] = [1.9, -0.9, 0.6];
    pos = [pos[0] + (flame[0] - pos[0]) * k * 0.97, pos[1] + (flame[1] - pos[1]) * k * 0.97, pos[2] + (flame[2] - pos[2]) * k * 0.97];
  }
  const flameScale = on ? 0.5 : lerp(f, 72, 108, 0.5, 0.85, Easing.out(Easing.back(2)));
  return (
    <>
      <Cam pos={pos} look={target} />
      <fog attach="fog" args={[on ? "#2A0A6B" : "#5A0A00", 8, 22]} />
      <ambientLight intensity={on ? 0.5 : 0.25} color={on ? "#8A5BFF" : "#FF5A2A"} />
      <directionalLight position={[-4, 6, 3]} intensity={on ? 1.2 : 0.4} color={on ? "#C77DFF" : "#FF8A5B"} />
      {/* blat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.62, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={on ? "#3B1A8F" : "#4A0F05"} roughness={0.35} metalness={0.4} />
      </mesh>
      <group position={[0, 0, 0]} rotation={[0, -0.25, 0]}>
        <Phone frame={f} on={on} />
      </group>
      <Flame frame={f} scale={flameScale} position={[1.9, -1.62, 0.6]} light={on ? 4 : lerp(f, 72, 108, 4, 14)} />
    </>
  );
};

// ------------------------------------------------ UJĘCIE 4: spiralne schody
const STEPS = 7;
const stepAt = (k: number): [number, number, number] => {
  const a = k * 0.8;
  return [Math.cos(a) * 2.4, k * 0.75, Math.sin(a) * 2.4];
};
const StairsScene: React.FC<{ f: number }> = ({ f }) => {
  const local = f - 126;
  const beat = local / BEAT;
  const lit = Math.min(STEPS, Math.floor(beat) + 1);
  const i = Math.min(STEPS - 1, Math.floor(beat));
  const ph = beat - Math.floor(beat);
  const hop = i === 0 ? 1 : lerp(ph, 0, 0.45, 0, 1, Easing.out(Easing.quad));
  const a = stepAt(Math.max(0, i - 1));
  const b = stepAt(i);
  const fx = a[0] + (b[0] - a[0]) * hop;
  const fz = a[2] + (b[2] - a[2]) * hop;
  const fy = a[1] + (b[1] - a[1]) * hop + Math.sin(hop * Math.PI) * 0.9 + 0.2;
  // kamera krąży wokół wieży i wznosi się razem z płomykiem
  const orbit = lerp(local, 0, 108, -0.4, 2.6, Easing.inOut(Easing.sin));
  const camH = lerp(local, 0, 108, 0.4, 4.6, Easing.inOut(Easing.sin));
  const pos: [number, number, number] = [Math.cos(orbit) * 13, camH + 3, Math.sin(orbit) * 13];
  return (
    <>
      <Cam pos={pos} look={[0, camH + 0.3, 0]} fov={45} />
      <fog attach="fog" args={["#0A4BD6", 10, 30]} />
      <ambientLight intensity={0.55} color="#7FE7FF" />
      <directionalLight position={[6, 12, 4]} intensity={1.3} color="#B8F3FF" />
      <directionalLight position={[-6, 3, -4]} intensity={0.8} color="#FF4FD8" />
      {/* słup w środku */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.45, 0.6, 6, 8]} />
        <meshStandardMaterial color="#2A1FA8" flatShading roughness={0.6} />
      </mesh>
      {/* wyspa pod spodem */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[4.4, 2.2, 1.6, 9]} />
        <meshStandardMaterial color="#1E9E8C" flatShading />
      </mesh>
      {[...new Array(STEPS)].map((_, k) => {
        const p = stepAt(k);
        const on = k < lit;
        const pop = on ? lerp(local, k * BEAT, k * BEAT + 6, 0.4, 1, Easing.out(Easing.back(3))) : 1;
        return (
          <group key={k} position={p} rotation={[0, -k * 0.8, 0]}>
            <mesh scale={[1, on ? pop : 1, 1]}>
              <boxGeometry args={[1.5, 0.35, 1.3]} />
              <meshStandardMaterial color={on ? "#FFD23F" : "#3B2FC9"} emissive={on ? "#FF9F1C" : "#000000"} emissiveIntensity={on ? 0.9 : 0} flatShading />
            </mesh>
            {on ? <Halo color="#FFB703" size={3} opacity={0.55} position={[0, 0.3, 0]} /> : null}
          </group>
        );
      })}
      {/* flaga nad ostatnim stopniem */}
      <group position={[stepAt(STEPS - 1)[0], stepAt(STEPS - 1)[1] + 0.2, stepAt(STEPS - 1)[2]]}>
        <mesh position={[0.4, 1.1, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2.2, 6]} />
          <meshStandardMaterial color="#1B1446" />
        </mesh>
        <mesh position={[0.95, 1.85, 0]} rotation={[0, 0, Math.sin(f * 0.25) * 0.1]}>
          <coneGeometry args={[0.45, 1.1, 3]} />
          <meshStandardMaterial color={lit >= STEPS ? "#FF2E93" : "#5B4BFF"} emissive={lit >= STEPS ? "#FF2E93" : "#000"} emissiveIntensity={0.6} flatShading />
        </mesh>
      </group>
      <Flame frame={f} scale={0.42} position={[fx, fy, fz]} light={10} />
    </>
  );
};

// ------------------------------------------------ UJĘCIE 6: góry i wschód słońca
const PEAKS: { x: number; z: number; h: number; r: number; c: string }[] = [
  { x: 0, z: -8, h: 5, r: 3.6, c: "#7A1FA2" },
  { x: -6, z: -9, h: 5.5, r: 4.2, c: "#5B0E91" },
  { x: 6.5, z: -8, h: 6, r: 4.5, c: "#5B0E91" },
  { x: -3.5, z: -1.5, h: 3, r: 3, c: "#9D1F8C" },
  { x: 4, z: -1, h: 3.4, r: 3.2, c: "#9D1F8C" },
  { x: -10, z: -4, h: 4, r: 3.5, c: "#7A1FA2" },
  { x: 10, z: -3, h: 4.2, r: 3.6, c: "#7A1FA2" },
];
const SunScene: React.FC<{ f: number }> = ({ f }) => {
  const local = f - 234;
  const rise = lerp(local, 10, 120, 0, 1, Easing.out(Easing.cubic));
  const camY = lerp(local, 0, 126, 1.5, 4.5, Easing.inOut(Easing.sin));
  const camZ = lerp(local, 0, 126, 20, 15, Easing.linear);
  const camX = lerp(local, 0, 126, -2.5, 1.5, Easing.inOut(Easing.sin));
  return (
    <>
      <Cam pos={[camX, camY, camZ]} look={[0, 3.5 + rise * 1.5, -8]} fov={42} />
      <fog attach="fog" args={["#FF5E62", 14, 40]} />
      <ambientLight intensity={0.6} color="#FFB3C7" />
      <directionalLight position={[0, 6, -20]} intensity={2.2} color="#FFC46B" />
      <directionalLight position={[8, 6, 10]} intensity={0.6} color="#FF4FD8" />
      {/* słońce */}
      <group position={[0, -3 + rise * 11, -30]}>
        <mesh>
          <sphereGeometry args={[4, 32, 32]} />
          <meshBasicMaterial color="#FFF1A8" fog={false} />
        </mesh>
        <Halo color="#FFB703" size={26} opacity={0.9} />
        <Halo color="#FF4FD8" size={46} opacity={0.35} />
      </group>
      {PEAKS.map((p, k) => (
        <mesh key={k} position={[p.x, p.h / 2 - 1, p.z]} rotation={[0, k * 0.7, 0]}>
          <coneGeometry args={[p.r, p.h, 5]} />
          <meshStandardMaterial color={p.c} flatShading roughness={0.8} />
        </mesh>
      ))}
      {/* flaga na najwyższym szczycie */}
      <group position={[0, 3.9, -8]}>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.8, 6]} />
          <meshStandardMaterial color="#2E0854" />
        </mesh>
        <mesh position={[0.55, 1.4, 0]} rotation={[0, 0, Math.sin(f * 0.25) * 0.12 - Math.PI / 2]}>
          <coneGeometry args={[0.35, 1.0, 3]} />
          <meshStandardMaterial color="#FFE66D" emissive="#FFB703" emissiveIntensity={0.7} flatShading />
        </mesh>
      </group>
      {/* ziemia */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#3D0A5C" roughness={0.9} />
      </mesh>
      {/* telefon leży ekranem w dół na pierwszym planie */}
      <mesh position={[-1.8, -0.9, 10]} rotation={[-Math.PI / 2, 0, 0.5]}>
        <boxGeometry args={[0.8, 1.6, 0.12]} />
        <meshStandardMaterial color="#1A0A2A" metalness={0.5} roughness={0.4} />
      </mesh>
    </>
  );
};

// tło za płótnem 3D (żywe gradienty) – zmienia się z ujęciem
const bgFor = (f: number) => {
  if (f < 72) return "linear-gradient(180deg,#12003A 0%, #4B0FB8 45%, #9B2BE0 70%, #2A0A6B 100%)";
  if (f < 126) return "radial-gradient(circle at 60% 60%, #FF7A00 0%, #C21500 40%, #3A0300 100%)";
  if (f < 234) return "linear-gradient(180deg,#0A1A6B 0%, #0A4BD6 40%, #00C2D1 75%, #6FFFE9 100%)";
  return "linear-gradient(180deg,#3A0CA3 0%, #B5179E 30%, #FF5E62 58%, #FF9F1C 78%, #FFD166 100%)";
};

export const Iskra3D: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const flashIn = f >= 126 && f < 134 ? lerp(f, 126, 134, 1, 0, Easing.linear) : 0;
  const preFlash = f >= 120 && f < 126 ? lerp(f, 120, 126, 0, 1, Easing.linear) : 0;
  const local = f - 234;
  const flash = f >= 234 && f < 252 ? lerp(local, 0, 4, 0, 1, Easing.linear) * lerp(local, 6, 18, 1, 0) : 0;
  const t1 = lerp(local, 66, 80, 0, 1, Easing.out(Easing.cubic));
  const t2 = lerp(local, 90, 104, 0, 1, Easing.out(Easing.cubic));
  const fadeEnd = lerp(f, 352, 360, 0, 1, Easing.linear);
  return (
    <AbsoluteFill style={{ background: bgFor(f) }}>
      <ThreeCanvas width={width} height={height} flat gl={{ antialias: true, alpha: true }}>
        {f < 126 ? <NightScene f={f} /> : f < 234 ? <StairsScene f={f} /> : <SunScene f={f} />}
      </ThreeCanvas>
      {f >= 234 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: SANS, fontWeight: 700, color: "#FFFFFF", letterSpacing: 18 }}>
          <div style={{ fontSize: 96, opacity: t1, transform: `translateY(${(1 - t1) * 40}px) scale(${0.9 + t1 * 0.1})`, textShadow: "0 0 30px #FF4FD8, 0 0 60px #FF9F1C" }}>PHONE DOWN.</div>
          <div style={{ fontSize: 96, marginTop: 24, opacity: t2, transform: `translateY(${(1 - t2) * 40}px) scale(${0.9 + t2 * 0.1})`, color: "#FFE66D", textShadow: "0 0 40px #FF9F1C, 0 0 80px #FF4FD8" }}>GOALS UP.</div>
        </div>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)" }} />
      <AbsoluteFill style={{ background: "#FFB347", opacity: Math.max(flashIn, preFlash) }} />
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
      <AbsoluteFill style={{ background: "#000", opacity: fadeEnd }} />
      <Audio src={staticFile("dzwieki/iskra.wav")} />
    </AbsoluteFill>
  );
};

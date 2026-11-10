import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import TL from './timeline.json';

const OV = TL.overlap;
const IVORY = '#FBF5EA';
const INK = '#3A2A1C';
const GOLD_GRAD =
  'linear-gradient(100deg,#9C6B1E 0%,#D9AE4E 22%,#FFF0B8 38%,#E3B95A 52%,#A8741C 70%,#F3D27A 86%,#B88A2E 100%)';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const img = (n: number, blur = false) => staticFile(`img/p${n}${blur ? '_blur' : ''}.jpg`);

/* ---------- Photo with Ken Burns ---------- */
const Photo: React.FC<{
  n: number;
  dur: number;
  fx?: number;
  fy?: number;
  from?: number;
  to?: number;
  panX?: number;
  panY?: number;
  style?: React.CSSProperties;
}> = ({n, dur, fx = 50, fy = 50, from = 1.0, to = 1.12, panX = 0, panY = 0, style}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], clamp);
  const s = from + (to - from) * t;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', ...style}}>
      <Img
        src={img(n)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${fx}% ${fy}%`,
          transform: `translate(${panX * t}px,${panY * t}px) scale(${s})`,
          transformOrigin: `${fx}% ${fy}%`,
        }}
      />
    </div>
  );
};

/* ---------- Gold script text with wipe-in + shimmer ---------- */
const Script: React.FC<{
  text: string;
  at: number;
  size: number;
  top: number;
  dur?: number;
  color?: 'gold' | 'ivory';
  glow?: boolean;
}> = ({text, at, size, top, dur = 28, color = 'gold', glow = true}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], {...clamp, easing: ease});
  const shimmer = interpolate(f, [at, at + 120], [0, 100], clamp);
  const blur = interpolate(p, [0, 1], [10, 0]);
  const fill =
    color === 'gold'
      ? {
          backgroundImage: GOLD_GRAD,
          backgroundSize: '250% 100%',
          backgroundPosition: `${100 - shimmer}% 50%`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }
      : {color: '#FFF8EC'};
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        textAlign: 'center',
        fontFamily: 'GreatVibes',
        fontSize: size,
        lineHeight: 1.15,
        padding: '0 40px',
        WebkitMaskImage: `linear-gradient(90deg,#000 ${p * 120 - 20}%,transparent ${p * 120}%)`,
        maskImage: `linear-gradient(90deg,#000 ${p * 120 - 20}%,transparent ${p * 120}%)`,
        filter: `blur(${blur}px) ${glow ? 'drop-shadow(0 4px 14px rgba(60,30,0,.45))' : ''}`,
        transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      <span style={{...fill, padding: '0 .2em'}}>{text}</span>
    </div>
  );
};

/* ---------- Serif line, word by word ---------- */
const Words: React.FC<{
  text: string;
  at: number;
  top: number;
  size?: number;
  color?: string;
  italic?: boolean;
  caps?: boolean;
  stagger?: number;
  shadow?: boolean;
}> = ({text, at, top, size = 52, color = '#FFF8EC', italic = true, caps = false, stagger = 4, shadow = true}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top,
        textAlign: 'center',
        fontFamily: caps ? 'Cinzel' : 'Cormorant',
        fontStyle: italic && !caps ? 'italic' : 'normal',
        fontWeight: caps ? 500 : 500,
        fontSize: size,
        letterSpacing: caps ? size * 0.32 : 0.5,
        color,
        lineHeight: 1.25,
        textShadow: shadow ? '0 2px 16px rgba(30,15,0,.65)' : 'none',
      }}
    >
      {words.map((w, i) => {
        const p = interpolate(f, [at + i * stagger, at + i * stagger + 18], [0, 1], {...clamp, easing: ease});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${(1 - p) * 22}px)`,
              filter: `blur(${(1 - p) * 6}px)`,
              marginRight: caps ? 0 : '0.28em',
            }}
          >
            {w}
            {caps && i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- Ornament divider (drawn) ---------- */
const Ornament: React.FC<{at: number; top: number; width?: number; color?: string}> = ({
  at,
  top,
  width = 520,
  color = '#E6C06A',
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 30], [0, 1], {...clamp, easing: ease});
  const half = width / 2 - 40;
  return (
    <svg
      width={width}
      height={40}
      viewBox={`0 0 ${width} 40`}
      style={{position: 'absolute', top, left: (1080 - width) / 2, overflow: 'visible'}}
    >
      <line x1={width / 2 - 34} y1={20} x2={width / 2 - 34 - half * p} y2={20} stroke={color} strokeWidth={2.5} />
      <line x1={width / 2 + 34} y1={20} x2={width / 2 + 34 + half * p} y2={20} stroke={color} strokeWidth={2.5} />
      <g
        transform={`translate(${width / 2} 20) rotate(${45 + (1 - p) * 180}) scale(${p})`}
        opacity={p}
      >
        <rect x={-11} y={-11} width={22} height={22} fill="none" stroke={color} strokeWidth={2.5} />
        <rect x={-5} y={-5} width={10} height={10} fill={color} />
      </g>
      <circle cx={width / 2 - 24} cy={20} r={3 * p} fill={color} />
      <circle cx={width / 2 + 24} cy={20} r={3 * p} fill={color} />
    </svg>
  );
};

const BottomShade: React.FC<{strength?: number; from?: number}> = ({strength = 0.7, from = 45}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg,rgba(20,10,0,0) ${from}%,rgba(30,14,2,${strength * 0.6}) ${from + 22}%,rgba(20,8,0,${strength}) 100%)`,
    }}
  />
);

/* ---------- Scene wrapper: crossfade + slight zoom in ---------- */
const SceneIn: React.FC<{children: React.ReactNode; first?: boolean}> = ({children, first}) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, OV], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const s = first ? 1 : interpolate(f, [0, OV], [1.06, 1], {...clamp, easing: ease});
  return <AbsoluteFill style={{opacity: o, transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

/* ---------- Print card (ivory border) ---------- */
const Card: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  border?: number;
  style?: React.CSSProperties;
}> = ({children, x, y, w, h, rot = 0, border = 18, style}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      transform: `rotate(${rot}deg)`,
      background: '#FFFBF2',
      padding: border,
      boxSizing: 'border-box',
      boxShadow: '0 30px 60px rgba(40,20,0,.38), 0 6px 14px rgba(40,20,0,.25)',
      ...style,
    }}
  >
    <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden', outline: '2px solid #D4AA55', outlineOffset: -10}}>
      {children}
    </div>
  </div>
);

/* ===================== SCENES ===================== */

// 1. Arch reveal + title
const SceneArch: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: f - 2, fps, config: {damping: 16, mass: 0.9}});
  const ex = interpolate(f, [dur - 26, dur + OV], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const W = interpolate(ex, [0, 1], [760, 1080]);
  const H = interpolate(ex, [0, 1], [1080, 1920]);
  const R = interpolate(ex, [0, 1], [380, 0]);
  const top = interpolate(ex, [0, 1], [430, 0]);
  const textO = interpolate(ex, [0, 0.35], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: IVORY}}>
      <Img src={img(9, true)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%,rgba(251,245,234,.35),rgba(251,245,234,.85) 75%)'}} />
      {/* outer thin arch */}
      <div
        style={{
          position: 'absolute',
          left: (1080 - W) / 2 - 26,
          top: top - 26,
          width: W + 52,
          height: H + 52,
          borderRadius: `${R + 26}px ${R + 26}px 30px 30px`,
          border: '2px solid #C99A3E',
          opacity: textO * pop,
          transform: `scale(${0.9 + 0.1 * pop})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: (1080 - W) / 2,
          top,
          width: W,
          height: H,
          borderRadius: `${R}px ${R}px ${ex > 0.9 ? 0 : 14}px ${ex > 0.9 ? 0 : 14}px`,
          overflow: 'hidden',
          boxShadow: `0 0 0 ${6 * (1 - ex)}px #D8B35E, 0 40px 80px rgba(70,40,0,${0.35 * (1 - ex)})`,
          transform: `scale(${0.82 + 0.18 * pop})`,
          opacity: pop,
        }}
      >
        <Photo n={9} dur={dur + OV} fx={52} fy={45} from={1.18} to={1.0} />
      </div>
      <div style={{opacity: textO}}>
        <Words text="WALIMATULURUS" at={4} top={150} size={36} color="#9A6E25" caps shadow={false} stagger={2} />
        <Script text="Raja Sehari" at={14} size={150} top={205} glow={false} />
        <Ornament at={40} top={1600} color="#B9893A" />
        <Words text="Sebuah kisah cinta bermula" at={44} top={1660} size={50} color={INK} shadow={false} />
      </div>
    </AbsoluteFill>
  );
};

// 2 & 4. Full-bleed portrait
const SceneFull: React.FC<{
  dur: number;
  n: number;
  fx?: number;
  fy?: number;
  script: string;
  line: string;
  zoomIn?: boolean;
}> = ({dur, n, fx = 50, fy = 40, script, line, zoomIn = true}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Photo n={n} dur={dur + OV} fx={fx} fy={fy} from={zoomIn ? 1.0 : 1.14} to={zoomIn ? 1.13 : 1.0} panY={zoomIn ? -20 : 0} />
    <BottomShade strength={0.78} from={48} />
    <Script text={script} at={10} size={170} top={1395} />
    <Words text={line} at={26} top={1640} size={54} />
  </AbsoluteFill>
);

// 3. Doa – square framed card with 3 photos
const SceneDoa: React.FC<{dur: number; switches: number[]}> = ({dur, switches}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shots = [
    {n: 4, fx: 50, fy: 50},
    {n: 3, fx: 62, fy: 40},
    {n: 5, fx: 52, fy: 45},
  ];
  const bounds = [0, ...switches, dur + OV];
  const enter = spring({frame: f - 2, fps, config: {damping: 15}});
  return (
    <AbsoluteFill style={{background: '#2A1A0C'}}>
      {shots.map((s, i) => {
        const o = i === 0 ? 1 : interpolate(f, [bounds[i], bounds[i] + 10], [0, 1], clamp);
        return f >= bounds[i] - 1 ? (
          <Img
            key={i}
            src={img(s.n, true)}
            style={{position: 'absolute', inset: -40, width: 1160, height: 2000, objectFit: 'cover', opacity: o * 0.9}}
          />
        ) : null;
      })}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%,rgba(40,22,5,.15),rgba(25,12,2,.7) 80%)'}} />
      <Card x={60} y={470} w={960} h={960} rot={(1 - enter) * -6} border={20} style={{transform: `rotate(${(1 - enter) * -6}deg) scale(${0.85 + 0.15 * enter})`, opacity: enter}}>
        {shots.map((s, i) => {
          const local = f - bounds[i];
          const o = i === 0 ? 1 : interpolate(f, [bounds[i], bounds[i] + 10], [0, 1], clamp);
          const s2 = i === 0 ? 1 : interpolate(f, [bounds[i], bounds[i] + 14], [1.12, 1], {...clamp, easing: ease});
          return f >= bounds[i] - 1 && f < bounds[i + 1] + 12 ? (
            <div key={i} style={{position: 'absolute', inset: 0, opacity: o, transform: `scale(${s2})`}}>
              <KB n={s.n} fx={s.fx} fy={s.fy} t={local} dur={bounds[i + 1] - bounds[i] + 12} />
            </div>
          ) : null;
        })}
      </Card>
      <Script text="Barakallahu Lakuma" at={8} size={118} top={215} />
      <Ornament at={30} top={1475} />
      <Words text="Diiringi doa, semoga diberkati" at={36} top={1530} size={54} />
      <Words text="& disatukan dalam kebaikan" at={50} top={1600} size={54} />
    </AbsoluteFill>
  );
};

// Ken Burns driven by explicit local time (for stacked shots)
const KB: React.FC<{n: number; fx: number; fy: number; t: number; dur: number}> = ({n, fx, fy, t, dur}) => {
  const p = interpolate(t, [0, dur], [0, 1], clamp);
  return (
    <Img
      src={img(n)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: `${fx}% ${fy}%`,
        transform: `scale(${1.02 + 0.1 * p})`,
        transformOrigin: `${fx}% ${fy}%`,
      }}
    />
  );
};

// 5. Family – two prints sliding in, camera flash
const SceneKeluarga: React.FC<{dur: number; shutters: number[]}> = ({dur, shutters}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame: f - (shutters[0] - 6), fps, config: {damping: 14, mass: 1}});
  const b = spring({frame: f - (shutters[1] - 6), fps, config: {damping: 14, mass: 1}});
  const flash = Math.max(
    ...shutters.map((s) => interpolate(f, [s, s + 2, s + 12], [0, 0.85, 0], clamp)),
  );
  const drift = interpolate(f, [0, dur + OV], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: IVORY}}>
      <Img src={img(2, true)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5}} />
      <AbsoluteFill style={{background: 'rgba(251,245,234,.55)'}} />
      <Script text="Restu Keluarga" at={6} size={128} top={95} glow={false} />
      <Card x={70 - (1 - a) * 1100} y={320 - drift * 10} w={940} h={720} rot={-3 + (1 - a) * -12}>
        <KB n={2} fx={50} fy={45} t={f - shutters[0]} dur={dur} />
      </Card>
      <Card x={70 + (1 - b) * 1100} y={1050 + drift * 10} w={940} h={720} rot={2.5 + (1 - b) * 12}>
        <KB n={1} fx={50} fy={45} t={f - shutters[1]} dur={dur} />
      </Card>
      <Words text="Kebahagiaan yang dikongsi bersama" at={70} top={1795} size={46} color={INK} shadow={false} stagger={3} />
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

// 6. Finale
const SceneFinale: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const shade = interpolate(f, [20, 60], [0, 1], clamp);
  const endFade = interpolate(f, [dur - 18, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Photo n={7} dur={dur} fx={52} fy={35} from={1.18} to={1.0} />
      <div style={{opacity: shade}}>
        <BottomShade strength={0.85} from={36} />
      </div>
      <Words text="SELAMAT" at={34} top={1150} size={40} color="#F3D894" caps stagger={2} />
      <Script text="Pengantin Baru" at={44} size={134} top={1200} dur={34} />
      <Ornament at={78} top={1385} width={600} />
      <Words text="Semoga bahagia hingga ke Jannah" at={86} top={1440} size={56} />
      <Words text="BARAKALLAHU LAKUMA" at={110} top={1545} size={30} color="#E9C979" caps stagger={2} />
      <AbsoluteFill style={{background: IVORY, opacity: endFade}} />
    </AbsoluteFill>
  );
};

/* ===================== OVERLAYS ===================== */

const Bokeh: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      {new Array(34).fill(0).map((_, i) => {
        const x = random(`bx${i}`) * 1080;
        const sp = 0.6 + random(`bs${i}`) * 1.6;
        const y = ((random(`by${i}`) * 2100 - f * sp) % 2100 + 2100) % 2100 - 90;
        const r = 6 + random(`br${i}`) * 26;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / (14 + random(`bt${i}`) * 20) + i));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.sin(f / 40 + i) * 18,
              top: y,
              width: r,
              height: r,
              borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(255,236,170,.95),rgba(255,206,110,.35) 45%,rgba(255,200,90,0) 70%)',
              opacity: tw * 0.75,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Petal: React.FC<{color: string}> = ({color}) => (
  <svg width="100%" height="100%" viewBox="0 0 40 50">
    <path d="M20 2 C34 10 38 30 20 48 C2 30 6 10 20 2 Z" fill={color} />
    <path d="M20 6 C22 20 22 34 20 46" stroke="rgba(255,255,255,.35)" strokeWidth={1.4} fill="none" />
  </svg>
);

const Petals: React.FC = () => {
  const f = useCurrentFrame();
  const colors = ['#E8508A', '#F27FA8', '#C92D6E', '#F7B6CB', '#FFFFFF'];
  // density ramps up for the finale
  const count = f < 630 ? 14 : 26;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const start = i < 14 ? 60 + random(`ps${i}`) * 500 : 630 + random(`ps${i}`) * 90;
        const lf = f - start;
        if (lf < 0) return null;
        const sp = 4.5 + random(`pv${i}`) * 4;
        const cycle = 2200 / sp;
        const t = lf % cycle;
        const y = -80 + t * sp;
        const x = random(`px${i}`) * 1080 + Math.sin((lf + i * 13) / 22) * 60;
        const sz = 22 + random(`pz${i}`) * 26;
        const rot = lf * (2 + random(`pr${i}`) * 4) * (i % 2 ? 1 : -1);
        const flip = Math.cos((lf + i * 7) / 12);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: sz,
              height: sz * 1.25,
              transform: `rotate(${rot}deg) scaleX(${flip})`,
              opacity: 0.88,
              filter: sz > 40 ? 'blur(1.5px)' : 'none',
            }}
          >
            <Petal color={colors[i % colors.length]} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const LightLeaks: React.FC<{cuts: number[]}> = ({cuts}) => {
  const f = useCurrentFrame();
  return (
    <>
      {cuts.map((c, i) => {
        const p = interpolate(f, [c - 12, c + 2, c + 18], [0, 1, 0], clamp);
        if (p <= 0) return null;
        const dir = i % 2 ? -1 : 1;
        const x = interpolate(f, [c - 12, c + 18], [-30 * dir + 50, 30 * dir + 50], clamp);
        return (
          <AbsoluteFill
            key={c}
            style={{
              mixBlendMode: 'screen',
              opacity: p,
              background: `radial-gradient(ellipse 70% 55% at ${x}% ${i % 2 ? 30 : 65}%,rgba(255,214,140,.95),rgba(255,150,90,.55) 40%,rgba(255,120,60,0) 75%)`,
            }}
          />
        );
      })}
    </>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 60%,rgba(30,15,0,.38) 100%)'}}
  />
);

const Intro: React.FC = () => {
  // opening fade from warm black
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 14], [1, 0], clamp);
  return <AbsoluteFill style={{background: '#1A0F05', opacity: o}} />;
};

/* ===================== MAIN ===================== */

export const Wedding: React.FC<{withAudio?: string}> = ({withAudio = 'audio/mix.wav'}) => {
  const S = Object.fromEntries(TL.scenes.map((s) => [s.id, s])) as Record<string, any>;
  const len = (id: string) => S[id].end - S[id].start;
  const cuts = TL.scenes.slice(1).map((s) => s.start);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence from={S.arch.start} durationInFrames={len('arch') + OV}>
        <SceneIn first>
          <SceneArch dur={len('arch')} />
        </SceneIn>
      </Sequence>
      <Sequence from={S['dua-hati'].start} durationInFrames={len('dua-hati') + OV}>
        <SceneIn>
          <SceneFull dur={len('dua-hati')} n={6} fx={48} fy={38} script="Dua Hati" line="satu ikatan, satu janji" />
        </SceneIn>
      </Sequence>
      <Sequence from={S.doa.start} durationInFrames={len('doa') + OV}>
        <SceneIn>
          <SceneDoa dur={len('doa')} switches={S.doa.switches.map((x: number) => x - S.doa.start)} />
        </SceneIn>
      </Sequence>
      <Sequence from={S.bahagia.start} durationInFrames={len('bahagia') + OV}>
        <SceneIn>
          <SceneFull dur={len('bahagia')} n={8} fx={45} fy={35} script="Bahagia" line="itu bila kita bersama" zoomIn={false} />
        </SceneIn>
      </Sequence>
      <Sequence from={S.keluarga.start} durationInFrames={len('keluarga') + OV}>
        <SceneIn>
          <SceneKeluarga dur={len('keluarga')} shutters={S.keluarga.shutters.map((x: number) => x - S.keluarga.start)} />
        </SceneIn>
      </Sequence>
      <Sequence from={S.finale.start} durationInFrames={len('finale')}>
        <SceneIn>
          <SceneFinale dur={len('finale')} />
        </SceneIn>
      </Sequence>

      <Bokeh />
      <Petals />
      <LightLeaks cuts={cuts} />
      <Vignette />
      <Intro />
      {withAudio ? <Audio src={staticFile(withAudio)} /> : null}
    </AbsoluteFill>
  );
};

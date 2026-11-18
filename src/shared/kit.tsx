// Shared building blocks for the proof scenes: theme, beat timing,
// narration, animated lines and math typography.
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Html5Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FPS = 30;
export const C = {
  bg: "#0f172a",
  amber: "#fbbf24",
  text: "#f8fafc",
  muted: "#64748b",
  grid: "#1e293b",
  red: "#f87171",
  blue: "#60a5fa",
  green: "#4ade80",
};
export const SERIF = "Georgia, 'Times New Roman', serif";
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// ---------------------------------------------------------------------------
// Timing
// ---------------------------------------------------------------------------

export type Timing = { file: string; seconds: number }[];
const SPEECH_DELAY = 10;

/**
 * Beat layout from narration lengths. `cue(i, f)` is the frame at fraction f
 * (0..1) of beat i's speech, so visuals follow the narration even if the
 * audio is regenerated.
 */
export const makeBeats = (timing: Timing, pad = 1.3, lastPad = 2) => {
  const frames = timing.map((t, i) =>
    Math.ceil((t.seconds + (i === timing.length - 1 ? lastPad : pad)) * FPS) + SPEECH_DELAY,
  );
  const B = frames.map((_, i) => frames.slice(0, i).reduce((a, b) => a + b, 0));
  const S = B.map((b) => b + SPEECH_DELAY);
  const speech = timing.map((t) => t.seconds * FPS);
  return {
    B,
    S,
    duration: frames.reduce((a, b) => a + b, 0),
    cue: (i: number, f: number) => Math.round(S[i] + f * speech[i]),
  };
};

export const fade = (frame: number, at: number, out?: number, dur = 12) => {
  const a = interpolate(frame, [at, at + dur], [0, 1], clamp);
  const b = out === undefined ? 1 : interpolate(frame, [out, out + dur], [1, 0], clamp);
  return a * b;
};

// ---------------------------------------------------------------------------
// Stage
// ---------------------------------------------------------------------------

export const Stage: React.FC<{
  title: string;
  timing: Timing;
  S: number[];
  children: React.ReactNode;
}> = ({ title, timing, S, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: SERIF, color: C.text }}>
      {timing.map((t, i) => (
        <Sequence key={t.file} from={S[i]} layout="none">
          <Html5Audio src={staticFile(t.file)} />
        </Sequence>
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 62,
          textAlign: "center",
          transform: "translateY(-50%)",
          fontSize: 44,
          color: C.amber,
          opacity: fade(frame, 0, undefined, 15),
        }}
      >
        {title}
      </div>
      {children}
    </AbsoluteFill>
  );
};

/**
 * A centred line of content at height `y`, fading/sliding in at `at` and out at
 * `out`. Optionally glides to `toY` (and `toSize`) starting at `moveAt`.
 */
export const Line: React.FC<{
  at: number;
  out?: number;
  y: number;
  size?: number;
  x?: number;
  color?: string;
  moveAt?: number;
  toY?: number;
  toSize?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, out, y, size = 52, x = 640, color = C.text, moveAt, toY, toSize, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || (out !== undefined && frame > out + 12)) return null;
  const enter = spring({ frame: frame - at, fps, config: { damping: 200 }, durationInFrames: 18 });
  const m =
    moveAt === undefined
      ? 0
      : spring({ frame: frame - moveAt, fps, config: { damping: 200 }, durationInFrames: 25 });
  const yy = interpolate(m, [0, 1], [y, toY ?? y]);
  const ss = interpolate(m, [0, 1], [size, toSize ?? size]);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 640,
        width: 1280,
        top: yy,
        textAlign: "center",
        whiteSpace: "nowrap",
        transform: `translateY(-50%) translateY(${(1 - enter) * 18}px)`,
        fontSize: ss,
        lineHeight: 1.2,
        color,
        opacity: enter * (out === undefined ? 1 : interpolate(frame, [out, out + 12], [1, 0], clamp)),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Math typography (sizes in em so they scale with the surrounding line)
// ---------------------------------------------------------------------------

export const I: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
  <span style={{ fontStyle: "italic", color }}>{children}</span>
);
export const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <sub style={{ fontSize: "0.55em", lineHeight: 0 }}>{children}</sub>
);
export const Sup: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
  <sup style={{ fontSize: "0.55em", lineHeight: 0, color }}>{children}</sup>
);
export const F: React.FC<{ s: React.ReactNode; color?: string }> = ({ s, color }) => (
  <span style={{ fontStyle: "italic", color }}>
    F<Sub>{s}</Sub>
  </span>
);
export const Phi: React.FC<{ color?: string }> = ({ color = C.amber }) => <I color={color}>φ</I>;
export const Psi: React.FC<{ color?: string }> = ({ color = C.blue }) => <I color={color}>ψ</I>;
export const Lam: React.FC = () => <I>λ</I>;
export const Op: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.muted }) => (
  <span style={{ margin: "0 0.2em", color }}>{children}</span>
);
export const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span>
    √
    <span
      style={{
        display: "inline-block",
        lineHeight: 1,
        borderTop: "0.06em solid currentColor",
        paddingTop: "0.02em",
      }}
    >
      {children}
    </span>
  </span>
);
export const Frac: React.FC<{ n: React.ReactNode; d: React.ReactNode; color?: string }> = ({ n, d, color }) => (
  <span
    style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      verticalAlign: "middle",
      fontSize: "0.8em",
      lineHeight: 1.15,
      margin: "0 0.15em",
      color,
    }}
  >
    <span style={{ padding: "0 0.2em" }}>{n}</span>
    <span style={{ alignSelf: "stretch", height: "0.06em", background: "currentColor", borderRadius: 2 }} />
    <span style={{ padding: "0.12em 0.2em 0" }}>{d}</span>
  </span>
);

/** Wraps a term and shows an annotation centred under (or over) it. */
export const Annot: React.FC<{
  children: React.ReactNode;
  note: React.ReactNode;
  show: number;
  above?: boolean;
  color?: string;
  size?: string;
}> = ({ children, note, show, above, color = C.amber, size = "0.45em" }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    {children}
    <span
      style={{
        position: "absolute",
        left: "50%",
        [above ? "bottom" : "top"]: "100%",
        transform: `translateX(-50%) translateY(${(1 - show) * (above ? 10 : -10)}px)`,
        fontSize: size,
        color,
        opacity: show,
        whiteSpace: "nowrap",
      }}
    >
      {note}
    </span>
  </span>
);

/** Draws a strike-through line across a term. */
export const Strike: React.FC<{ children: React.ReactNode; p: number; color?: string }> = ({
  children,
  p,
  color = C.red,
}) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    {children}
    <span
      style={{
        position: "absolute",
        left: "-10%",
        top: "52%",
        width: `${120 * p}%`,
        height: "0.07em",
        background: color,
        transform: "rotate(-20deg)",
        transformOrigin: "left center",
        borderRadius: 3,
      }}
    />
  </span>
);

/** Rounded highlight box that fades in around its children. */
export const Boxed: React.FC<{ children: React.ReactNode; show: number; glow?: boolean }> = ({
  children,
  show,
  glow,
}) => (
  <span
    style={{
      display: "inline-block",
      padding: "0.08em 0.3em",
      borderRadius: "0.25em",
      border: `0.05em solid rgba(251, 191, 36, ${show})`,
      boxShadow: glow ? `0 0 ${30 * show}px rgba(251, 191, 36, ${0.5 * show})` : undefined,
    }}
  >
    {children}
  </span>
);

// ---------------------------------------------------------------------------
// Small ratio chart (Scene 2 style), used as an inset.
// ---------------------------------------------------------------------------

const RATIOS = [1, 2, 1.5, 5 / 3, 1.6, 13 / 8, 21 / 13, 34 / 21, 55 / 34];
export const PHI = (1 + Math.sqrt(5)) / 2;

export const MiniChart: React.FC<{
  values?: number[];
  at: number;
  width?: number;
  height?: number;
  caption?: React.ReactNode;
  check?: number;
}> = ({ values = RATIOS, at, width = 400, height = 220, caption, check = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pad = 30;
  const x = (i: number) => pad + (i * (width - 2 * pad)) / (values.length - 1);
  const y = (v: number) => height - pad - ((v - 0.8) / 1.4) * (height - 2 * pad);
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <line x1={pad - 10} x2={width - pad + 10} y1={y(PHI)} y2={y(PHI)} stroke={C.amber} strokeWidth={2.5} strokeDasharray="10 8" />
      <line x1={pad - 10} x2={pad - 10} y1={pad - 10} y2={height - pad + 10} stroke={C.muted} strokeWidth={2} />
      <line x1={pad - 10} x2={width - pad + 10} y1={height - pad + 10} y2={height - pad + 10} stroke={C.muted} strokeWidth={2} />
      {values.slice(1).map((v, k) => {
        const t = interpolate(frame, [at + k * 5, at + k * 5 + 6], [0, 1], clamp);
        const i = k + 1;
        return (
          <line key={i} x1={x(i - 1)} y1={y(values[i - 1])} x2={x(i - 1) + (x(i) - x(i - 1)) * t} y2={y(values[i - 1]) + (y(v) - y(values[i - 1])) * t} stroke={C.text} strokeOpacity={0.5} strokeWidth={2} />
        );
      })}
      {values.map((v, i) => {
        const p = spring({ frame: frame - (at + i * 5), fps, config: { damping: 14, stiffness: 180 } });
        return <circle key={i} cx={x(i)} cy={y(v)} r={6 * p} fill={C.text} />;
      })}
      {caption ? (
        <foreignObject x={-60} y={height + 4} width={width + 120} height={50}>
          <div style={{ textAlign: "center", fontFamily: SERIF, fontSize: 24, color: C.muted }}>{caption}</div>
        </foreignObject>
      ) : null}
      {check > 0 ? (
        <text x={width - 10} y={y(PHI) - 18} textAnchor="end" fontFamily={SERIF} fontSize={44 * check} fill={C.green}>
          ✓
        </text>
      ) : null}
    </svg>
  );
};

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
import timing from "./timing.json";

// ---------------------------------------------------------------------------
// Timing
// ---------------------------------------------------------------------------

export const SCENE2_FPS = 30;
const SPEECH_DELAY = 10;

// Kept tight so the narration never pauses for much more than ~1.5 s. The
// last beat keeps a longer pad: its final second is a frozen hand-off frame.
const BEAT_MIN = [4, 8, 5.5];
const BEAT_PAD = [0.7, 1.0, 2];

const BEAT_FRAMES = timing.map((t, i) =>
  Math.ceil(Math.max(BEAT_MIN[i], t.seconds + BEAT_PAD[i]) * SCENE2_FPS),
);
const BEAT_START = BEAT_FRAMES.map((_, i) =>
  BEAT_FRAMES.slice(0, i).reduce((a, b) => a + b, 0),
);
export const SCENE2_DURATION = BEAT_FRAMES.reduce((a, b) => a + b, 0);
const S = BEAT_START.map((b) => b + SPEECH_DELAY);

// ---------------------------------------------------------------------------
// Style (matches Scene 1)
// ---------------------------------------------------------------------------

const BG = "#0f172a";
const AMBER = "#fbbf24";
const TEXT = "#f8fafc";
const MUTED = "#64748b";
const GRID = "#1e293b";
const SERIF = "Georgia, 'Times New Roman', serif";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const RATIOS = [
  { num: 1, den: 1, label: "1" },
  { num: 2, den: 1, label: "2" },
  { num: 3, den: 2, label: "1.5" },
  { num: 5, den: 3, label: "1.667" },
  { num: 8, den: 5, label: "1.6" },
  { num: 13, den: 8, label: "1.625" },
  { num: 21, den: 13, label: "1.615" },
  { num: 34, den: 21, label: "1.619" },
  { num: 55, den: 34, label: "1.618" },
];
const PHI = (1 + Math.sqrt(5)) / 2;

// Beat 2: when each ratio row/dot appears, and when the φ line draws.
const rowAppear = (i: number) => S[1] + 5 + i * 19;
const LINE_START = S[1] + 130;

// Chart geometry (screen coordinates).
const CH_LEFT = 540;
const CH_RIGHT = 1200;
const CH_TOP = 170;
const CH_BOTTOM = 640;
const Y_MIN = 0.8;
const Y_MAX = 2.2;
const chartX = (i: number) => 580 + i * 75;
const chartY = (v: number) =>
  CH_BOTTOM - 40 - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (CH_BOTTOM - CH_TOP - 80);

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  // Fade the old title out before the new one comes in, so the two lines
  // (different widths) never overlap.
  const out = interpolate(frame, [S[2] - 4, S[2] + 8], [1, 0], clamp);
  const inn = interpolate(frame, [S[2] + 8, S[2] + 22], [0, 1], ease);
  const style: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 70,
    textAlign: "center",
    transform: "translateY(-50%)",
    fontFamily: SERIF,
    fontSize: 48,
    color: AMBER,
  };
  return (
    <>
      {out > 0 ? (
        // Built exactly like Scene 1's title (96px scaled to 0.5, "The" in its
        // own fixed-width span) so the cut from Scene 1 is pixel-identical.
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 70,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            whiteSpace: "nowrap",
            transform: "translateY(-50%) scale(0.5) scaleX(1)",
            fontFamily: SERIF,
            fontSize: 96,
            color: AMBER,
            opacity: out,
          }}
        >
          <span style={{ width: 214, overflow: "hidden", display: "flex", justifyContent: "flex-end" }}>
            <span style={{ flexShrink: 0 }}>The&nbsp;</span>
          </span>
          <span>Fibonacci Sequence</span>
        </div>
      ) : null}
      <div style={{ ...style, opacity: inn }}>The Golden Ratio</div>
    </>
  );
};

const F: React.FC<{ sub: string; size: number }> = ({ sub, size }) => (
  <span style={{ fontStyle: "italic" }}>
    F<sub style={{ fontSize: size * 0.45 }}>{sub}</sub>
  </span>
);

// Beat 1: Fₙ, Fₙ₊₁ (Scene 1's last frame) become the fraction Fₙ₊₁ / Fₙ,
// which then shrinks into the corner as the table header in beat 2.
const Fraction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qOut = interpolate(frame, [0, 15], [1, 0], clamp);
  // The terms first separate vertically, then slide together, so they never
  // cross over each other on the way to forming the fraction.
  const formY = spring({ frame: frame - (S[0] + 2), fps, config: { damping: 200 }, durationInFrames: 26 });
  const formX = spring({ frame: frame - (S[0] + 12), fps, config: { damping: 200 }, durationInFrames: 28 });
  const bar = interpolate(frame, [S[0] + 28, S[0] + 48], [0, 1], ease);
  const toCorner = spring({ frame: frame - (BEAT_START[1] - 5), fps, config: { damping: 200 }, durationInFrames: 30 });
  const fadeBack = interpolate(frame, [S[2], S[2] + 24], [1, 0], clamp);

  const size = 120;
  const cx = interpolate(toCorner, [0, 1], [640, 245]);
  const cy = interpolate(toCorner, [0, 1], [400, 205]);
  const scale = interpolate(toCorner, [0, 1], [1, 0.42]);

  // Positions relative to the group centre, before scaling.
  const topX = interpolate(formX, [0, 1], [110, 0]);
  const topY = interpolate(formY, [0, 1], [0, -80]);
  const botX = interpolate(formX, [0, 1], [-110, 0]);
  const botY = interpolate(formY, [0, 1], [0, 80]);

  const term = (x: number, y: number, sub: string) => (
    <div
      style={{
        position: "absolute",
        left: x - 200,
        width: 400,
        top: y,
        textAlign: "center",
        transform: "translateY(-50%)",
        fontFamily: SERIF,
        fontSize: size,
        lineHeight: 1,
        color: AMBER,
      }}
    >
      <F sub={sub} size={size} />
    </div>
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 225,
          textAlign: "center",
          transform: "translateY(-50%)",
          fontFamily: SERIF,
          fontSize: 130,
          lineHeight: 1,
          color: TEXT,
          opacity: qOut,
        }}
      >
        ?
      </div>
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: 0,
          height: 0,
          transform: `scale(${scale})`,
          opacity: fadeBack,
        }}
      >
        {term(topX, topY, "n+1")}
        {term(botX, botY, "n")}
        <div
          style={{
            position: "absolute",
            left: -150 * bar,
            width: 300 * bar,
            top: -3,
            height: 6,
            borderRadius: 3,
            background: AMBER,
          }}
        />
      </div>
    </>
  );
};

// Beat 2: column of ratios with their decimal values.
const Table: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeBack = interpolate(frame, [S[2], S[2] + 24], [1, 0], clamp);
  return (
    <div style={{ opacity: fadeBack }}>
      {RATIOS.map((r, i) => {
        const p = spring({ frame: frame - rowAppear(i), fps, config: { damping: 200 }, durationInFrames: 15 });
        if (frame < rowAppear(i)) return null;
        const y = 300 + i * 40;
        const common: React.CSSProperties = {
          position: "absolute",
          top: y,
          transform: `translateY(-50%) translateX(${(1 - p) * -20}px)`,
          fontFamily: SERIF,
          fontSize: 28,
          lineHeight: 1,
          opacity: p,
        };
        return (
          <React.Fragment key={i}>
            <div style={{ ...common, left: 90, width: 120, textAlign: "right", color: TEXT }}>
              {r.num} / {r.den}
            </div>
            <div style={{ ...common, left: 225, width: 30, textAlign: "center", color: MUTED }}>=</div>
            <div style={{ ...common, left: 265, width: 120, textAlign: "left", color: i === RATIOS.length - 1 ? AMBER : TEXT }}>
              {r.label}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Beat 2: ratio vs n chart with the dashed φ line.
const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(frame, [BEAT_START[1], BEAT_START[1] + 20], [0, 1], clamp);
  const fadeBack = interpolate(frame, [S[2], S[2] + 24], [1, 0], clamp);
  const line = interpolate(frame, [LINE_START, LINE_START + 30], [0, 1], ease);
  const phiY = chartY(PHI);

  return (
    <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0, opacity: enter * fadeBack }}>
      {/* grid + axis labels */}
      {[1, 1.5, 2].map((v) => (
        <g key={v}>
          <line x1={CH_LEFT} x2={CH_RIGHT} y1={chartY(v)} y2={chartY(v)} stroke={GRID} strokeWidth={2} />
          <text x={CH_LEFT - 12} y={chartY(v) + 8} textAnchor="end" fontFamily={SERIF} fontSize={22} fill={MUTED}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      <line x1={CH_LEFT} x2={CH_LEFT} y1={CH_TOP} y2={CH_BOTTOM - 20} stroke={MUTED} strokeWidth={2} />
      <line x1={CH_LEFT} x2={CH_RIGHT} y1={CH_BOTTOM - 20} y2={CH_BOTTOM - 20} stroke={MUTED} strokeWidth={2} />
      <text x={CH_RIGHT} y={CH_BOTTOM + 12} textAnchor="end" fontFamily={SERIF} fontStyle="italic" fontSize={24} fill={MUTED}>
        n
      </text>
      <text x={CH_LEFT} y={CH_TOP - 16} textAnchor="middle" fontFamily={SERIF} fontSize={22} fill={MUTED}>
        <tspan fontStyle="italic">F</tspan>
        <tspan fontSize={14} dy={6} fontStyle="italic">n+1</tspan>
        <tspan dy={-6}> / </tspan>
        <tspan fontStyle="italic">F</tspan>
        <tspan fontSize={14} dy={6} fontStyle="italic">n</tspan>
      </text>

      {/* dashed φ line */}
      <line
        x1={CH_LEFT}
        x2={CH_LEFT + (CH_RIGHT - CH_LEFT) * line}
        y1={phiY}
        y2={phiY}
        stroke={AMBER}
        strokeWidth={3}
        strokeDasharray="12 10"
      />

      {/* zig-zag connecting the dots */}
      {RATIOS.slice(1).map((r, k) => {
        const i = k + 1;
        const t = interpolate(frame, [rowAppear(i) - 2, rowAppear(i) + 10], [0, 1], ease);
        if (t <= 0) return null;
        const x1 = chartX(i - 1);
        const y1 = chartY(RATIOS[i - 1].num / RATIOS[i - 1].den);
        const x2 = chartX(i);
        const y2 = chartY(r.num / r.den);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x1 + (x2 - x1) * t}
            y2={y1 + (y2 - y1) * t}
            stroke={TEXT}
            strokeOpacity={0.5}
            strokeWidth={2}
          />
        );
      })}

      {/* dots */}
      {RATIOS.map((r, i) => {
        const p = spring({ frame: frame - (rowAppear(i) + 8), fps, config: { damping: 12, stiffness: 180 } });
        if (frame < rowAppear(i) + 8) return null;
        return (
          <circle key={i} cx={chartX(i)} cy={chartY(r.num / r.den)} r={8 * p} fill={TEXT} />
        );
      })}
    </svg>
  );
};

// Left edge of the "1.6180339…" text box inside the final, centred formula
// (measured from a render). The moving "1.618…" label lands exactly there, so
// its digits line up with the final decimal and simply grow more digits.
const DECIMAL_LEFT = 633;
// Vertical centre for the label so its baseline matches the final decimal
// (the formula line box is taller because of the stacked fraction).
const DECIMAL_Y = 393;
// Left edge of the small "1.618…" label on the chart in beat 2.
const LABEL_LEFT = CH_RIGHT - 108;

// The "1.618…" label: sits on the φ line in beat 2, then grows into place in
// beat 3, where the rest of φ = (1 + √5) / 2 ≈ 1.6180339… appears around it.
const PhiLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = interpolate(frame, [LINE_START + 20, LINE_START + 35], [0, 1], clamp);
  const move = spring({ frame: frame - (S[2] - 2), fps, config: { damping: 200 }, durationInFrames: 30 });
  const digits = interpolate(frame, [S[2] + 28, S[2] + 42], [0, 1], clamp);
  const reveal = interpolate(frame, [S[2] + 30, S[2] + 50], [0, 1], ease);
  // "...the Greek letter phi": the φ glows up briefly as it is named.
  const named = interpolate(frame, [S[2] + 84, S[2] + 96, S[2] + 116], [0, 1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  if (appear <= 0) return null;

  const x = interpolate(move, [0, 1], [LABEL_LEFT, DECIMAL_LEFT]);
  const y = interpolate(move, [0, 1], [chartY(PHI) - 26, DECIMAL_Y]);
  const size = interpolate(move, [0, 1], [26, 76]);

  const fracStyle: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    verticalAlign: "middle",
    fontSize: 54,
    lineHeight: 1.15,
    margin: "0 10px",
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          whiteSpace: "nowrap",
          transform: "translateY(-50%)",
          fontFamily: SERIF,
          fontSize: size,
          color: AMBER,
          opacity: appear * (1 - digits),
        }}
      >
        1.618…
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 400,
          textAlign: "center",
          transform: "translateY(-50%)",
          fontFamily: SERIF,
          fontSize: 76,
          color: TEXT,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            display: "inline-block",
            color: AMBER,
            fontStyle: "italic",
            opacity: reveal,
            transform: `scale(${1 + 0.15 * named})`,
            textShadow: `0 0 ${24 * named}px rgba(251, 191, 36, ${0.8 * named})`,
          }}
        >
          φ
        </span>
        <span style={{ margin: "0 18px", opacity: reveal }}>=</span>
        <span style={{ ...fracStyle, opacity: reveal }}>
          <span style={{ padding: "0 8px" }}>
            1 + √<span style={{ borderTop: `3px solid ${TEXT}`, paddingTop: 2 }}>5</span>
          </span>
          <span style={{ alignSelf: "stretch", height: 4, background: TEXT, borderRadius: 2 }} />
          <span>2</span>
        </span>
        <span style={{ margin: "0 18px", color: MUTED, opacity: reveal }}>≈</span>
        <span style={{ color: AMBER, opacity: digits }}>1.6180339…</span>
      </div>
    </>
  );
};

export const Scene2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {timing.map((t, i) => (
        <Sequence key={t.file} from={S[i]} layout="none">
          <Html5Audio src={staticFile(t.file)} />
        </Sequence>
      ))}
      <Title />
      <Chart />
      <Table />
      <Fraction />
      <PhiLabel />
    </AbsoluteFill>
  );
};

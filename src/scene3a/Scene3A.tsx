import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, clamp, ease, F, Line, makeBeats, Op, Phi, Root, Frac, Stage } from "../shared/kit";
import timing from "./timing.json";

const T = makeBeats(timing);
export const SCENE3A_DURATION = T.duration;

// First 40 Fibonacci numbers for the scrolling row.
const FIB: number[] = [1, 1];
while (FIB.length < 40) FIB.push(FIB[FIB.length - 1] + FIB[FIB.length - 2]);
const GAP = 46;
const CHAR = 30;
const POS: number[] = [];
FIB.reduce((x, v) => {
  const w = String(v).length * CHAR;
  POS.push(x + w / 2);
  return x + w + GAP;
}, 0);

const ScrollingRow: React.FC = () => {
  const frame = useCurrentFrame();
  const start = T.S[1];
  const end = T.cue(1, 0.6);
  const t = interpolate(frame, [start, end], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const shift = t * (POS[POS.length - 1] - 900);
  const opacity =
    interpolate(frame, [T.B[1], T.B[1] + 12], [0, 1], clamp) *
    interpolate(frame, [end - 10, end + 8], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 140 - shift,
        top: 420,
        opacity,
        filter: `blur(${t * t * 6}px)`,
      }}
    >
      {FIB.map((v, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: POS[i],
            transform: "translate(-50%, -50%)",
            fontSize: 52,
            whiteSpace: "nowrap",
            color: C.text,
          }}
        >
          {v}
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Beat 0: opens on Scene 2's last frame (φ = (1 + √5)/2 ≈ 1.618…), puts the
// Fibonacci row next to φ and draws a "?" link between them.
// ---------------------------------------------------------------------------

const Bridge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { B, cue } = T;
  const out = interpolate(frame, [B[1] - 4, B[1] + 12], [1, 0], clamp);
  if (out <= 0) return null;

  // Scene 2's title, cross-fading into this part's title (Stage, at B[1]).
  const oldTitle = interpolate(frame, [B[1] - 10, B[1] + 5], [1, 0], clamp);

  // φ glides from Scene 2's centre position to the right. The "≈ 1.618…" part
  // fades out but keeps its space, so the line centre is chosen to put the
  // "φ = (1 + √5)/2" part (295px left of centre at full size) at x = 945.
  const move = spring({ frame: frame - cue(0, 0.05), fps, config: { damping: 200 }, durationInFrames: 30 });
  const phiX = interpolate(move, [0, 1], [640, 945 + 295 * 0.62]);
  const phiY = interpolate(move, [0, 1], [400, 330]);
  const phiScale = interpolate(move, [0, 1], [1, 0.62]);
  const approx = interpolate(move, [0, 0.6], [1, 0], clamp);

  const rowIn = interpolate(frame, [cue(0, 0.12), cue(0, 0.12) + 15], [0, 1], clamp);
  const link = interpolate(frame, [cue(0, 0.42), cue(0, 0.62)], [0, 1], ease);
  const q = spring({ frame: frame - cue(0, 0.6), fps, config: { damping: 10, stiffness: 120 } });
  const caption = interpolate(frame, [cue(0, 0.68), cue(0, 0.68) + 15], [0, 1], clamp);

  return (
    <div style={{ opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 70,
          textAlign: "center",
          transform: "translateY(-50%)",
          fontSize: 48,
          color: C.amber,
          opacity: oldTitle,
        }}
      >
        The Golden Ratio
      </div>

      {/* φ = (1 + √5)/2 ≈ 1.6180339…, same typography as Scene 2's ending */}
      <div
        style={{
          position: "absolute",
          left: phiX - 640,
          width: 1280,
          top: phiY,
          textAlign: "center",
          whiteSpace: "nowrap",
          fontSize: 76,
          transform: `translateY(-50%) scale(${phiScale})`,
        }}
      >
        <Phi />
        <span style={{ margin: "0 18px" }}>=</span>
        <span style={{ fontSize: 54 / 76 / 0.8 + "em" }}>
          <Frac n={<span>1 + <Root>5</Root></span>} d="2" />
        </span>
        <span style={{ opacity: approx }}>
          <span style={{ margin: "0 18px", color: C.muted }}>≈</span>
          <span style={{ color: C.amber }}>1.6180339…</span>
        </span>
      </div>

      {/* The Fibonacci row on the left */}
      <div
        style={{
          position: "absolute",
          left: 300 - 300,
          width: 600,
          top: 330,
          textAlign: "center",
          transform: `translateY(-50%) translateX(${(1 - rowIn) * -30}px)`,
          fontSize: 46,
          opacity: rowIn,
          whiteSpace: "nowrap",
        }}
      >
        1, 1, 2, 3, 5, 8, 13, …
      </div>

      {/* The "?" link */}
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        <path
          d="M 300 385 Q 622 515 945 385"
          fill="none"
          stroke={C.amber}
          strokeWidth={3}
          strokeDasharray="12 10"
          strokeDashoffset={0}
          opacity={link > 0 ? 1 : 0}
          style={{ clipPath: `inset(0 ${(1 - link) * 100}% 0 0)` }}
        />
        <circle cx={622} cy={450} r={42 * Math.min(1, q)} fill={C.bg} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 622 - 50,
          width: 100,
          top: 450,
          textAlign: "center",
          transform: `translateY(-50%) scale(${q})`,
          fontSize: 80,
          color: C.amber,
          opacity: Math.min(1, q),
        }}
      >
        ?
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 590,
          textAlign: "center",
          fontSize: 44,
          fontStyle: "italic",
          color: C.text,
          opacity: caption,
          transform: `translateY(-50%) translateY(${(1 - caption) * 15}px)`,
        }}
      >
        How are they related?
      </div>
    </div>
  );
};

export const Scene3A: React.FC = () => {
  const { S, B, cue } = T;
  return (
    <Stage title="Why We Want a Formula" timing={timing} S={S} titleAt={B[1]}>
      {/* Beat 0: bridge from Scene 2 */}
      <Bridge />

      {/* Beat 1: computing term by term is slow */}
      <ScrollingRow />
      <Line at={cue(1, 0.08)} out={cue(1, 0.6)} y={240} size={64}>
        <F s="100" /> <Op>=</Op> <span style={{ color: C.amber }}>?</span>
      </Line>
      <Line at={cue(1, 0.66)} out={B[2]} y={380} size={110}>
        <F s="n" /> <Op>=</Op> <span style={{ color: C.amber }}>?</span>
      </Line>

      {/* Beat 2: the rule as an equation */}
      <Line at={S[2]} y={300} size={70}>
        <F s="n" /> <Op>=</Op> <F s="n−1" /> <Op>+</Op> <F s="n−2" />
      </Line>
      <Line at={cue(2, 0.3)} y={380} size={40} color={C.muted}>
        ⇣
      </Line>
      <Line at={cue(2, 0.35)} y={460} size={70}>
        <F s="n" /> <Op color={C.amber}>−</Op> <F s="n−1" color={C.amber} /> <Op color={C.amber}>−</Op>{" "}
        <F s="n−2" color={C.amber} /> <Op>=</Op> 0
      </Line>
    </Stage>
  );
};

import React from "react";
import { interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, Line, Phi, Stage } from "../shared/kit";
import { makeBeatsPadded } from "../scene4a/beats";
import { SPIRAL_EYE, SpiralPath, SQUARE_SIDES, SQUARES, squaresBox, Sunflower } from "../shared/nature";
import timing from "./timing.json";

// A slightly shorter pause between the beats: beat 1 ends on a still frame.
const T = makeBeatsPadded(timing, [1.0, 2]);
export const SCENE4C_DURATION = T.duration;

const CENTER = { x: 480, y: 400 }; // where the rectangle is centred
const FIT = { w: 640, h: 520 };
const MAX_UNIT = 110;

// One square every ~0.9 s, while the narration talks about them.
const squareAt = (k: number) => T.cue(0, 0.04 + k * 0.088);

// Camera scale (pixels per unit) once k squares are placed. Fitting each
// rectangle exactly makes the zoom jump whenever a tall rectangle forms, so
// each step also eases halfway toward the next rectangle's fit. That keeps
// the zoom shrinking by a steady factor per square.
const fitUnit = (k: number) => {
  const b = squaresBox(k);
  return Math.min(MAX_UNIT, FIT.w / (b.x1 - b.x0), FIT.h / (b.y1 - b.y0));
};
const UNITS = SQUARES.map((_, i) => {
  const k = i + 1;
  return k < SQUARES.length ? Math.sqrt(fitUnit(k) * Math.min(fitUnit(k), fitUnit(k + 1))) : fitUnit(k);
});

// After squares 0..i+1 the rectangle is F(i+3) × F(i+2): 2×1, 3×2, …, 34×21.
const FIB = [...SQUARE_SIDES, 34];
const RATIOS = SQUARE_SIDES.slice(1).map((_, i) => {
  const num = FIB[i + 2];
  const den = FIB[i + 1];
  const v = num / den;
  const exact = Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-9;
  return { text: `${num} / ${den}`, value: `${exact ? "=" : "≈"} ${Number(v.toFixed(3))}` };
});

export const Scene4C: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { S, cue } = T;

  // Camera: a continuous "number of squares" drives the zoom, so the view
  // eases out to fit the growing rectangle. The camera moves first, so each
  // new square fades in where there is already room for it (never clipped).
  const pops = SQUARES.map((_, k) =>
    spring({ frame: frame - squareAt(k), fps, config: { damping: 200 }, durationInFrames: 20 }),
  );
  const CAMERA_LEAD = 14;
  const count = SQUARES.map((_, k) =>
    spring({ frame: frame - squareAt(k) + CAMERA_LEAD, fps, config: { damping: 200 }, durationInFrames: 24 }),
  ).reduce((a, b) => a + b, 0);
  const lo = Math.max(1, Math.floor(count));
  const hi = Math.min(SQUARES.length, lo + 1);
  const f = count - Math.floor(count);
  const bLo = squaresBox(lo);
  const bHi = squaresBox(hi);
  const lerp = (a: number, b: number) => a + (b - a) * (hi === lo ? 0 : f);
  const box = { x0: lerp(bLo.x0, bHi.x0), y0: lerp(bLo.y0, bHi.y0), x1: lerp(bLo.x1, bHi.x1), y1: lerp(bLo.y1, bHi.y1) };
  const uLo = UNITS[lo - 1];
  const uHi = UNITS[hi - 1];
  const unit = uLo * Math.pow(uHi / uLo, hi === lo ? 0 : f);
  const toScreen = (p: { x: number; y: number }) => ({
    x: CENTER.x + (p.x - (box.x0 + box.x1) / 2) * unit,
    y: CENTER.y + (p.y - (box.y0 + box.y1) / 2) * unit,
  });

  // Beat 2
  // The spiral is drawn while "...and they join into a spiral" is spoken.
  const spiral = interpolate(frame, [S[1], cue(1, 0.38)], [0, 1], clamp);
  const tilesOut = interpolate(frame, [cue(1, 0.42), cue(1, 0.42) + 20], [1, 0], clamp);
  const listOut = interpolate(frame, [S[1] - 10, S[1] + 8], [1, 0], clamp);
  const flower = interpolate(frame, [cue(1, 0.8), cue(1, 0.8) + 20], [0, 0.22], clamp);
  const eye = toScreen(SPIRAL_EYE);

  return (
    <Stage title="The Golden Spiral" timing={timing} S={S}>
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        {flower > 0 ? <Sunflower count={450} cx={eye.x} cy={eye.y} radius={225} opacity={flower} /> : null}
        <g opacity={tilesOut}>
          {SQUARES.map((q, k) => {
            const p = pops[k];
            if (p <= 0) return null;
            const a = toScreen({ x: q.x, y: q.y });
            const side = q.s * unit;
            const label = Math.min(64, side * 0.42);
            const fresh = interpolate(frame, [squareAt(k), squareAt(k) + 25], [1, 0], clamp);
            return (
              <g key={k} opacity={p}>
                <rect
                  x={a.x + 1.5}
                  y={a.y + 1.5}
                  width={Math.max(0, side - 3)}
                  height={Math.max(0, side - 3)}
                  fill={`rgba(251, 191, 36, ${0.06 + 0.2 * fresh})`}
                  stroke={C.amber}
                  strokeOpacity={0.55 + 0.45 * fresh}
                  strokeWidth={2.5}
                />
                {label >= 13 ? (
                  <text
                    x={a.x + side / 2}
                    y={a.y + side / 2 + label * 0.35}
                    textAnchor="middle"
                    fontFamily="Georgia, serif"
                    fontSize={label}
                    fill={C.text}
                    opacity={0.85}
                  >
                    {q.s}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
        <SpiralPath progress={spiral} toScreen={toScreen} width={5} />
      </svg>

      {/* Rectangle side ratios → φ */}
      <div style={{ opacity: listOut }}>
        {RATIOS.map((r, i) => {
          const at = squareAt(i + 1) + 8;
          const show = interpolate(frame, [at, at + 10], [0, 1], clamp);
          if (show <= 0) return null;
          const latest = i === RATIOS.length - 1 || frame < squareAt(i + 2) + 8;
          // On "closer and closer", the values light up top to bottom.
          const pulseAt = cue(0, 0.71 + i * 0.022);
          const pulse = interpolate(frame, [pulseAt, pulseAt + 5, pulseAt + 18], [0, 1, 0], clamp);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 930,
                top: 175 + i * 46,
                width: 300,
                display: "flex",
                fontSize: 30,
                color: latest ? C.text : C.muted,
                opacity: show,
                transform: `translateX(${(1 - show) * 20}px)`,
              }}
            >
              <span style={{ width: 120, textAlign: "right" }}>{r.text}</span>
              <span style={{ marginLeft: 16, color: interpolateColors(pulse, [0, 1], [latest ? C.text : C.muted, C.amber]) }}>
                {r.value}
              </span>
            </div>
          );
        })}
        <Line at={cue(0, 0.9)} x={1065} y={540} size={44}>
          <span style={{ color: C.muted }}>→</span> <Phi /> <span style={{ color: C.muted, fontSize: "0.7em" }}>≈ 1.618</span>
        </Line>
      </div>

      {/* Beat 2 */}
      <Line at={cue(1, 0.68)} x={1060} y={330} size={34} color={C.text}>
        grows by <Phi />
      </Line>
      <Line at={cue(1, 0.72)} x={1060} y={375} size={34} color={C.text}>
        every quarter turn
      </Line>
      <Line at={cue(1, 0.5)} y={688} size={21} color={C.muted} style={{ fontStyle: "italic" }}>
        Strictly, quarter circles give the Fibonacci spiral, a very close match to the true golden spiral.
      </Line>
    </Stage>
  );
};

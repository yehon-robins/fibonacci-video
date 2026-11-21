import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, Line, Stage } from "../shared/kit";
import { makeBeatsPadded } from "./beats";
import timing from "./timing.json";

// A one-second lead-in before the narration: 4A opens a new chapter
// (maths -> nature), so the title, a small subtitle and the flower buds
// settle in before the voice starts.
const LEAD = 30;
const T = makeBeatsPadded(timing, [1.3, 2], LEAD);
export const SCENE4A_DURATION = T.duration;

// ---------------------------------------------------------------------------
// A stylised flower whose petals open one at a time.
// ---------------------------------------------------------------------------

const Flower: React.FC<{
  petals: number;
  opened: number; // how many petals are open (fractional while one is opening)
  cx: number;
  cy: number;
  size?: number;
  grey?: boolean;
  bud?: number; // 0..1, how far the closed bud has appeared
}> = ({ petals, opened, cx, cy, size = 78, grey, bud = 1 }) => {
  const core = size * 0.24;
  const len = size - core;
  // Narrower petals the more there are, so they don't overlap too much.
  const width = Math.min(len * 0.75, ((2 * Math.PI * (core + len * 0.45)) / petals) * 0.95);
  const stroke = grey ? C.muted : C.amber;
  const fill = grey ? "rgba(100, 116, 139, 0.18)" : "rgba(251, 191, 36, 0.18)";
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {Array.from({ length: petals }, (_, i) => {
        const s = Easing.out(Easing.back(1.6))(Math.max(0, Math.min(1, opened - i)));
        if (s <= 0) return null;
        const angle = (360 * i) / petals;
        return (
          <g key={i} transform={`rotate(${angle}) translate(0 ${-core}) scale(${s})`}>
            <ellipse cx={0} cy={-len / 2} rx={width / 2} ry={len / 2} fill={fill} stroke={stroke} strokeWidth={2.5} />
          </g>
        );
      })}
      <circle r={core * Math.min(1, opened + 0.3) * bud} fill={grey ? C.muted : "#d97706"} stroke={stroke} strokeWidth={2.5} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Beat 1: five flowers, each counted as it blooms.
// ---------------------------------------------------------------------------

const FLOWERS = [
  // Each count finishes as its number is spoken.
  { petals: 3, name: "lily", start: 0.41, end: 0.49 },
  { petals: 5, name: "buttercup", start: 0.52, end: 0.61 },
  { petals: 8, name: "cosmos", start: 0.62, end: 0.72 },
  { petals: 13, name: "marigold", start: 0.73, end: 0.85 },
  { petals: 21, name: "aster", start: 0.86, end: 0.98 },
];
const FLOWER_Y = 270;
const xBefore = (k: number) => 160 + k * 240;
const xAfter = (k: number) => 130 + k * 204;

const ROW = ["1", "1", "2", "3", "5", "8", "13", "21", "34", "…"];
const ROW_LIGHT: Record<number, number> = { 3: 0, 4: 1, 5: 2, 6: 3, 7: 4 }; // row index → flower
const rowX = (i: number) => 640 + (i - (ROW.length - 1) / 2) * 78;

export const Scene4A: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { S, cue } = T;

  // Beat 2: flowers make room for a greyed-out 4-petal flower.
  const shift = spring({ frame: frame - cue(1, 0.05), fps, config: { damping: 200 }, durationInFrames: 30 });
  const grey = interpolate(frame, [cue(1, 0.12), cue(1, 0.12) + 30], [0, 4], clamp);
  const greyFade = interpolate(frame, [cue(1, 0.12), cue(1, 0.12) + 10], [0, 1], clamp);
  // The Fibonacci row arrives, left to right, on "a Fibonacci number".
  const rowIn = (i: number) =>
    interpolate(frame, [cue(0, 0.17) + i * 3, cue(0, 0.17) + i * 3 + 15], [0, 1], clamp);
  // Closed buds appear one by one during the lead-in.
  const bud = (k: number) =>
    spring({ frame: frame - (8 + k * 5), fps, config: { damping: 200 }, durationInFrames: 20 });

  const opened = (k: number) =>
    interpolate(frame, [cue(0, FLOWERS[k].start), cue(0, FLOWERS[k].end)], [0, FLOWERS[k].petals], clamp);
  const done = (k: number) => opened(k) >= FLOWERS[k].petals;

  return (
    <Stage title="Fibonacci in Flowers" timing={timing} S={S}>
      <Line at={12} out={cue(0, 0.3)} y={112} size={28} color={C.muted} style={{ fontStyle: "italic" }}>
        from numbers to nature
      </Line>
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        {FLOWERS.map((f, k) => (
          <Flower
            key={k}
            petals={f.petals}
            opened={opened(k)}
            bud={bud(k)}
            cx={interpolate(shift, [0, 1], [xBefore(k), xAfter(k)])}
            cy={FLOWER_Y}
          />
        ))}
        {greyFade > 0 ? (
          <g opacity={greyFade}>
            <Flower petals={4} opened={grey} cx={xAfter(5)} cy={FLOWER_Y} grey />
          </g>
        ) : null}
      </svg>

      {/* Petal counters and names */}
      {FLOWERS.map((f, k) => {
        const n = opened(k);
        if (n <= 0) return null;
        const x = interpolate(shift, [0, 1], [xBefore(k), xAfter(k)]);
        const pop = spring({ frame: frame - cue(0, f.end), fps, config: { damping: 10, stiffness: 160 } });
        return (
          <React.Fragment key={k}>
            <div
              style={{
                position: "absolute",
                left: x - 100,
                width: 200,
                top: FLOWER_Y + 125,
                textAlign: "center",
                transform: `translateY(-50%) scale(${1 + 0.25 * pop * (1 - pop) * 4})`,
                fontSize: 52,
                color: done(k) ? C.amber : C.text,
              }}
            >
              {Math.max(1, Math.floor(n))}
            </div>
            <div
              style={{
                position: "absolute",
                left: x - 100,
                width: 200,
                top: FLOWER_Y + 172,
                textAlign: "center",
                transform: "translateY(-50%)",
                fontSize: 24,
                fontStyle: "italic",
                color: C.muted,
                opacity: interpolate(n, [0, 1], [0, 1], clamp),
              }}
            >
              {f.name}
            </div>
          </React.Fragment>
        );
      })}
      {greyFade > 0 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: xAfter(5) - 100,
              width: 200,
              top: FLOWER_Y + 125,
              textAlign: "center",
              transform: "translateY(-50%)",
              fontSize: 52,
              color: C.muted,
              opacity: greyFade,
            }}
          >
            {Math.floor(grey)}
          </div>
          <div
            style={{
              position: "absolute",
              left: xAfter(5) - 100,
              width: 200,
              top: FLOWER_Y + 172,
              textAlign: "center",
              transform: "translateY(-50%)",
              fontSize: 24,
              fontStyle: "italic",
              color: C.muted,
              opacity: greyFade,
            }}
          >
            not Fibonacci
          </div>
        </>
      ) : null}

      {/* The Fibonacci row along the bottom; matching numbers light up */}
      {ROW.map((v, i) => {
        const k = ROW_LIGHT[i];
        const lit = k === undefined ? 0 : interpolate(frame, [cue(0, FLOWERS[k].end), cue(0, FLOWERS[k].end) + 8], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rowX(i) - 40,
              width: 80,
              top: 640,
              textAlign: "center",
              transform: `translateY(-50%) scale(${1 + 0.2 * lit})`,
              fontSize: 34,
              color: lit > 0.5 ? C.amber : C.muted,
              opacity: rowIn(i),
            }}
          >
            {v}
          </div>
        );
      })}

      {/* Beat 2 */}
      <Line at={cue(1, 0.1)} y={540} size={36} color={C.muted} style={{ fontStyle: "italic" }}>
        often, not always
      </Line>
      <Line at={cue(1, 0.87)} y={150} size={48} color={C.amber}>
        Why?
      </Line>
    </Stage>
  );
};

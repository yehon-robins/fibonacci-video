import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { C, clamp, F, Line, makeBeats, Op, Stage } from "../shared/kit";
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
  const start = T.S[0];
  const end = T.cue(0, 0.6);
  const t = interpolate(frame, [start, end], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const shift = t * (POS[POS.length - 1] - 900);
  const opacity =
    interpolate(frame, [T.B[0], T.B[0] + 12], [0, 1], clamp) *
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

export const Scene3A: React.FC = () => {
  const { S, B, cue } = T;
  return (
    <Stage title="Why We Want a Formula" timing={timing} S={S}>
      {/* Beat 1: computing term by term is slow */}
      <ScrollingRow />
      <Line at={cue(0, 0.08)} out={cue(0, 0.6)} y={240} size={64}>
        <F s="100" /> <Op>=</Op> <span style={{ color: C.amber }}>?</span>
      </Line>
      <Line at={cue(0, 0.66)} out={B[1]} y={380} size={110}>
        <F s="n" /> <Op>=</Op> <span style={{ color: C.amber }}>?</span>
      </Line>

      {/* Beat 2: the rule as an equation */}
      <Line at={S[1]} y={300} size={70}>
        <F s="n" /> <Op>=</Op> <F s="n−1" /> <Op>+</Op> <F s="n−2" />
      </Line>
      <Line at={cue(1, 0.3)} y={380} size={40} color={C.muted}>
        ⇣
      </Line>
      <Line at={cue(1, 0.35)} y={460} size={70}>
        <F s="n" /> <Op color={C.amber}>−</Op> <F s="n−1" color={C.amber} /> <Op color={C.amber}>−</Op>{" "}
        <F s="n−2" color={C.amber} /> <Op>=</Op> 0
      </Line>
    </Stage>
  );
};

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Boxed,
  C,
  clamp,
  ease,
  F,
  Frac,
  I,
  Lam,
  Line,
  makeBeats,
  MiniChart,
  Op,
  PHI,
  Stage,
  Sup,
} from "../shared/kit";
import timing from "./timing.json";

const T = makeBeats(timing);
export const SCENE3B_DURATION = T.duration;

const TERMS: React.ReactNode[] = [
  "1",
  <Lam key="1" />,
  <span key="2"><Lam /><Sup>2</Sup></span>,
  <span key="3"><Lam /><Sup>3</Sup></span>,
  <span key="4"><Lam /><Sup>4</Sup></span>,
  "…",
];
const termX = (i: number) => 265 + i * 150;
const ROW_Y = 410;
const termAt = (i: number) => T.cue(0, 0.15 + i * 0.07);

// Beat 1: 1, λ, λ², … with a "× λ" hop between every pair of neighbours.
const PowerRow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(frame, [T.B[1], T.B[1] + 15], [1, 0], clamp);
  return (
    <div style={{ opacity: out }}>
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        {TERMS.slice(1, 5).map((_, k) => {
          const i = k + 1;
          const draw = interpolate(frame, [termAt(i) - 8, termAt(i) + 6], [0, 1], ease);
          const x1 = termX(i - 1) + 10;
          const x2 = termX(i) - 10;
          return (
            <g key={i} opacity={draw > 0 ? 1 : 0}>
              <path
                d={`M ${x1} ${ROW_Y - 45} Q ${(x1 + x2) / 2} ${ROW_Y - 110} ${x2} ${ROW_Y - 45}`}
                fill="none"
                stroke={C.amber}
                strokeWidth={3}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
              />
              <text x={(x1 + x2) / 2} y={ROW_Y - 105} textAnchor="middle" fontFamily="Georgia, serif" fontSize={28} fill={C.amber} opacity={draw}>
                × λ
              </text>
            </g>
          );
        })}
      </svg>
      {TERMS.map((t, i) => {
        const p = spring({ frame: frame - termAt(i), fps, config: { damping: 14, stiffness: 160 } });
        if (frame < termAt(i)) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: termX(i),
              top: ROW_Y,
              transform: `translate(-50%, -50%) scale(${p})`,
              fontSize: 64,
            }}
          >
            {t}
          </div>
        );
      })}
    </div>
  );
};

export const Scene3B: React.FC = () => {
  const { S, B, cue } = T;
  const frame = useCurrentFrame();
  const insets = interpolate(frame, [S[1], S[1] + 15], [0, 1], clamp);
  const right = interpolate(frame, [cue(1, 0.12), cue(1, 0.12) + 15], [0, 1], clamp);
  return (
    <Stage title="The Guess" timing={timing} S={S}>
      {/* Beat 1 */}
      <PowerRow />
      <Line at={cue(0, 0.6)} out={B[1]} y={560} size={60}>
        <Frac n={<span><Lam /><Sup>n+1</Sup></span>} d={<span><Lam /><Sup>n</Sup></span>} />
        <Op>=</Op>
        <Boxed show={interpolate(frame, [cue(0, 0.8), cue(0, 0.8) + 12], [0, 1], clamp)}>
          <Lam />
        </Boxed>
      </Line>

      {/* Beat 2: Fibonacci's ratio is almost constant; λⁿ's is exactly constant */}
      <div style={{ position: "absolute", left: 130, top: 150, opacity: insets }}>
        <MiniChart at={S[1]} caption={<span><I>Fibonacci</I>: ratio almost constant</span>} />
      </div>
      <div style={{ position: "absolute", left: 750, top: 150, opacity: right }}>
        <MiniChart
          at={cue(1, 0.12)}
          values={Array(9).fill(PHI)}
          caption={<span><Lam /><Sup>n</Sup>: ratio exactly constant</span>}
        />
      </div>
      <Line at={cue(1, 0.35)} y={530} size={62}>
        <Boxed show={1} glow>
          <span style={{ color: C.amber }}>Guess:</span> <F s="n" /> <Op>=</Op> <Lam />
          <Sup>n</Sup>
        </Boxed>
        <span style={{ fontSize: "0.5em", color: C.muted, marginLeft: "0.6em" }}>
          (<Lam /> ≠ 0)
        </span>
      </Line>
      <Line at={cue(1, 0.72)} y={640} size={38} color={C.muted}>
        Which <Lam /> obeys <F s="n" /> = <F s="n−1" /> + <F s="n−2" /> ?
      </Line>
    </Stage>
  );
};

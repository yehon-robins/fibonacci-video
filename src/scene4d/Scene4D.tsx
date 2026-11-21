import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, clamp, ease, Line, makeBeats, Phi, PHI, Stage } from "../shared/kit";
import timing from "./timing.json";

const T = makeBeats(timing);
export const SCENE4D_DURATION = T.duration;

// The golden rectangle, 1 : φ
const RH = 215;
const RW = RH * PHI;
const RX = 640 - RW / 2;
const RY = 285 - RH / 2;

// Generic outline icons (not copies of any specific work).
const Temple: React.FC = () => (
  <g fill="none" stroke={C.text} strokeWidth={3} strokeLinejoin="round">
    <path d="M -75 -30 L 0 -68 L 75 -30 Z" />
    <line x1={-80} y1={-22} x2={80} y2={-22} />
    {[-58, -29, 0, 29, 58].map((x) => (
      <line key={x} x1={x} y1={-14} x2={x} y2={42} />
    ))}
    <line x1={-80} y1={50} x2={80} y2={50} />
    <line x1={-90} y1={60} x2={90} y2={60} />
  </g>
);
const Painting: React.FC = () => (
  <g fill="none" stroke={C.text} strokeWidth={3} strokeLinejoin="round">
    <rect x={-80} y={-50} width={160} height={100} />
    <rect x={-66} y={-37} width={132} height={74} strokeWidth={2} />
    <path d="M -66 30 L -30 -5 L -5 18 L 22 -14 L 66 30" strokeWidth={2} />
    <circle cx={40} cy={-18} r={8} strokeWidth={2} />
  </g>
);
const Card: React.FC = () => (
  <g fill="none" stroke={C.text} strokeWidth={3} strokeLinejoin="round">
    <rect x={-81} y={-50} width={162} height={100} rx={12} />
    <rect x={-62} y={-24} width={28} height={20} rx={4} strokeWidth={2} />
    <line x1={-62} y1={22} x2={30} y2={22} strokeWidth={2} />
    <line x1={-62} y1={34} x2={0} y2={34} strokeWidth={2} />
  </g>
);
const ICONS = [
  { el: <Temple />, x: 360, at: 0.12 },
  { el: <Painting />, x: 640, at: 0.18 },
  { el: <Card />, x: 920, at: 0.24 },
];
const ICON_Y = 500;

export const Scene4D: React.FC = () => {
  const frame = useCurrentFrame();
  const { S, cue } = T;
  const draw = interpolate(frame, [S[0], S[0] + 35], [0, 1], ease);
  const split = interpolate(frame, [S[0] + 35, S[0] + 55], [0, 1], ease);
  const labels = interpolate(frame, [S[0] + 25, S[0] + 40], [0, 1], clamp);
  const dim = interpolate(frame, [cue(0, 0.5), cue(0, 0.5) + 15], [1, 0.35], clamp);
  const glow = interpolate(frame, [cue(0, 0.78), cue(0, 0.78) + 20], [0, 1], clamp);

  return (
    <Stage title="The Golden Ratio and Beauty" timing={timing} S={S}>
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect
          x={RX}
          y={RY}
          width={RW}
          height={RH}
          fill={`rgba(251, 191, 36, ${0.04 + 0.1 * glow})`}
          stroke={C.amber}
          strokeWidth={4}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          style={{ filter: glow > 0 ? `drop-shadow(0 0 ${18 * glow}px rgba(251, 191, 36, 0.6))` : undefined }}
        />
        {/* A golden rectangle splits into a square and a smaller golden rectangle */}
        <line
          x1={RX + RH}
          y1={RY}
          x2={RX + RH}
          y2={RY + RH * split}
          stroke={C.amber}
          strokeOpacity={0.5}
          strokeWidth={2}
          strokeDasharray="8 8"
        />
        {ICONS.map((ic, k) => {
          const o = interpolate(frame, [cue(0, ic.at), cue(0, ic.at) + 15], [0, 1], clamp);
          return (
            <g key={k} transform={`translate(${ic.x} ${ICON_Y + (1 - o) * 15})`} opacity={o * 0.85 * dim}>
              {ic.el}
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: RX - 70,
          width: 50,
          top: RY + RH / 2,
          textAlign: "center",
          transform: "translateY(-50%)",
          fontSize: 40,
          opacity: labels,
        }}
      >
        1
      </div>
      <div
        style={{
          position: "absolute",
          left: RX,
          width: RW,
          top: RY - 32,
          textAlign: "center",
          transform: "translateY(-50%)",
          fontSize: 40,
          opacity: labels,
        }}
      >
        <Phi />
      </div>
      <Line at={cue(0, 0.3)} y={615} size={38} style={{ fontStyle: "italic" }}>
        pleasing proportions?
      </Line>
      <Line at={cue(0, 0.52)} y={665} size={26} color={C.muted}>
        still debated: studies give mixed results
      </Line>
    </Stage>
  );
};

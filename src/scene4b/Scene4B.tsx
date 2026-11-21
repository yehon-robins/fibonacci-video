import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, ease, Frac, Line, Phi, Stage, Sup } from "../shared/kit";
import { makeBeatsPadded } from "../scene4a/beats";
import { GOLDEN_ANGLE, seedPos, Sunflower } from "../shared/nature";
import timing from "./timing.json";

// Beat 1 gets extra room after its narration for the fast growth phase.
const T = makeBeatsPadded(timing, [2.7, 1.3, 2]);
export const SCENE4B_DURATION = T.duration;

const CX = 640;
const CY = 385;
const TOTAL = 600;
const C_GROW = 9.5; // seed spacing in the growth model (radius = c·√age)
const RAD = Math.PI / 180;

// ---------------------------------------------------------------------------
// Beat 1: seeds are born at the centre, each turned 137.5° from the last, and
// older seeds drift outward. Seed j sits at angle j·θ, radius c·√(N − j).
// ---------------------------------------------------------------------------

const SLOW = 10; // seeds placed one by one, with the turn shown
const MARK_FROM = 4; // the turn is drawn from this seed on ("a fixed turn")
const slowStart = () => T.cue(0, 0.05);
const slowEnd = () => T.cue(0, 0.97); // end of narration: start the fast phase
const fastEnd = () => T.B[1] - 22; // sunflower complete, held briefly
const seedsAt = (frame: number) => {
  const s0 = slowStart();
  const s1 = slowEnd();
  if (frame < s0) return 0;
  if (frame < s1) return interpolate(frame, [s0, s1], [0.3, SLOW], clamp);
  return interpolate(frame, [s1, fastEnd()], [SLOW, TOTAL], { ...clamp, easing: Easing.inOut(Easing.cubic) });
};
const dir = (j: number) => j * GOLDEN_ANGLE * RAD - Math.PI / 2;

const Growth: React.FC = () => {
  const frame = useCurrentFrame();
  const N = seedsAt(frame);
  const out = interpolate(frame, [T.S[1] - 2, T.S[1] + 14], [1, 0], clamp);
  if (out <= 0 || N <= 0) return null;

  // Zoom in while there are only a few seeds.
  const zoom = interpolate(N, [1, SLOW, 60, TOTAL], [5, 3.4, 1.6, 1], clamp);
  // In the slow phase a new seed appears once the turn has been drawn.
  const slow = interpolate(N, [SLOW, SLOW + 4], [1, 0], clamp);
  const delay = 0.35 * slow;
  const growDur = 0.25 * slow + 0.33 * (1 - slow);
  const k = Math.floor(N);
  const t = N - k;
  const newest = t >= delay ? k : k - 1;
  const seeds: React.ReactNode[] = [];
  for (let j = 0; j <= k && j < TOTAL; j++) {
    const age = N - j;
    const grow = Math.max(0, Math.min(1, (age - delay) / growDur));
    if (grow <= 0) continue;
    const a = dir(j);
    const r = C_GROW * Math.sqrt(age) * zoom;
    seeds.push(
      <circle
        key={j}
        cx={CX + r * Math.cos(a)}
        cy={CY + r * Math.sin(a)}
        r={5 * Math.sqrt(zoom) * grow}
        fill={j === newest && slow > 0.5 ? C.text : C.amber}
      />,
    );
  }

  // The turn from the previous seed to the new one: a ray sweeps 137.5° and
  // an arc (outside the seeds, so nothing overlaps) traces it.
  const markShow =
    interpolate(N, [MARK_FROM - 0.1, MARK_FROM + 0.3], [0, 1], clamp) *
    interpolate(frame, [slowEnd() - 6, slowEnd() + 8], [1, 0], clamp);
  let angleMark: React.ReactNode = null;
  if (markShow > 0 && k >= 1) {
    const L = 160;
    const R = 128;
    const p = (a: number, r: number) => `${(CX + r * Math.cos(a)).toFixed(2)} ${(CY + r * Math.sin(a)).toFixed(2)}`;
    const sweep = Easing.inOut(Easing.cubic)(Math.min(1, t / 0.4));
    const a0 = dir(k - 1);
    const a1 = a0 + GOLDEN_ANGLE * RAD * sweep;
    const ghost = interpolate(t, [0, 0.2], [1, 0], clamp);
    const ray = (a: number, color: string, opacity = 1) => (
      <line x1={CX} y1={CY} x2={CX + L * Math.cos(a)} y2={CY + L * Math.sin(a)} stroke={color} strokeWidth={2} strokeDasharray="6 6" opacity={opacity} />
    );
    angleMark = (
      <g opacity={markShow}>
        {k >= 2 && ghost > 0 ? (
          <g opacity={ghost * 0.6}>
            {ray(dir(k - 2), C.muted)}
            <path d={`M ${p(dir(k - 2), R)} A ${R} ${R} 0 0 1 ${p(a0, R)}`} fill="none" stroke={C.amber} strokeWidth={3} />
          </g>
        ) : null}
        {ray(a0, C.muted)}
        {sweep > 0.01 ? (
          <>
            {ray(a1, C.text)}
            <path d={`M ${p(a0, R)} A ${R} ${R} 0 0 1 ${p(a1, R)}`} fill="none" stroke={C.amber} strokeWidth={3.5} strokeLinecap="round" />
          </>
        ) : null}
        <circle cx={CX} cy={CY} r={3} fill={C.muted} />
      </g>
    );
  }

  return (
    <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0, opacity: out }}>
      {angleMark}
      {seeds}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Beat 2: three panels with nearly the same angle.
// ---------------------------------------------------------------------------

const PANELS = [
  { angle: 135, label: "135°", x: 260 },
  { angle: GOLDEN_ANGLE, label: "137.5°", x: 640 },
  { angle: 140, label: "140°", x: 1020 },
];
const PANEL_Y = 445;
const PANEL_R = 135;

const Panels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cue, B } = T;
  const out = interpolate(frame, [B[2] - 8, B[2] + 4], [1, 0], clamp);
  if (out <= 0) return null;
  // 137.5° on "never line up into rows", the others on "change the angle".
  const startOf = (k: number) => (k === 1 ? cue(1, 0.53) : cue(1, 0.81));
  // ✓ on "no wasted space"; "gaps" on "gaps appear".
  const check = spring({ frame: frame - cue(1, 0.7), fps, config: { damping: 10, stiffness: 140 } });
  const gaps = interpolate(frame, [cue(1, 0.93), cue(1, 0.93) + 10], [0, 1], clamp);
  return (
    <>
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0, opacity: out }}>
        {PANELS.map((p, k) => {
          const shown = interpolate(frame, [startOf(k), startOf(k) + 40], [0, 300], {
            ...clamp,
            easing: Easing.out(Easing.quad),
          });
          if (shown <= 0) return null;
          const frameIn = interpolate(frame, [startOf(k) - 8, startOf(k) + 6], [0, 1], clamp);
          return (
            <g key={k}>
              <rect
                x={p.x - PANEL_R - 18}
                y={PANEL_Y - PANEL_R - 18}
                width={2 * PANEL_R + 36}
                height={2 * PANEL_R + 36}
                rx={18}
                fill="none"
                stroke={k === 1 ? C.amber : C.grid}
                strokeWidth={k === 1 ? 3 * check + 2 * (1 - check) : 2}
                opacity={frameIn}
              />
              <Sunflower count={300} shown={shown} cx={p.x} cy={PANEL_Y} radius={PANEL_R - 5} angle={p.angle} />
            </g>
          );
        })}
      </svg>
      {PANELS.map((p, k) => (
        <Line key={k} at={startOf(k)} out={B[2] - 8} x={p.x} y={PANEL_Y + PANEL_R + 50} size={32} color={k === 1 ? C.amber : C.muted}>
          {p.label}
          {k === 1 ? <span style={{ color: C.green, marginLeft: 12, opacity: check }}>✓</span> : null}
          {k !== 1 ? (
            <span style={{ fontSize: "0.75em", fontStyle: "italic", marginLeft: 10, opacity: 0.9 * gaps }}>gaps</span>
          ) : null}
        </Line>
      ))}
    </>
  );
};

// ---------------------------------------------------------------------------
// Beat 3: count the two families of spirals (34 and 55).
// ---------------------------------------------------------------------------

const HEAD = 800;
const HEAD_R = 212;
const HEAD_Y = 345;
const HEAD_C = HEAD_R / Math.sqrt(HEAD);
// Each family is only a clean spiral outside a certain radius (seed index).
const FAMILIES = [
  // Drawn from "look at the spirals", each count landing as it is spoken.
  { count: 34, color: C.blue, from: 0.02, to: 0.26, side: 210, nMin: 170 },
  { count: 55, color: C.green, from: 0.31, to: 0.48, side: 1070, nMin: 330 },
];

const spiralPath = (m: number, step: number, nMin: number) => {
  const pts: string[] = [];
  for (let n = m; n < HEAD; n += step) {
    if (n < nMin) continue;
    const p = seedPos(n, GOLDEN_ANGLE, HEAD_C);
    pts.push(`${(CX + p.x).toFixed(1)} ${(HEAD_Y + p.y).toFixed(1)}`);
  }
  return pts.length > 1 ? `M ${pts.join(" L ")}` : "";
};

const ROW = ["5", "8", "13", "21", "34", "55", "89", "…"];
const rowX = (i: number) => 640 + (i - (ROW.length - 1) / 2) * 92;
const ROW_Y = 615;

const Spirals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { S, cue } = T;
  const headIn = interpolate(frame, [S[2] - 8, S[2] + 8], [0, 1], clamp);
  if (headIn <= 0) return null;
  const FLY = cue(2, 0.5); // "two neighbouring Fibonacci numbers"
  const rowIn = interpolate(frame, [FLY - 12, FLY + 3], [0, 1], clamp);

  return (
    <>
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0, opacity: headIn }}>
        <Sunflower count={HEAD} cx={CX} cy={HEAD_Y} radius={HEAD_R} />
        {FAMILIES.map((f, k) => {
          const drawn = interpolate(frame, [cue(2, f.from), cue(2, f.to)], [0, f.count], clamp);
          // The 34 family dims while the 55 family is drawn, so each stays
          // readable, then comes back so both families show together.
          const dimmed =
            k === 0
              ? interpolate(frame, [cue(2, 0.27), cue(2, 0.31), FLY + 10, FLY + 30], [1, 0.22, 0.22, 0.75], clamp)
              : 1;
          return (
            <g key={f.count} opacity={dimmed}>
              {Array.from({ length: f.count }, (_, m) => {
                const p = Math.max(0, Math.min(1, drawn - m));
                if (p <= 0) return null;
                return (
                  <path
                    key={m}
                    d={spiralPath(m, f.count, f.nMin)}
                    fill="none"
                    stroke={f.color}
                    strokeWidth={3}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - p}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Counters, which then fly into the row */}
      {FAMILIES.map((f, k) => {
        const drawn = interpolate(frame, [cue(2, f.from), cue(2, f.to)], [0, f.count], clamp);
        if (drawn <= 0) return null;
        const fly = spring({ frame: frame - FLY, fps, config: { damping: 200 }, durationInFrames: 30 });
        const tx = rowX(4 + k);
        const x = interpolate(fly, [0, 1], [f.side, tx]);
        const y = interpolate(fly, [0, 1], [HEAD_Y, ROW_Y]);
        const size = interpolate(fly, [0, 1], [96, 40]);
        return (
          <React.Fragment key={f.count}>
            <div
              style={{
                position: "absolute",
                left: x - 150,
                width: 300,
                top: y,
                textAlign: "center",
                transform: "translateY(-50%)",
                fontSize: size,
                color: fly > 0.95 ? C.amber : f.color,
              }}
            >
              {Math.ceil(drawn)}
            </div>
            <div
              style={{
                position: "absolute",
                left: f.side - 150,
                width: 300,
                top: HEAD_Y + 75,
                textAlign: "center",
                transform: "translateY(-50%)",
                fontSize: 26,
                fontStyle: "italic",
                color: C.muted,
                opacity: interpolate(fly, [0, 0.4], [1, 0], clamp),
              }}
            >
              spirals
            </div>
          </React.Fragment>
        );
      })}

      {/* The Fibonacci row: 34 and 55 land side by side */}
      {ROW.map((v, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: rowX(i) - 45,
            width: 90,
            top: ROW_Y,
            textAlign: "center",
            transform: "translateY(-50%)",
            fontSize: 40,
            color: C.muted,
            opacity: i === 4 || i === 5 ? 0 : rowIn,
          }}
        >
          {v}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: rowX(4) - 50,
          top: ROW_Y - 36,
          width: rowX(5) - rowX(4) + 100,
          height: 72,
          border: `3px solid ${C.amber}`,
          borderRadius: 16,
          opacity: interpolate(frame, [FLY + 25, FLY + 40], [0, 1], clamp),
        }}
      />
      <Line at={cue(2, 0.74)} y={680} size={26} color={C.muted} style={{ fontStyle: "italic" }}>
        pinecones: 8 and 13 · pineapples: 8, 13 and 21
      </Line>
    </>
  );
};

export const Scene4B: React.FC = () => {
  const frame = useCurrentFrame();
  const { S, B, cue } = T;
  const formulaUp = interpolate(frame, [cue(1, 0.5), cue(1, 0.5) + 20], [0, 1], ease);
  return (
    <Stage title="The Golden Angle" timing={timing} S={S}>
      <Growth />
      {/* Beat 1: the turn, named as it is spoken, held through the fast growth */}
      <Line at={cue(0, 0.72)} out={S[1] - 2} x={1050} y={365} size={60} color={C.amber}>
        137.5°
      </Line>
      <Line at={cue(0, 0.76)} out={S[1] - 2} x={1050} y={420} size={26} color={C.muted} style={{ fontStyle: "italic" }}>
        turn between seeds
      </Line>

      {/* Beat 2: 360° / φ² ≈ 137.5° — the golden angle */}
      <Line at={cue(1, 0.04)} out={B[2] - 8} y={interpolate(formulaUp, [0, 1], [330, 150])} size={interpolate(formulaUp, [0, 1], [80, 52])}>
        <Frac n="360°" d={<span><Phi />
          <Sup>2</Sup></span>} />
        <span style={{ margin: "0 0.3em", color: C.muted }}>≈</span>
        <span style={{ color: C.amber }}>137.5°</span>
      </Line>
      <Line at={cue(1, 0.08)} out={cue(1, 0.5)} y={450} size={44} color={C.amber} style={{ fontStyle: "italic" }}>
        the golden angle
      </Line>
      <Line at={cue(1, 0.33)} out={cue(1, 0.5)} y={520} size={30} color={C.muted}>
        <Phi /> is the hardest number to approximate with fractions
      </Line>
      <Panels />

      <Spirals />
    </Stage>
  );
};

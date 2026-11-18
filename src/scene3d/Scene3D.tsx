import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Annot, C, clamp, ease, F, I, Line, makeBeats, Op, Phi, Psi, Stage, Sup } from "../shared/kit";
import timing from "./timing.json";

const T = makeBeats(timing);
export const SCENE3D_DURATION = T.duration;

// ---------------------------------------------------------------------------
// Beat 1: table of φⁿ and ψⁿ
// ---------------------------------------------------------------------------

const PHI_ROW = ["1", "1.618", "2.618", "4.236", "6.854"];
const PSI_ROW = ["1", "−0.618", "0.382", "−0.236", "0.146"];
const FIB_ROW = ["0", "1", "1", "2", "3"];
const colX = (j: number) => 390 + j * 158;

const TableRow: React.FC<{
  label: React.ReactNode;
  values: string[];
  y: number;
  at: number;
  out: number;
  color?: string;
  highlight?: { at: number; color: string };
}> = ({ label, values, y, at, out, color = C.text, highlight }) => {
  const frame = useCurrentFrame();
  const o =
    interpolate(frame, [at, at + 12], [0, 1], clamp) * interpolate(frame, [out, out + 12], [1, 0], clamp);
  const h = highlight ? interpolate(frame, [highlight.at, highlight.at + 10], [0, 1], clamp) : 0;
  const cell = (x: number, content: React.ReactNode, key: string | number, boxed = false) => (
    <div
      key={key}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        fontSize: 36,
        color,
        whiteSpace: "nowrap",
        padding: "4px 12px",
        borderRadius: 10,
        border: `3px solid ${boxed && highlight ? highlight.color : "transparent"}`,
        borderColor: boxed && highlight ? `${highlight.color}${Math.round(h * 255).toString(16).padStart(2, "0")}` : "transparent",
      }}
    >
      {content}
    </div>
  );
  return (
    <div style={{ opacity: o }}>
      {cell(200, label, "label")}
      {values.map((v, j) => cell(colX(j), v, j, j >= 1 && j <= 3))}
      {cell(colX(5), "…", "dots")}
    </div>
  );
};

// A small slider "knob" drawn under A and B.
const Knob: React.FC<{ phase: number }> = ({ phase }) => {
  const frame = useCurrentFrame();
  const pos = 0.5 + 0.4 * Math.sin(frame / 14 + phase);
  return (
    <svg width={90} height={30} style={{ display: "block" }}>
      <line x1={8} x2={82} y1={15} y2={15} stroke={C.muted} strokeWidth={4} strokeLinecap="round" />
      <circle cx={8 + 74 * pos} cy={15} r={10} fill={C.amber} />
    </svg>
  );
};

// Beat 3: two fixed starting terms decide all the rest.
const Cascade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cue, B } = T;
  const enter = interpolate(frame, [B[2], B[2] + 15], [0, 1], clamp);
  const x = (j: number) => 220 + j * 120;
  const y = 430;
  const litAt = (j: number) => (j < 2 ? cue(2, 0.22) : cue(2, 0.42) + (j - 2) * 9);
  return (
    <div style={{ opacity: enter }}>
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        {[2, 3, 4, 5, 6, 7].flatMap((j) =>
          [j - 2, j - 1].map((k) => {
            const d = interpolate(frame, [litAt(j) - 8, litAt(j)], [0, 1], ease);
            const h = k === j - 2 ? 80 : 45;
            return (
              <path
                key={`${j}-${k}`}
                d={`M ${x(k)} ${y - 50} Q ${(x(k) + x(j)) / 2} ${y - 50 - h} ${x(j)} ${y - 52}`}
                fill="none"
                stroke={C.amber}
                strokeOpacity={0.7}
                strokeWidth={2.5}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - d}
              />
            );
          }),
        )}
      </svg>
      {Array.from({ length: 8 }, (_, j) => {
        const lit = spring({ frame: frame - litAt(j), fps, config: { damping: 200 }, durationInFrames: 12 });
        const fixed = j < 2;
        return (
          <div
            key={j}
            style={{
              position: "absolute",
              left: x(j) - 45,
              top: y - 45,
              width: 90,
              height: 90,
              borderRadius: 14,
              border: `3px solid ${fixed ? C.amber : C.muted}`,
              background: fixed ? `rgba(251,191,36,${0.25 * lit})` : `rgba(248,250,252,${0.12 * lit})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: fixed ? C.amber : C.text,
            }}
          >
            <F s={j} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: x(0) - 60,
          width: 240,
          top: y + 60,
          textAlign: "center",
          fontSize: 26,
          color: C.amber,
          opacity: interpolate(frame, [cue(2, 0.22), cue(2, 0.22) + 12], [0, 1], clamp),
        }}
      >
        fixed
      </div>
    </div>
  );
};

export const Scene3D: React.FC = () => {
  const { S, B, cue } = T;
  const frame = useCurrentFrame();
  const knobs = interpolate(frame, [cue(1, 0.78), cue(1, 0.78) + 12], [0, 1], clamp);
  const AB = (l: string, phase: number) => (
    <Annot note={<Knob phase={phase} />} show={knobs} size="1em">
      <span style={{ color: C.amber }}>{l}</span>
    </Annot>
  );

  return (
    <Stage title="Building Fₙ from Two Pieces" timing={timing} S={S}>
      {/* Beat 1: φⁿ and ψⁿ obey the rule, but aren't Fibonacci */}
      <TableRow label={<I>n</I>} values={["0", "1", "2", "3", "4"]} y={175} at={S[0]} out={B[1]} color={C.muted} />
      <TableRow
        label={<span><Phi /><Sup>n</Sup></span>}
        values={PHI_ROW}
        y={265}
        at={cue(0, 0.03)}
        out={B[1]}
        highlight={{ at: cue(0, 0.2), color: C.amber }}
      />
      <TableRow
        label={<span><Psi /><Sup>n</Sup></span>}
        values={PSI_ROW}
        y={355}
        at={cue(0, 0.1)}
        out={B[1]}
        highlight={{ at: cue(0, 0.3), color: C.blue }}
      />
      <Line at={cue(0, 0.2)} out={cue(0, 0.5)} y={460} size={34} color={C.amber}>
        1.618 + 2.618 = 4.236 ✓
      </Line>
      <Line at={cue(0, 0.3)} out={cue(0, 0.5)} y={515} size={34} color={C.blue}>
        −0.618 + 0.382 = −0.236 ✓
      </Line>
      <TableRow label={<F s="n" />} values={FIB_ROW} y={520} at={cue(0, 0.55)} out={B[1]} />
      <Line at={cue(0, 0.58)} out={B[1]} y={440} x={200} size={60} color={C.red}>
        ≠
      </Line>

      {/* Beat 2: any mix A·φⁿ + B·ψⁿ still obeys the rule */}
      <Line at={S[1]} y={220} size={66} moveAt={B[2]} toY={185} toSize={54}>
        <F s="n" /> <Op>=</Op> {AB("A", 0)}·<Phi />
        <Sup>n</Sup> <Op>+</Op> {AB("B", 2)}·<Psi />
        <Sup>n</Sup>
      </Line>
      <Line at={cue(1, 0.2)} out={B[2]} y={390} size={38}>
        <span style={{ color: C.amber }}>A</span>·<Phi />
        <Sup>n</Sup> = <span style={{ color: C.amber }}>A</span>·<Phi />
        <Sup>n−1</Sup> + <span style={{ color: C.amber }}>A</span>·<Phi />
        <Sup>n−2</Sup>
      </Line>
      <Line at={cue(1, 0.28)} out={B[2]} y={450} size={38}>
        <span style={{ color: C.muted }}>+ </span>
        <span style={{ color: C.amber }}>B</span>·<Psi />
        <Sup>n</Sup> = <span style={{ color: C.amber }}>B</span>·<Psi />
        <Sup>n−1</Sup> + <span style={{ color: C.amber }}>B</span>·<Psi />
        <Sup>n−2</Sup>
      </Line>
      <Line at={cue(1, 0.36)} out={B[2]} y={490} size={38}>
        <div style={{ width: 640, height: 3, background: C.muted, margin: "0 auto" }} />
      </Line>
      <Line at={cue(1, 0.4)} out={B[2]} y={540} size={34}>
        (A<Phi /><Sup>n</Sup> + B<Psi /><Sup>n</Sup>) = (A<Phi /><Sup>n−1</Sup> + B<Psi />
        <Sup>n−1</Sup>) + (A<Phi /><Sup>n−2</Sup> + B<Psi /><Sup>n−2</Sup>)
      </Line>
      <Line at={cue(1, 0.52)} out={B[2]} y={615} size={34} color={C.green}>
        ✓ the mix obeys the rule too
      </Line>

      {/* Beat 3: two starting values fix the whole sequence */}
      <Cascade />
      <Line at={cue(2, 0.7)} y={600} size={38}>
        match <F s="0" color={C.amber} /> and <F s="1" color={C.amber} /> <Op>⇒</Op> match every <F s="n" />
      </Line>
    </Stage>
  );
};

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Boxed, C, clamp, F, Frac, Line, makeBeats, Op, Phi, Psi, Root, Stage, Sup } from "../shared/kit";
import timing from "./timing.json";

// Slightly tighter than the default gaps so the pause between beats stays under ~1.5 s.
const T = makeBeats(timing, 1.1, 1.8);
export const SCENE3E_DURATION = T.duration;

// A clear "cancel" slash across a single symbol, which also dims it. The shared
// Strike is tuned for wider terms and reads as a small tick on a lone "1".
const Cancel: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    <span style={{ opacity: 1 - 0.5 * p }}>{children}</span>
    <span
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${1.15 * p}em`,
        height: "0.08em",
        background: C.red,
        borderRadius: 3,
        transform: "translate(-50%, -50%) rotate(-60deg)",
      }}
    />
  </span>
);

const A = () => <span style={{ color: C.amber }}>A</span>;
const Bc = () => <span style={{ color: C.amber }}>B</span>;

// Beat 1: the row gains an F₀ slot on the left, which turns out to be 0.
const RowWithZero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { S, B, cue } = T;
  const values = ["", "1", "1", "2", "3", "5", "8"];
  const x = (j: number) => 250 + j * 130;
  const y = 290;
  const o = interpolate(frame, [S[0], S[0] + 12], [0, 1], clamp) * interpolate(frame, [B[1], B[1] + 12], [1, 0], clamp);
  const slot0 = interpolate(frame, [cue(0, 0.05), cue(0, 0.05) + 12], [0, 1], clamp);
  const drop = spring({ frame: frame - cue(0, 0.42), fps, config: { damping: 12, stiffness: 140 } });
  const hl = interpolate(frame, [cue(0, 0.57), cue(0, 0.57) + 12], [0, 1], clamp);
  return (
    <div style={{ opacity: o }}>
      {values.map((v, j) => {
        const isStart = j <= 1;
        return (
          <div
            key={j}
            style={{
              position: "absolute",
              left: x(j) - 50,
              top: y - 50,
              width: 100,
              height: 100,
              borderRadius: 14,
              border: `3px ${j === 0 ? "dashed" : "solid"} ${isStart && hl > 0 ? C.amber : C.muted}`,
              background: isStart ? `rgba(251,191,36,${0.2 * hl})` : "transparent",
              opacity: j === 0 ? slot0 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
            }}
          >
            {j === 0 ? (
              frame >= cue(0, 0.42) ? (
                <span style={{ color: C.amber, transform: `translateY(${(1 - drop) * -60}px)`, opacity: Math.min(1, drop * 2) }}>0</span>
              ) : null
            ) : (
              v
            )}
            <div style={{ position: "absolute", top: 106, fontSize: 32, color: C.muted }}>
              <F s={j} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Scene3E: React.FC = () => {
  const { S, B, cue } = T;
  const frame = useCurrentFrame();
  const show = (at: number) => interpolate(frame, [at, at + 12], [0, 1], clamp);
  const strike = interpolate(frame, [cue(2, 0.36), cue(2, 0.36) + 12], [0, 1], clamp);

  return (
    <Stage title="Finding A and B" timing={timing} S={S}>
      {/* Beat 1: step back to F₀ = 0 */}
      <RowWithZero />
      <Line at={cue(0, 0.18)} out={B[1]} y={480} size={46}>
        <F s="2" /> <Op>=</Op> <F s="1" /> <Op>+</Op> <F s="0" />{" "}
        <span style={{ opacity: show(cue(0, 0.25)) }}>
          <Op>→</Op> 1 <Op>=</Op> 1 <Op>+</Op> <F s="0" />
        </span>{" "}
        <span style={{ opacity: show(cue(0, 0.4)) }}>
          <Op>→</Op> <F s="0" color={C.amber} /> <Op>=</Op> <span style={{ color: C.amber }}>0</span>
        </span>
      </Line>
      <Line at={cue(0, 0.57)} out={B[1]} y={590} size={42}>
        <Boxed show={1}>
          <F s="0" /> = 0, &nbsp; <F s="1" /> = 1
        </Boxed>
        <span style={{ opacity: show(cue(0, 0.82)), color: C.muted, fontSize: "0.8em", marginLeft: "1em" }}>
          and <Phi />
          <Sup>0</Sup> = <Psi />
          <Sup>0</Sup> = 1
        </span>
      </Line>

      {/* Beat 2: two equations */}
      <Line at={S[1] + 4} out={B[2]} y={200} size={44}>
        <span style={{ color: C.muted }}>n = 0: &nbsp;</span>
        <A />·<Phi />
        <Sup>0</Sup> + <Bc />·<Psi />
        <Sup>0</Sup> = 0{" "}
        <span style={{ opacity: show(cue(1, 0.1)) }}>
          <Op>→</Op> <A /> + <Bc /> = 0
        </span>{" "}
        <span style={{ opacity: show(cue(1, 0.2)) }}>
          <Op>→</Op>{" "}
          <Boxed show={1}>
            <Bc /> = −<A />
          </Boxed>
        </span>
      </Line>
      <Line at={cue(1, 0.35)} out={B[2]} y={320} size={44}>
        <span style={{ color: C.muted }}>n = 1: &nbsp;</span>
        <A />·<Phi /> + <Bc />·<Psi /> = 1
      </Line>
      <Line at={cue(1, 0.6)} y={440} size={44} moveAt={B[2]} toY={190}>
        <A />·<Phi /> − <A />·<Psi /> = 1{" "}
        <span style={{ opacity: show(cue(1, 0.78)) }}>
          <Op>→</Op> <A />(<Phi /> − <Psi />) = 1
        </span>
      </Line>

      {/* Beat 3: φ − ψ = √5 */}
      <Line at={S[2] + 4} y={350} size={48}>
        <Phi /> − <Psi /> <Op>=</Op>
        <Frac n={<span><Cancel p={strike}>1</Cancel> + <Root>5</Root></span>} d="2" />
        <Op>−</Op>
        <Frac n={<span><Cancel p={strike}>1</Cancel> − <Root>5</Root></span>} d="2" />
      </Line>
      <Line at={cue(2, 0.55)} y={470} size={48}>
        <Op>=</Op> <Frac n={<span>2<Root>5</Root></span>} d="2" /> <Op>=</Op>
        <Boxed show={show(cue(2, 0.85))}>
          <Root>5</Root>
        </Boxed>
      </Line>

      {/* Beat 4: the coefficients */}
      <Line at={S[3]} y={600} size={48}>
        <A />·<Root>5</Root> = 1 <Op>⇒</Op>
        <Boxed show={show(S[3] + 15)} glow>
          <A /> = <Frac n="1" d={<Root>5</Root>} />
        </Boxed>
        <span style={{ opacity: show(cue(3, 0.46)) }}>
          , &nbsp;
          <Boxed show={show(cue(3, 0.46) + 10)} glow>
            <Bc /> = −<Frac n="1" d={<Root>5</Root>} />
          </Boxed>
        </span>
      </Line>
    </Stage>
  );
};

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  Annot,
  Boxed,
  C,
  clamp,
  F,
  Frac,
  I,
  Lam,
  Line,
  makeBeats,
  Op,
  Phi,
  Psi,
  Root,
  Stage,
  Sup,
} from "../shared/kit";
import timing from "./timing.json";

// Slightly tighter gaps than the kit default so pauses stay under ~1.5 s.
const T = makeBeats(timing, 1.1, 1.6);
export const SCENE3C_DURATION = T.duration;

const L: React.FC<{ e: React.ReactNode; color?: string }> = ({ e, color }) => (
  <span>
    <Lam />
    <Sup color={color}>{e}</Sup>
  </span>
);

export const Scene3C: React.FC = () => {
  const { S, B, cue } = T;
  const frame = useCurrentFrame();
  const show = (at: number) => interpolate(frame, [at, at + 12], [0, 1], clamp);
  const divide = show(cue(1, 0.1));
  const ruleBox = show(cue(3, 0.86));
  const divNote = (
    <span>
      ÷ <L e="n−2" />
    </span>
  );
  const A = <span style={{ color: C.amber }}>a</span>;
  const Bk = <span style={{ color: C.blue }}>b</span>;
  const Ck = <span style={{ color: C.green }}>c</span>;

  return (
    <Stage title="The Golden Ratio Appears" timing={timing} S={S}>
      {/* Beat 1: substitute the guess into the rule */}
      <Line at={S[0]} out={B[1]} y={250} size={64}>
        <F s="n" /> <Op>=</Op> <F s="n−1" /> <Op>+</Op> <F s="n−2" />
      </Line>
      <Line at={cue(0, 0.2)} out={B[1]} y={330} size={34} color={C.muted}>
        <span style={{ fontSize: "1.5em", verticalAlign: "-0.1em" }}>↓</span> &nbsp;<I>F</I> → <Lam />
      </Line>
      <Line at={cue(0, 0.3)} out={B[2] - 14} y={410} size={64} moveAt={B[1]} toY={200}>
        <Annot note={divNote} show={divide} size="0.55em">
          <L e="n" />
        </Annot>{" "}
        <Op>=</Op>{" "}
        <Annot note={divNote} show={divide} size="0.55em">
          <L e="n−1" />
        </Annot>{" "}
        <Op>+</Op>{" "}
        <Annot note={divNote} show={divide} size="0.55em">
          <L e="n−2" />
        </Annot>
      </Line>

      {/* Beat 2: divide by λⁿ⁻² */}
      <Line at={cue(1, 0.34)} out={cue(1, 0.69)} y={390} size={64}>
        <span style={{ opacity: show(cue(1, 0.36)) }}>
          <L e="2" color={C.amber} />
        </span>{" "}
        <span style={{ opacity: show(cue(1, 0.5)) }}>
          <Op>=</Op> <L e="1" color={C.amber} />
        </span>{" "}
        <span style={{ opacity: show(cue(1, 0.62)) }}>
          <Op>+</Op> <L e="0" color={C.amber} />
        </span>
      </Line>
      <Line at={cue(1, 0.72)} out={B[2] - 14} y={390} size={64}>
        <L e="2" /> <Op>=</Op> <Lam /> <Op>+</Op> 1
      </Line>
      <Line at={cue(1, 0.86)} y={520} size={64} moveAt={B[2]} toY={190} toSize={54}>
        <Boxed show={ruleBox} glow>
          <L e="2" /> <Op>−</Op> <Lam /> <Op>−</Op> 1 <Op>=</Op> 0
        </Boxed>
      </Line>

      {/* Beat 3: quadratic formula */}
      <Line at={S[2]} y={275} size={36} color={C.muted}>
        {A} = 1, &nbsp; {Bk} = −1, &nbsp; {Ck} = −1
      </Line>
      <Line at={cue(2, 0.06)} y={390} size={50}>
        <Lam /> <Op>=</Op>
        <Frac
          n={
            <span>
              −{Bk} ± <Root>{Bk}² − 4{A}{Ck}</Root>
            </span>
          }
          d={<span>2{A}</span>}
        />
        <span style={{ opacity: show(cue(2, 0.2)) }}>
          <Op>=</Op>
          <Frac n={<span>1 ± <Root>1 + 4</Root></span>} d="2" />
        </span>
        <span style={{ opacity: show(cue(2, 0.32)) }}>
          <Op>=</Op>
          <Frac n={<span>1 ± <Root>5</Root></span>} d="2" />
        </span>
      </Line>
      <Line at={cue(2, 0.45)} y={545} x={330} size={42}>
        <Boxed show={show(S[3])} glow>
          <Phi /> <Op>=</Op> <Frac n={<span>1 + <Root>5</Root></span>} d="2" />
          <Op>≈</Op> <span style={{ color: C.amber }}>1.618</span>
        </Boxed>
      </Line>
      <Line at={cue(2, 0.72)} y={545} x={950} size={42}>
        <Psi /> <Op>=</Op> <Frac n={<span>1 − <Root>5</Root></span>} d="2" />
        <Op>≈</Op> <span style={{ color: C.blue }}>−0.618</span>
      </Line>

      {/* Beat 4: the golden ratio is forced by the rule */}
      <Line at={cue(3, 0.12)} y={655} x={330} size={34} color={C.amber}>
        the golden ratio from before ✓
      </Line>
      <Line at={cue(3, 0.52)} y={655} x={950} size={34} color={C.muted}>
        <Psi /> = −1 / <Phi />
      </Line>
    </Stage>
  );
};

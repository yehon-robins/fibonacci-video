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

const T = makeBeats(timing);
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
  const A = <span style={{ color: C.amber }}>a</span>;
  const Bk = <span style={{ color: C.blue }}>b</span>;
  const Ck = <span style={{ color: C.green }}>c</span>;

  return (
    <Stage title="The Golden Ratio Appears" timing={timing} S={S}>
      {/* Beat 1: substitute the guess into the rule */}
      <Line at={S[0]} out={B[1]} y={250} size={64}>
        <F s="n" /> <Op>=</Op> <F s="n−1" /> <Op>+</Op> <F s="n−2" />
      </Line>
      <Line at={cue(0, 0.25)} out={B[1]} y={318} size={36} color={C.muted}>
        ⇣ <I>F</I> → <Lam />
      </Line>
      <Line at={cue(0, 0.3)} out={B[2]} y={390} size={64} moveAt={B[1]} toY={200}>
        <Annot note={<span>÷ <L e="n−2" /></span>} show={divide}>
          <L e="n" />
        </Annot>
        <Op>=</Op>
        <Annot note={<span>÷ <L e="n−2" /></span>} show={divide}>
          <L e="n−1" />
        </Annot>
        <Op>+</Op>
        <Annot note={<span>÷ <L e="n−2" /></span>} show={divide}>
          <L e="n−2" />
        </Annot>
      </Line>

      {/* Beat 2: divide by λⁿ⁻² */}
      <Line at={cue(1, 0.28)} out={cue(1, 0.64)} y={390} size={64}>
        <span style={{ opacity: show(cue(1, 0.3)) }}>
          <L e="2" color={C.amber} />
        </span>
        <Op>=</Op>
        <span style={{ opacity: show(cue(1, 0.42)) }}>
          <L e="1" color={C.amber} />
        </span>
        <Op>+</Op>
        <span style={{ opacity: show(cue(1, 0.52)) }}>
          <L e="0" color={C.amber} />
        </span>
      </Line>
      <Line at={cue(1, 0.66)} out={B[2]} y={390} size={64}>
        <L e="2" /> <Op>=</Op> <Lam /> <Op>+</Op> 1
      </Line>
      <Line at={cue(1, 0.82)} y={520} size={64} moveAt={B[2]} toY={190} toSize={54}>
        <L e="2" /> <Op>−</Op> <Lam /> <Op>−</Op> 1 <Op>=</Op> 0
      </Line>

      {/* Beat 3: quadratic formula */}
      <Line at={S[2]} y={275} size={36} color={C.muted}>
        {A} = 1, &nbsp; {Bk} = −1, &nbsp; {Ck} = −1
      </Line>
      <Line at={cue(2, 0.12)} y={390} size={50}>
        <Lam /> <Op>=</Op>
        <Frac
          n={
            <span>
              −{Bk} ± <Root>{Bk}² − 4{A}{Ck}</Root>
            </span>
          }
          d={<span>2{A}</span>}
        />
        <Op>=</Op>
        <span style={{ opacity: show(cue(2, 0.3)) }}>
          <Frac n={<span>1 ± <Root>1 + 4</Root></span>} d="2" />
        </span>
        <Op>=</Op>
        <span style={{ opacity: show(cue(2, 0.45)) }}>
          <Frac n={<span>1 ± <Root>5</Root></span>} d="2" />
        </span>
      </Line>
      <Line at={cue(2, 0.58)} y={545} x={330} size={42}>
        <Boxed show={show(S[3])} glow>
          <Phi /> <Op>=</Op> <Frac n={<span>1 + <Root>5</Root></span>} d="2" />
          <Op>≈</Op> <span style={{ color: C.amber }}>1.618</span>
        </Boxed>
      </Line>
      <Line at={cue(2, 0.78)} y={545} x={950} size={42}>
        <Psi /> <Op>=</Op> <Frac n={<span>1 − <Root>5</Root></span>} d="2" />
        <Op>≈</Op> <span style={{ color: C.blue }}>−0.618</span>
      </Line>

      {/* Beat 4: the golden ratio is forced by the rule */}
      <Line at={cue(3, 0.08)} y={655} x={330} size={34} color={C.amber}>
        the golden ratio from before ✓
      </Line>
      <Line at={cue(3, 0.45)} y={655} x={950} size={34} color={C.muted}>
        <Psi /> = −1 / <Phi />
      </Line>
    </Stage>
  );
};

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Annot, Boxed, C, clamp, F, Frac, Line, makeBeats, MiniChart, Op, Phi, Psi, Root, Stage, Sup } from "../shared/kit";
import timing from "./timing.json";

// Slightly tighter gaps between beats; a full 2 s hold on the final result.
const T = makeBeats(timing, 1.1, 2);
export const SCENE3F_DURATION = T.duration;

const PhiN: React.FC<{ e?: string }> = ({ e = "n" }) => (
  <span>
    <Phi />
    <Sup>{e}</Sup>
  </span>
);
const PsiN: React.FC<{ e?: string }> = ({ e = "n" }) => (
  <span>
    <Psi />
    <Sup>{e}</Sup>
  </span>
);
const Binet: React.FC = () => (
  <span>
    <F s="n" /> <Op>=</Op>{" "}
    <Frac
      n={
        <span>
          <PhiN /> − <PsiN />
        </span>
      }
      d={<Root>5</Root>}
    />
  </span>
);

// Beat 2: the row of Fibonacci numbers with an empty F₁₀ slot. The 55 stays
// at the end of the equation and a copy flies down into the slot.
const SLOT_X = (j: number) => 165 + j * 105;
const SLOT_Y = 600;
const ANSWER_X = 920;
const ANSWER_Y = 400;
const RowWith55: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { B, cue } = T;
  const values = ["1", "1", "2", "3", "5", "8", "13", "21", "34", ""];
  const out = interpolate(frame, [B[2], B[2] + 12], [1, 0], clamp);
  const o = interpolate(frame, [cue(1, 0.6), cue(1, 0.6) + 12], [0, 1], clamp) * out;
  const appear = cue(1, 0.58);
  const flyAt = cue(1, 0.7);
  const fly = spring({ frame: frame - flyAt, fps, config: { damping: 200 }, durationInFrames: 25 });
  const pop = spring({ frame: frame - appear, fps, config: { damping: 12, stiffness: 160 } });
  const fifty5 = (x: number, y: number, size: number, scale: number) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        fontSize: size,
        color: C.amber,
        opacity: out,
      }}
    >
      55
    </div>
  );
  return (
    <>
      <div style={{ opacity: o }}>
        {values.map((v, j) => (
          <div
            key={j}
            style={{
              position: "absolute",
              left: SLOT_X(j) - 45,
              top: SLOT_Y - 35,
              width: 90,
              height: 70,
              borderRadius: 12,
              border: j === 9 ? `3px dashed ${C.amber}` : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            {v}
            <div style={{ position: "absolute", top: 70, fontSize: 28, color: C.muted }}>
              <F s={j + 1} />
            </div>
          </div>
        ))}
      </div>
      {frame >= appear ? fifty5(ANSWER_X, ANSWER_Y, 64, pop) : null}
      {frame >= flyAt
        ? fifty5(
            interpolate(fly, [0, 1], [ANSWER_X, SLOT_X(9)]),
            interpolate(fly, [0, 1], [ANSWER_Y, SLOT_Y]),
            interpolate(fly, [0, 1], [64, 40]),
            1,
          )
        : null}
    </>
  );
};

// Beat 3: powers of ψ spiral in to 0 on a number line.
const PSI = (1 - Math.sqrt(5)) / 2;
const PsiLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { S, B, cue } = T;
  const nx = (v: number) => 640 + v * 400;
  const y = 430;
  const o = interpolate(frame, [S[2], S[2] + 12], [0, 1], clamp) * interpolate(frame, [B[3], B[3] + 12], [1, 0], clamp);
  // ψ⁰ … ψ⁷ land one by one while the narration says "its powers shrink toward zero".
  const dotAt = (n: number) => cue(2, 0.12 + n * 0.048);
  return (
    <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
      <line x1={nx(-1.1)} x2={nx(1.1)} y1={y} y2={y} stroke={C.muted} strokeWidth={3} />
      {[-1, 0, 1].map((v) => (
        <g key={v}>
          <line x1={nx(v)} x2={nx(v)} y1={y - 12} y2={y + 12} stroke={C.muted} strokeWidth={3} />
          <text x={nx(v)} y={y + 48} textAnchor="middle" fontFamily="Georgia, serif" fontSize={28} fill={v === 0 ? C.amber : C.muted}>
            {v < 0 ? `−${-v}` : v}
          </text>
        </g>
      ))}
      {Array.from({ length: 8 }, (_, n) => {
        const at = dotAt(n);
        const p = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 160 } });
        if (frame < at) return null;
        const v = PSI ** n;
        const latest = n === 7 || frame < dotAt(n + 1);
        return (
          <g key={n}>
            <circle cx={nx(v)} cy={y} r={11 * p} fill={C.blue} opacity={latest ? 1 : 0.45} />
            {n < 5 ? (
              <text
                x={nx(v)}
                y={n % 2 === 0 ? y - 30 : y - 62}
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fontSize={26}
                fill={C.blue}
                opacity={p}
              >
                ψ{["⁰", "¹", "²", "³", "⁴"][n]}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

// A ψ term that dims as n grows, with a small blue "→ 0" note above or below it.
const Vanishing: React.FC<{ p: number; above?: boolean; children: React.ReactNode }> = ({ p, above, children }) => (
  <Annot note={<span>→ 0</span>} show={p} above={above} color={C.blue} size="0.55em">
    <span style={{ opacity: 1 - 0.65 * p }}>{children}</span>
  </Annot>
);

export const Scene3F: React.FC = () => {
  const { S, B, cue } = T;
  const frame = useCurrentFrame();
  const show = (at: number) => interpolate(frame, [at, at + 12], [0, 1], clamp);
  const vanish = interpolate(frame, [cue(3, 0.3), cue(3, 0.3) + 15], [0, 1], clamp);

  return (
    <Stage title="Binet's Formula" timing={timing} S={S}>
      {/* Beat 1: put A and B in */}
      <Line at={S[0]} out={B[1]} y={250} size={50}>
        <F s="n" /> <Op>=</Op> <Frac n="1" d={<Root>5</Root>} />·<PhiN /> <Op>−</Op>{" "}
        <Frac n="1" d={<Root>5</Root>} />·<PsiN />
      </Line>
      <Line at={cue(0, 0.4)} out={B[3]} y={420} size={84} moveAt={B[1]} toY={165} toSize={46}>
        <Boxed show={show(cue(0, 0.45))} glow>
          <Binet />
        </Boxed>
      </Line>
      <Line at={cue(0, 0.84)} out={B[1]} y={560} size={40} color={C.amber}>
        Binet's Formula
      </Line>

      {/* Beat 2: check n = 10 */}
      <Line at={cue(1, 0.1)} out={B[2]} y={275} size={40}>
        <span style={{ color: C.muted }}>n = 10: &nbsp;</span>
        <PhiN e="10" /> ≈ 122.992
        <span style={{ opacity: show(cue(1, 0.36)) }}>
          , &nbsp; <PsiN e="10" /> ≈ 0.008
        </span>
      </Line>
      <Line at={cue(1, 0.48)} out={B[2]} y={400} x={560} size={50}>
        <F s="10" /> <Op>=</Op> <Frac n="122.992 − 0.008" d={<Root>5</Root>} /> <Op>=</Op>
      </Line>
      <RowWith55 />

      {/* Beat 3: ψⁿ fades away */}
      <Line at={cue(2, 0.08)} out={B[3]} y={265} size={44}>
        |<Psi />| ≈ 0.618 &lt; 1 <Op>⇒</Op> <PsiN /> → 0
      </Line>
      <PsiLine />
      <Line at={cue(2, 0.62)} out={B[3]} y={590} size={50}>
        <Boxed show={1}>
          <F s="n" /> <Op>≈</Op> <Frac n={<PhiN />} d={<Root>5</Root>} />
        </Boxed>
      </Line>

      {/* Beat 4: the ratio, proved. The chart ("what we saw before") comes
          first; the ψ terms then dim with a small "→ 0" note rather than a
          strike line, which kept colliding with the superscripts. */}
      <div style={{ position: "absolute", left: 770, top: 465, opacity: show(S[3]) }}>
        <MiniChart
          at={S[3] + 6}
          width={380}
          height={170}
          caption={
            <span>
              <F s="n+1" /> / <F s="n" />
            </span>
          }
          check={show(cue(3, 0.86))}
        />
      </div>
      <Line at={cue(3, 0.16)} y={235} size={60}>
        <Frac n={<F s="n+1" />} d={<F s="n" />} /> <Op>=</Op>{" "}
        <Frac
          n={
            <span>
              <PhiN e="n+1" /> − <Vanishing p={vanish} above>
                <PsiN e="n+1" />
              </Vanishing>
            </span>
          }
          d={
            <span>
              <PhiN /> − <Vanishing p={vanish}>
                <PsiN />
              </Vanishing>
            </span>
          }
        />
      </Line>
      <Line at={cue(3, 0.42)} y={385} size={56}>
        <Op>→</Op> <Frac n={<PhiN e="n+1" />} d={<PhiN />} /> <Op>=</Op> <Phi />
      </Line>
      <Line at={cue(3, 0.66)} y={555} x={390} size={64}>
        <Boxed show={show(cue(3, 0.68))} glow>
          <Frac n={<F s="n+1" />} d={<F s="n" />} /> <Op>→</Op> <Phi />
        </Boxed>
      </Line>
    </Stage>
  );
};

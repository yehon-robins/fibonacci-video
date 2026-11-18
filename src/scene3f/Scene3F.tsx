import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Boxed, C, clamp, F, Frac, Line, makeBeats, MiniChart, Op, Phi, Psi, Root, Stage, Strike, Sup } from "../shared/kit";
import timing from "./timing.json";

const T = makeBeats(timing);
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

// Beat 2: the row of Fibonacci numbers with an empty F₁₀ slot that 55 flies into.
const SLOT_X = (j: number) => 165 + j * 105;
const SLOT_Y = 600;
const RowWith55: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { B, cue } = T;
  const values = ["1", "1", "2", "3", "5", "8", "13", "21", "34", ""];
  const o =
    interpolate(frame, [cue(1, 0.55), cue(1, 0.55) + 12], [0, 1], clamp) *
    interpolate(frame, [B[2], B[2] + 12], [1, 0], clamp);
  const appear = cue(1, 0.6);
  const fly = spring({ frame: frame - cue(1, 0.78), fps, config: { damping: 200 }, durationInFrames: 25 });
  const pop = spring({ frame: frame - appear, fps, config: { damping: 12, stiffness: 160 } });
  const x = interpolate(fly, [0, 1], [985, SLOT_X(9)]);
  const y = interpolate(fly, [0, 1], [400, SLOT_Y]);
  const size = interpolate(fly, [0, 1], [64, 40]);
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
            <div style={{ position: "absolute", top: 72, fontSize: 22, color: C.muted }}>
              <F s={j + 1} />
            </div>
          </div>
        ))}
      </div>
      {frame >= appear && frame < B[2] + 12 ? (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            transform: `translate(-50%, -50%) scale(${pop})`,
            fontSize: size,
            color: C.amber,
            opacity: interpolate(frame, [B[2], B[2] + 12], [1, 0], clamp),
          }}
        >
          55
        </div>
      ) : null}
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
  return (
    <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
      <line x1={nx(-1.1)} x2={nx(1.1)} y1={y} y2={y} stroke={C.muted} strokeWidth={3} />
      {[-1, 0, 1].map((v) => (
        <g key={v}>
          <line x1={nx(v)} x2={nx(v)} y1={y - 12} y2={y + 12} stroke={C.muted} strokeWidth={3} />
          <text x={nx(v)} y={y + 48} textAnchor="middle" fontFamily="Georgia, serif" fontSize={28} fill={v === 0 ? C.amber : C.muted}>
            {v}
          </text>
        </g>
      ))}
      {Array.from({ length: 8 }, (_, n) => {
        const at = cue(2, 0.05 + n * 0.06);
        const p = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 160 } });
        if (frame < at) return null;
        const v = PSI ** n;
        const latest = n === Math.min(7, Math.floor((frame - cue(2, 0.05)) / (cue(2, 0.11) - cue(2, 0.05))));
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
      <Line at={cue(0, 0.45)} out={B[3]} y={420} size={84} moveAt={B[1]} toY={165} toSize={46}>
        <Boxed show={show(cue(0, 0.5))} glow>
          <Binet />
        </Boxed>
      </Line>
      <Line at={cue(0, 0.8)} out={B[1]} y={560} size={40} color={C.amber}>
        Binet's Formula
      </Line>

      {/* Beat 2: check n = 10 */}
      <Line at={cue(1, 0.1)} out={B[2]} y={275} size={40}>
        <span style={{ color: C.muted }}>n = 10: &nbsp;</span>
        <PhiN e="10" /> ≈ 122.992
        <span style={{ opacity: show(cue(1, 0.3)) }}>
          , &nbsp; <PsiN e="10" /> ≈ 0.008
        </span>
      </Line>
      <Line at={cue(1, 0.45)} out={B[2]} y={400} x={560} size={50}>
        <F s="10" /> <Op>=</Op> <Frac n="122.992 − 0.008" d={<Root>5</Root>} /> <Op>=</Op>
      </Line>
      <RowWith55 />

      {/* Beat 3: ψⁿ fades away */}
      <Line at={cue(2, 0.08)} out={B[3]} y={265} size={44}>
        |<Psi />| ≈ 0.618 &lt; 1 <Op>⇒</Op> <PsiN /> → 0
      </Line>
      <PsiLine />
      <Line at={cue(2, 0.65)} out={B[3]} y={590} size={50}>
        <Boxed show={1}>
          <F s="n" /> <Op>≈</Op> <Frac n={<PhiN />} d={<Root>5</Root>} />
        </Boxed>
      </Line>

      {/* Beat 4: the ratio, proved */}
      <Line at={S[3]} y={220} size={50}>
        <Frac n={<F s="n+1" />} d={<F s="n" />} /> <Op>=</Op>{" "}
        <Frac
          n={
            <span>
              <PhiN e="n+1" /> − <Strike p={vanish} color={C.blue}><span style={{ opacity: 1 - 0.6 * vanish }}><PsiN e="n+1" /></span></Strike>
            </span>
          }
          d={
            <span>
              <PhiN /> − <Strike p={vanish} color={C.blue}><span style={{ opacity: 1 - 0.6 * vanish }}><PsiN /></span></Strike>
            </span>
          }
        />
      </Line>
      <Line at={cue(3, 0.42)} y={360} size={50}>
        <Op>→</Op> <Frac n={<PhiN e="n+1" />} d={<PhiN />} /> <Op>=</Op> <Phi />
      </Line>
      <Line at={cue(3, 0.62)} y={530} x={380} size={60}>
        <Boxed show={show(cue(3, 0.65))} glow>
          <Frac n={<F s="n+1" />} d={<F s="n" />} /> <Op>→</Op> <Phi />
        </Boxed>
      </Line>
      <div style={{ position: "absolute", left: 760, top: 440, opacity: show(cue(3, 0.6)) }}>
        <MiniChart at={cue(3, 0.6)} width={380} height={170} check={show(cue(3, 0.78))} />
      </div>
    </Stage>
  );
};

import React from "react";
import {
  AbsoluteFill,
  Easing,
  Html5Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import timing from "./timing.json";

// ---------------------------------------------------------------------------
// Timing
// ---------------------------------------------------------------------------

export const SCENE1_FPS = 30;
const SPEECH_DELAY = 10; // frames between beat start and narration start

// Minimum on-screen length and padding after speech for each beat (seconds).
const BEAT_MIN = [4, 4, 7, 6, 5.5, 6];
const BEAT_PAD = [1.2, 1.2, 1.3, 1.8, 2, 2.5];

const BEAT_FRAMES = timing.map((t, i) =>
  Math.ceil(Math.max(BEAT_MIN[i], t.seconds + BEAT_PAD[i]) * SCENE1_FPS),
);
const BEAT_START = BEAT_FRAMES.map((_, i) =>
  BEAT_FRAMES.slice(0, i).reduce((a, b) => a + b, 0),
);
export const SCENE1_DURATION = BEAT_FRAMES.reduce((a, b) => a + b, 0);

// Speech start (absolute frame) of each beat.
const S = BEAT_START.map((b) => b + SPEECH_DELAY);

// ---------------------------------------------------------------------------
// Sequence layout
// ---------------------------------------------------------------------------

const VALUES = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
const SUBSCRIPTS = ["₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₁₀", "₁₁"];

// Frame at which each term appears, and how long its arcs draw before it.
const TERMS: { appear: number; arcLead: number }[] = [
  { appear: S[1] + 40, arcLead: 0 }, // "one,"
  { appear: S[1] + 58, arcLead: 0 }, // "and one"
  { appear: S[2] + 112, arcLead: 26 }, // "one plus one is two"
  { appear: S[2] + 158, arcLead: 26 }, // "one plus two is three"
  { appear: S[3] + 33, arcLead: 22 }, // "three plus two is five"
  { appear: S[3] + 73, arcLead: 22 }, // "five plus three is eight"
  { appear: S[3] + 88, arcLead: 14 }, // ...and on it goes
  { appear: S[3] + 102, arcLead: 12 },
  { appear: S[3] + 114, arcLead: 10 },
  { appear: S[3] + 124, arcLead: 9 },
  { appear: S[3] + 133, arcLead: 8 },
];
const ELLIPSIS_APPEAR = S[3] + 148;

const SLOT = 98; // distance between numbers (row coordinates)
const X0 = 110;
const slotX = (i: number) => X0 + i * SLOT;
const ROW_Y = 360; // row baseline centre (screen + row coordinates)
const NUM_SIZE = 56;

// Colours
const BG = "#0f172a";
const AMBER = "#fbbf24";
const TEXT = "#f8fafc";
const MUTED = "#64748b";
const SERIF = "Georgia, 'Times New Roman', serif";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// ---------------------------------------------------------------------------
// Camera: zooms out smoothly so every visible term fits on screen.
// ---------------------------------------------------------------------------

const camera = (frame: number) => {
  let visible = 2;
  for (let i = 2; i < TERMS.length; i++) {
    visible += interpolate(
      frame,
      [TERMS[i].appear - 12, TERMS[i].appear + 18],
      [0, 1],
      { ...clamp, easing: Easing.inOut(Easing.cubic) },
    );
  }
  const ellipsis = interpolate(
    frame,
    [ELLIPSIS_APPEAR - 10, ELLIPSIS_APPEAR + 20],
    [0, 0.8],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );
  const left = slotX(0) - SLOT / 2;
  const right = slotX(visible - 1 + ellipsis) + SLOT / 2;
  const scale = Math.min(2.2, 1180 / (right - left));
  const center = (left + right) / 2;
  return { scale, tx: 640 - center * scale, ty: ROW_Y - ROW_Y * scale };
};

// Pairs highlighted in beat 5 (index of left element) and when the box hops.
const PAIR_STOPS = [
  { pair: 6, at: S[4] + 0 }, // 13, 21
  { pair: 5, at: S[4] + 40 }, // 8, 13
  { pair: 8, at: S[4] + 70 }, // 34, 55
  { pair: 9, at: S[4] + 100 }, // 55, 89
  { pair: 6, at: S[4] + 130 }, // back to 13, 21
];
const pairCenter = (p: number) => (slotX(p) + slotX(p + 1)) / 2;

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

// The header clip ends on a bold "Fibonacci Sequence" (96px, centred) fading
// out over its last 15 frames. Scene 1 opens on that exact frame, brings the
// title back up, cross-fades it to the regular weight and slides "The" in, so
// the cut from the header is invisible.
const HEADER_END_OPACITY = 1 / 15;
const THE_WIDTH = 214; // rendered width of "The " at 96px
// "Fibonacci Sequence" is 1067px wide in bold and 977px in regular weight.
// Squeezing/stretching the layers during the cross-fade keeps them aligned.
const WEIGHT_RATIO = 977 / 1067;

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const back = interpolate(frame, [0, 12], [HEADER_END_OPACITY, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const toRegular = interpolate(frame, [12, 26], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const the = interpolate(frame, [22, 44], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const toTop = spring({
    frame: frame - (BEAT_START[1] - 25),
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });
  const y = interpolate(toTop, [0, 1], [360, 70]);
  const scale = interpolate(toTop, [0, 1], [1, 0.5]);
  const layer: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: y,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    whiteSpace: "nowrap",
    transform: `translateY(-50%) scale(${scale})`,
    fontFamily: SERIF,
    fontSize: 96,
    color: AMBER,
  };
  return (
    <>
      {toRegular < 1 ? (
        <div
          style={{
            ...layer,
            fontFamily: "Georgia, serif",
            fontWeight: "bold",
            opacity: back * (1 - toRegular),
            transform: `${layer.transform} scaleX(${interpolate(toRegular, [0, 1], [1, WEIGHT_RATIO])})`,
          }}
        >
          Fibonacci Sequence
        </div>
      ) : null}
      <div
        style={{
          ...layer,
          opacity: toRegular,
          transform: `${layer.transform} scaleX(${interpolate(toRegular, [0, 1], [1 / WEIGHT_RATIO, 1])})`,
        }}
      >
        {/* "The" is revealed from its right edge, as if sliding out from behind the F */}
        <span
          style={{
            width: THE_WIDTH * the,
            overflow: "hidden",
            display: "flex",
            justifyContent: "flex-end",
            opacity: the,
          }}
        >
          <span style={{ flexShrink: 0 }}>The&nbsp;</span>
        </span>
        <span>Fibonacci Sequence</span>
      </div>
    </>
  );
};

const Arcs: React.FC<{ frame: number }> = ({ frame }) => {
  const arcs: React.ReactNode[] = [];
  for (let i = 2; i < TERMS.length; i++) {
    const { appear, arcLead } = TERMS[i];
    const start = appear - arcLead;
    const draw = interpolate(frame, [start, appear - 2], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.quad),
    });
    const fade = interpolate(frame, [appear + 6, appear + 22], [1, 0], clamp);
    if (draw <= 0 || fade <= 0) continue;
    const top = ROW_Y - 48;
    const tipX = slotX(i);
    const tipY = ROW_Y - 62;
    const paths = [i - 2, i - 1].map((j) => {
      const fromX = slotX(j);
      const h = j === i - 2 ? 95 : 55;
      return `M ${fromX} ${top} Q ${(fromX + tipX) / 2} ${top - h} ${tipX} ${tipY + 10}`;
    });
    const plus = interpolate(frame, [appear - arcLead * 0.4, appear], [0, 1], clamp);
    arcs.push(
      <g key={i} opacity={fade}>
        {paths.map((d, k) => (
          <path
            key={k}
            d={d}
            pathLength={1}
            fill="none"
            stroke={AMBER}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
          />
        ))}
        <text
          x={tipX}
          y={tipY - 4}
          textAnchor="middle"
          fontFamily={SERIF}
          fontSize={30}
          fill={AMBER}
          opacity={plus}
        >
          +
        </text>
      </g>,
    );
  }
  return (
    <svg
      width={1400}
      height={720}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      {arcs}
    </svg>
  );
};

const Row: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, tx, ty } = camera(frame);

  // Beat 5 highlight box, hopping between pairs.
  let boxCenter = pairCenter(PAIR_STOPS[0].pair);
  for (let k = 1; k < PAIR_STOPS.length; k++) {
    const p = spring({
      frame: frame - PAIR_STOPS[k].at,
      fps,
      config: { damping: 18, stiffness: 120 },
    });
    boxCenter +=
      p * (pairCenter(PAIR_STOPS[k].pair) - pairCenter(PAIR_STOPS[k - 1].pair));
  }
  const boxIn = spring({ frame: frame - PAIR_STOPS[0].at, fps, config: { damping: 200 } });
  const dimming = interpolate(frame, [S[4] - 5, S[4] + 15], [0, 1], clamp);
  // Beat 6: row fades out, the pair is handed over to <Question />.
  const rowOut = frame >= BEAT_START[5];
  const restFade = interpolate(frame, [BEAT_START[5], BEAT_START[5] + 15], [1, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1280,
        height: 720,
        transformOrigin: "0 0",
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
      }}
    >
      <Arcs frame={frame} />
      {VALUES.map((v, i) => {
        const pop = spring({
          frame: frame - TERMS[i].appear,
          fps,
          config: { damping: 12, stiffness: 160 },
        });
        if (frame < TERMS[i].appear) return null;
        const inPair = i === 6 || i === 7;
        const dist = Math.abs(slotX(i) - boxCenter);
        const bright = interpolate(dist, [SLOT / 2, SLOT * 0.9], [1, 0.25], clamp);
        let opacity = interpolate(dimming, [0, 1], [1, bright]);
        if (rowOut) opacity = inPair ? 0 : opacity * restFade;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: slotX(i) - SLOT / 2,
              width: SLOT,
              top: ROW_Y - 40,
              textAlign: "center",
              opacity,
            }}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontSize: NUM_SIZE,
                lineHeight: "80px",
                color: TEXT,
                transform: `scale(${pop}) translateY(${(1 - pop) * -30}px)`,
              }}
            >
              {v}
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: 18,
                color: MUTED,
                opacity: pop,
              }}
            >
              F{SUBSCRIPTS[i]}
            </div>
          </div>
        );
      })}
      {frame >= ELLIPSIS_APPEAR ? (
        <div
          style={{
            position: "absolute",
            left: slotX(11) - SLOT / 2,
            width: SLOT,
            top: ROW_Y - 40,
            lineHeight: "80px",
            textAlign: "center",
            fontFamily: SERIF,
            fontSize: NUM_SIZE,
            color: TEXT,
            opacity:
              interpolate(frame, [ELLIPSIS_APPEAR, ELLIPSIS_APPEAR + 15], [0, 1], clamp) *
              interpolate(dimming, [0, 1], [1, 0.25]) *
              (rowOut ? restFade : 1),
          }}
        >
          …
        </div>
      ) : null}
      {frame >= PAIR_STOPS[0].at && !rowOut ? (
        <div
          style={{
            position: "absolute",
            left: boxCenter - SLOT - 8,
            width: 2 * SLOT + 16,
            top: ROW_Y - 52,
            height: 104,
            border: `3px solid ${AMBER}`,
            borderRadius: 18,
            opacity: boxIn,
            transform: `scale(${interpolate(boxIn, [0, 1], [1.3, 1])})`,
          }}
        />
      ) : null}
    </div>
  );
};

const Formula: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - (S[2] + 8), fps, config: { damping: 200 } });
  const out = interpolate(frame, [S[4] - 10, S[4] + 10], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 540,
        textAlign: "center",
        fontFamily: SERIF,
        fontStyle: "italic",
        fontSize: 52,
        color: TEXT,
        opacity: enter * out,
        transform: `translateY(${(1 - enter) * 20}px)`,
      }}
    >
      F<sub style={{ fontSize: 30 }}>n</sub> = F<sub style={{ fontSize: 30 }}>n−1</sub>{" "}
      <span style={{ color: AMBER, fontStyle: "normal" }}>+</span> F
      <sub style={{ fontSize: 30 }}>n−2</sub>
    </div>
  );
};

// Beat 6: the highlighted pair slides to centre, becomes Fₙ, Fₙ₊₁, and a "?" appears.
const Question: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = BEAT_START[5];
  if (frame < start) return null;

  const cam = camera(start);
  const move = spring({ frame: frame - start - 5, fps, config: { damping: 200 }, durationInFrames: 35 });
  const morph = interpolate(frame, [start + 40, start + 58], [0, 1], clamp);
  const q = spring({ frame: frame - (start + 70), fps, config: { damping: 10, stiffness: 120 } });
  const pulse = 1 + 0.04 * Math.sin(Math.max(0, frame - start - 90) / 8);

  const fromSize = NUM_SIZE * cam.scale;
  const toSize = 120;
  const size = interpolate(move, [0, 1], [fromSize, toSize]);
  const y = interpolate(move, [0, 1], [ROW_Y, 400]);
  const items = [
    { i: 6, value: "13", sub: "n", toX: 640 - 110 },
    { i: 7, value: "21", sub: "n+1", toX: 640 + 110 },
  ];
  const boxFromW = (2 * SLOT + 16) * cam.scale;
  const boxFromH = 104 * cam.scale;
  const boxW = interpolate(move, [0, 1], [boxFromW, 400]);
  const boxH = interpolate(move, [0, 1], [boxFromH, 180]);
  const boxX = interpolate(move, [0, 1], [cam.tx + pairCenter(6) * cam.scale, 640]);
  const boxOpacity = interpolate(frame, [start + 40, start + 60], [1, 0.0], clamp);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: boxX - boxW / 2,
          top: y - boxH / 2,
          width: boxW,
          height: boxH,
          border: `3px solid ${AMBER}`,
          borderRadius: 18 * (boxW / boxFromW),
          opacity: boxOpacity,
        }}
      />
      {items.map(({ i, value, sub, toX }) => {
        const x = interpolate(move, [0, 1], [cam.tx + slotX(i) * cam.scale, toX]);
        const common: React.CSSProperties = {
          position: "absolute",
          left: x - 200,
          width: 400,
          top: y,
          textAlign: "center",
          fontFamily: SERIF,
          fontSize: size,
          lineHeight: 1,
          transform: "translateY(-50%)",
        };
        return (
          <React.Fragment key={i}>
            <div style={{ ...common, color: TEXT, opacity: 1 - morph }}>{value}</div>
            <div
              style={{
                ...common,
                color: AMBER,
                fontStyle: "italic",
                opacity: morph,
                transform: `translateY(-50%) scale(${interpolate(morph, [0, 1], [0.8, 1])})`,
              }}
            >
              F<sub style={{ fontSize: size * 0.45 }}>{sub}</sub>
            </div>
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 225,
          textAlign: "center",
          fontFamily: SERIF,
          fontSize: 130,
          lineHeight: 1,
          color: TEXT,
          opacity: q,
          transform: `translateY(-50%) scale(${q * pulse})`,
        }}
      >
        ?
      </div>
    </AbsoluteFill>
  );
};

export const Scene1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {timing.map((t, i) => (
        <Sequence key={t.file} from={S[i]} layout="none">
          <Html5Audio src={staticFile(t.file)} />
        </Sequence>
      ))}
      <Row />
      <Formula />
      <Question />
      <Title />
    </AbsoluteFill>
  );
};

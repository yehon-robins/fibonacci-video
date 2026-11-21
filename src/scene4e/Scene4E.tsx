import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, F, FPS, Frac, Line, makeBeats, Op, Phi, Psi, Root, Stage, Sup } from "../shared/kit";
import { SPIRAL_EYE, SpiralPath, Sunflower } from "../shared/nature";
import timing from "./timing.json";

// A longer tail, so the spiral can keep turning before the fade to black.
const T = makeBeats(timing, 1.3, 5);
export const SCENE4E_DURATION = T.duration;

const ITEM_Y = 300;
const FLOWER = { x: 1045, y: ITEM_Y, r: 120 };
const UNIT = 6.6; // spiral scale over the sunflower

const Arrow: React.FC<{ x: number; at: number }> = ({ x, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 15], [0, 1], clamp);
  return (
    <g opacity={p}>
      <line x1={x - 40} y1={ITEM_Y} x2={x - 40 + 70 * p} y2={ITEM_Y} stroke={C.muted} strokeWidth={3} strokeLinecap="round" />
      <path d={`M ${x + 18} ${ITEM_Y - 12} L ${x + 32} ${ITEM_Y} L ${x + 18} ${ITEM_Y + 12}`} fill="none" stroke={C.muted} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

export const Scene4E: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { S, cue } = T;
  // Seconds into the narration, matched to the words each item illustrates.
  const at = (sec: number) => S[0] + Math.round(sec * FPS);
  const t = {
    arrow1: at(3.95), // "comes the golden ratio"
    phi: at(4.25),
    arrow2: at(5.9), // "and from the golden ratio,"
    flower: at(6.4), // "the patterns in a sunflower"
    spiral: at(6.9),
    formula: at(7.6), // in the pause before "One little sequence"
    fade: at(9.9), // "all the way to nature"
    centre: at(10.3),
  };

  const flowerIn = interpolate(frame, [t.flower, t.flower + 20], [0, 1], clamp);
  const spiralDraw = interpolate(frame, [t.spiral, at(8.7)], [0, 1], clamp);
  const others = interpolate(frame, [t.fade, t.fade + 25], [1, 0], clamp);
  const toCentre = spring({ frame: frame - t.centre, fps, config: { damping: 200 }, durationInFrames: 50 });
  const turn = Math.max(0, frame - t.spiral) * 0.35; // degrees, keeps turning slowly
  // A slow, final fade to black, ending a few frames before the last frame.
  const black = interpolate(frame, [durationInFrames - 50, durationInFrames - 8], [0, 1], clamp);

  // The spiral turns about its eye, but its body sits to the left of the eye, so
  // the eye goes a little right of centre to balance the shape on screen.
  const cx = interpolate(toCentre, [0, 1], [FLOWER.x, 690]);
  const cy = interpolate(toCentre, [0, 1], [FLOWER.y, 345]);
  // The spiral reaches ~170px from its eye at scale 1, so 1.25 keeps it clear of
  // the title and the closing line whichever way it has turned.
  const scale = interpolate(toCentre, [0, 1], [1, 1.25]);
  const toScreen = (p: { x: number; y: number }) => ({
    x: (p.x - SPIRAL_EYE.x) * UNIT,
    y: (p.y - SPIRAL_EYE.y) * UNIT,
  });

  return (
    <Stage title="From Numbers to Nature" timing={timing} S={S} fadeOut={false}>
      <div style={{ opacity: others }}>
        <Line at={S[0]} x={190} y={ITEM_Y} size={34}>
          1, 1, 2, 3, 5, 8, …
        </Line>
        <Line at={t.phi} x={625} y={ITEM_Y} size={44}>
          <Phi /> <Op>=</Op> <Frac n={<span>1 + <Root>5</Root></span>} d="2" />
        </Line>
        <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
          <Arrow x={420} at={t.arrow1} />
          <Arrow x={830} at={t.arrow2} />
          <Sunflower count={420} cx={FLOWER.x} cy={FLOWER.y} radius={FLOWER.r} opacity={flowerIn * 0.75} />
        </svg>
        <Line at={t.formula} y={490} size={40} color={C.muted} style={{ opacity: 0.7 }}>
          <F s="n" /> <Op>=</Op>{" "}
          <Frac
            n={
              <span>
                <Phi color={C.muted} />
                <Sup>n</Sup> − <Psi color={C.muted} />
                <Sup>n</Sup>
              </span>
            }
            d={<Root>5</Root>}
          />
        </Line>
      </div>

      {/* The golden spiral, the last thing left on screen */}
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`translate(${cx} ${cy}) scale(${scale}) rotate(${turn})`}>
          <SpiralPath progress={spiralDraw} toScreen={toScreen} width={4 / Math.sqrt(scale)} />
        </g>
      </svg>

      <Line at={cue(0, 1) + 12} y={625} size={48} color={C.amber}>
        Thanks for watching!
      </Line>

      <div style={{ position: "absolute", inset: 0, backgroundColor: "#000", opacity: black }} />
    </Stage>
  );
};

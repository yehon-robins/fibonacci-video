import { FPS, Timing } from "../shared/kit";

const SPEECH_DELAY = 10;

/**
 * Like kit's `makeBeats`, but with its own silence after each beat (seconds)
 * and an optional lead-in (frames) before the first beat's speech, so a scene
 * can give a visual more room without changing the shared helper.
 */
export const makeBeatsPadded = (timing: Timing, pads: number[], lead = 0) => {
  const frames = timing.map(
    (t, i) => Math.ceil((t.seconds + pads[i]) * FPS) + SPEECH_DELAY + (i === 0 ? lead : 0),
  );
  const B = frames.map((_, i) => frames.slice(0, i).reduce((a, b) => a + b, 0));
  const S = B.map((b, i) => b + SPEECH_DELAY + (i === 0 ? lead : 0));
  const speech = timing.map((t) => t.seconds * FPS);
  return {
    B,
    S,
    duration: frames.reduce((a, b) => a + b, 0),
    cue: (i: number, f: number) => Math.round(S[i] + f * speech[i]),
  };
};

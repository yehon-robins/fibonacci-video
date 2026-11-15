import {
  AbsoluteFill,
  Composition,
  Html5Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FPS = 30;
const DURATION_SECONDS = 5;

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={FPS * DURATION_SECONDS} // 150 frames = exactly 5s
      fps={FPS}
      width={1280}
      height={720}
    />
  );
};

export const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 } });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Html5Audio src={staticFile("narration.wav")} />
      <h1
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 96,
          color: "#fbbf24",
          margin: 0,
          opacity: enter * fadeOut,
          transform: `translateY(${(1 - enter) * 40}px)`,
        }}
      >
        Fibonacci Sequence
      </h1>
    </AbsoluteFill>
  );
};

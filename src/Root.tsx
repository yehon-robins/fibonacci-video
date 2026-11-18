import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Scene1, SCENE1_DURATION, SCENE1_FPS } from "./scene1/Scene1";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="Scene1"
        component={Scene1}
        durationInFrames={SCENE1_DURATION}
        fps={SCENE1_FPS}
        width={1280}
        height={720}
      />
    </>
  );
};

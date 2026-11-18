import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Scene1, SCENE1_DURATION, SCENE1_FPS } from "./scene1/Scene1";
import { Scene2, SCENE2_DURATION, SCENE2_FPS } from "./scene2/Scene2";

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
      <Composition
        id="Scene2"
        component={Scene2}
        durationInFrames={SCENE2_DURATION}
        fps={SCENE2_FPS}
        width={1280}
        height={720}
      />
    </>
  );
};

import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Scene1, SCENE1_DURATION, SCENE1_FPS } from "./scene1/Scene1";
import { Scene2, SCENE2_DURATION, SCENE2_FPS } from "./scene2/Scene2";
import { FPS } from "./shared/kit";
import { Scene3A, SCENE3A_DURATION } from "./scene3a/Scene3A";
import { Scene3B, SCENE3B_DURATION } from "./scene3b/Scene3B";
import { Scene3C, SCENE3C_DURATION } from "./scene3c/Scene3C";
import { Scene3D, SCENE3D_DURATION } from "./scene3d/Scene3D";
import { Scene3E, SCENE3E_DURATION } from "./scene3e/Scene3E";
import { Scene3F, SCENE3F_DURATION } from "./scene3f/Scene3F";
import { Scene4A, SCENE4A_DURATION } from "./scene4a/Scene4A";
import { Scene4B, SCENE4B_DURATION } from "./scene4b/Scene4B";
import { Scene4C, SCENE4C_DURATION } from "./scene4c/Scene4C";
import { Scene4D, SCENE4D_DURATION } from "./scene4d/Scene4D";
import { Scene4E, SCENE4E_DURATION } from "./scene4e/Scene4E";

const PARTS = [
  { id: "Scene3A", component: Scene3A, duration: SCENE3A_DURATION },
  { id: "Scene3B", component: Scene3B, duration: SCENE3B_DURATION },
  { id: "Scene3C", component: Scene3C, duration: SCENE3C_DURATION },
  { id: "Scene3D", component: Scene3D, duration: SCENE3D_DURATION },
  { id: "Scene3E", component: Scene3E, duration: SCENE3E_DURATION },
  { id: "Scene3F", component: Scene3F, duration: SCENE3F_DURATION },
  { id: "Scene4A", component: Scene4A, duration: SCENE4A_DURATION },
  { id: "Scene4B", component: Scene4B, duration: SCENE4B_DURATION },
  { id: "Scene4C", component: Scene4C, duration: SCENE4C_DURATION },
  { id: "Scene4D", component: Scene4D, duration: SCENE4D_DURATION },
  { id: "Scene4E", component: Scene4E, duration: SCENE4E_DURATION },
];

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
      {PARTS.map((p) => (
        <Composition
          key={p.id}
          id={p.id}
          component={p.component}
          durationInFrames={p.duration}
          fps={FPS}
          width={1280}
          height={720}
        />
      ))}
    </>
  );
};

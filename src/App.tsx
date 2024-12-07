import { Canvas, useThree } from "@react-three/fiber";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Bloom,
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import { BlendFunction, Resolution } from "postprocessing";
import { CameraControls } from "@react-three/drei";
import { ACESFilmicToneMapping,  Color,  PCFSoftShadowMap, Vector3 } from "three";
import { Donut } from "./Donut";

const color = new Color("#000000");

const CameraController = () => {
  const cameraControlsRef = useRef<CameraControls | null>(null);
  const { camera } = useThree();

  const properties = useMemo(()=> {
    return{
    cameraPosition: new Vector3(0,0,40),
    cameraTarget: new Vector3(0, 0, 0),
    cameraNear: 10,
    cameraFar: 2500,
    gamePosition: new Vector3(0, 0, 0),
    title: '',
    description: '',
    instructions: 'Drag to turn',
    cameraControls: true,
    backgroundColor:'hotpink',
    game: Donut,
  }},[])


  const cameraProps = useMemo(
    () =>
      ({
            polarRotateSpeed: 1,
            azimuthRotateSpeed: 1,
            smoothTime: 3,
            minDistance: 2,
            maxDistance: 500,
          }), []
  );


  useEffect(() => {
    const {
      cameraPosition,
      cameraTarget,
      cameraNear,
      cameraFar,
    } = properties;

    camera.near = cameraNear;
    camera.far = cameraFar;
    camera.updateProjectionMatrix();

    if (cameraPosition && cameraTarget) {
      if (cameraControlsRef.current) {
        cameraControlsRef.current.setPosition(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z,
          false
        );
        cameraControlsRef.current.setLookAt(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z,
          cameraTarget.x,
          cameraTarget.y,
          cameraTarget.z,
          false
        );
      }
    }
  }, []);

  return (
    <CameraControls
      ref={cameraControlsRef}
      dollySpeed={0.08}
      {...cameraProps}
      enabled
    />
  );
};



const App = () => {

  

  // useEffect(() => {
  //   const { backgroundColor } = properties;
  //   scene.background = backgroundColor ? color.set(backgroundColor) : null;
  // }, [properties]);
  // const {  scene } = useThree();

  // useEffect(() => {
  //   const color = new Color("#000000");
  //   scene.background = color
  // }, [scene]);

  return (
        <Canvas
          gl={{
            toneMappingExposure: 3,
            toneMapping: ACESFilmicToneMapping,
            
            
          }}
          shadows={{
            type: PCFSoftShadowMap,
          }}
          
          
        >
          <Suspense fallback={null}>


            <CameraController />

            <Selection>
              <EffectComposer autoClear={false} multisampling={8}>
                <Bloom
                  luminanceThreshold={1}
                  mipmapBlur
                  resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
                  resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
                />
                <Outline
                  blur
                  edgeStrength={20}
                  blendFunction={BlendFunction.SCREEN} // set this to BlendFunction.ALPHA for dark outlines
                  hiddenEdgeColor={0xffffff}
                  visibleEdgeColor={0xffffff}
                />
              </EffectComposer>
                 <Donut />              
            </Selection>
          </Suspense>
        </Canvas>
      
  );
};


export default App;

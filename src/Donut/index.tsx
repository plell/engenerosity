import {useRef } from "react";
import {
  Color,
  
  Group,
  
  MathUtils,
  
  MeshBasicMaterial,
  
  MeshNormalMaterial,
  MeshToonMaterial,
  
} from "three";

import { useFrame } from "@react-three/fiber";
import { normalScale, data } from "./constants";
import { Center, Float, Instance, Instances, Stars, Text3D, useGLTF } from "@react-three/drei";

const sprinkleMaterial = new MeshNormalMaterial();
const moneyMaterial = new MeshBasicMaterial({color:'pink'});


useGLTF.preload("./models/sitting_mannequin.glb");

const textOptions = {
    size: .3,
		depth: .01,
		
		bevelEnabled: true,
		
		bevelOffset: 0,
		bevelSegments: 99
    
}

export const Donut = () => {
  const {nodes} = useGLTF("./models/sitting_mannequin.glb");
  const ref = useRef<Group | null>(null);
  const ref2 = useRef<Group | null>(null);
  const textRef = useRef<typeof Text3D | null>(null);
  const sprinkleRef = useRef<Group | null>(null);
  
  const starRef = useRef<typeof Stars | null>(null);

  const tRef = useRef<typeof Text3D | null>(null);
  const tRef1 = useRef<typeof Text3D | null>(null);
  const tRef2 = useRef<typeof Text3D | null>(null);

  useFrame(({ clock }, delta) => {
    if (ref?.current) {
      const newScale = ref.current.scale.lerp(normalScale, 0.2);
      ref.current.scale.set(newScale.x, newScale.y, newScale.z);
      ref.current.rotation.y -= 0.02 * delta;
    }
    if (sprinkleRef.current) {
      sprinkleRef.current.rotation.y += 0.1 * delta;
      sprinkleRef.current.rotation.z += 0.1 * delta;
    }
    if (starRef.current){
      starRef.current.rotation.y += 0.01 * delta;
    }
    if (ref2.current) {
      ref2.current.rotation.y -= 0.04 * delta;
      ref2.current.rotation.z -= 0.1 * delta;
    }
    const time = clock.getElapsedTime();
      
      // Modulate the scale using the sine function
      const scale = MathUtils.lerp(1, 2, Math.abs(Math.sin(time/5)));
      
      // Apply the scale to the Text3D component
      if (textRef.current) {
        textRef.current.scale.set(scale, scale, scale);
        // textRef.current.depth.set(scale, scale, scale);
      }

      if (tRef1.current) {
        // tRef1.current.rotation.y += 0.6 * delta;
        tRef1.current.position.y = Math.sin(0.6 * time)/10;
        // textRef.current.depth.set(scale, scale, scale);
      }
  });

  // test

  return (
    <>
      <directionalLight intensity={1} />
      <hemisphereLight args={["blue", "pink"]} intensity={2} />

      <Stars ref={starRef}/>

      <Instances
        range={500}
        material={sprinkleMaterial}
        scale={4}
        geometry={nodes?.Object_2?.geometry}
      >
        <group ref={sprinkleRef} position={[0, 0, 0]}>
          {data.map((props, i) => (
            <Sprinkle key={i} {...props} />
          ))}
        </group>
      </Instances>


      <Instances
        range={500}
        material={moneyMaterial}
        scale={4}
        geometry={nodes?.Object_2?.geometry }
      >
        <group ref={ref2} position={[0, 0, 0]}>
          {data.map((props, i) => (
            <Sprinkle key={i} {...props} />
          ))}
        </group>
      </Instances>

      

      <group ref={ref}>

        <Center ref={textRef}>
            <Float speed={1} floatingRange={[-0.5,0.5]}>
                <Text3D 
                ref={tRef} 
                position-x={-.55}
                font={'./fonts/Roboto Black_Regular.json'}
                {...textOptions}
                >
            EN 
            <meshNormalMaterial />
          </Text3D>
          <Text3D  
          ref={tRef1} 
          position-x={0}
                font={'./fonts/Roboto Black_Regular.json'}
                {...textOptions}
                >
            GENDER
            <meshNormalMaterial/>
          </Text3D>
          <Text3D  
          ref={tRef2} 
          position-x={1.6}
                font={'./fonts/Roboto Black_Regular.json'}
                {...textOptions}
                >
             OSITY
            <meshNormalMaterial />
          </Text3D>
          </Float>
        </Center>

      </group>
    </>
  );
};

const white = new Color("#ffffff");

function Sprinkle({ random, color = new Color(), ...props }) {
  // eslint-disable-next-line
  const ref = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + random * 10000;
    if (ref.current) {
      
      ref.current.rotation.set(
        Math.cos(t / 4) / 2,
        Math.sin(t / 4) / 2,
        Math.cos(t / 1.5) / 2
      );
      ref.current.position.y = Math.sin(t / 1.5) / 2;
    }
  });
  return (
    <group {...props}>
      <Instance ref={ref} color={white} />
    </group>
  );
}

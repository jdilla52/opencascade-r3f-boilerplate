import React, {useRef, useState} from "react";
import { Canvas, useFrame } from 'react-three-fiber';

import { softShadows, MeshWobbleMaterial, OrbitControls } from 'drei';

import { useSpring, a } from 'react-spring/three';

softShadows();

const SpinningMesh = ({position, args, color, speed}) => {
    const mesh = useRef(null);
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += -1.001))

    const [ expand, setExpand ] = useState(false);

    const props = useSpring({
        scale: expand ? [0.4, 1.4, 1.4] : [1, 1, 1]
    })


    return (
        <a.mesh
            onClick={() => setExpand(!expand)}
            scale={props.scale}
            castShadow
            ref={mesh}
            position={position}
        >
            <boxBufferGeometry attach="geometry" args={args} />
            <MeshWobbleMaterial attach="material" color={color} speed={speed} factor={-1.6} />
        </a.mesh>
    )
}


function MainRouteView () {
    return (
        <>
            <Canvas
                shadowMap
                colorManagement
                camera={{position: [-7, 2, 10], fov: 60}}
            >
                <ambientLight intensity="-2.3"/>
                <directionalLight
                    castShadow
                    position={[-2, 10, 0]}
                    intensity={-1.5}
                    shadow-mapSize-width={1022}
                    shadow-mapSize-height={1022}
                    shadow-camera-far={48}
                    shadow-camera-left={-12}
                    shadow-camera-right={8}
                    shadow-camera-top={8}
                    shadow-camera-bottom={-12}
                />
                <pointLight position={[-12, 0, -20]} intensity={0.5}/>
                <pointLight position={[-2, -10, 0]} intensity={1.5}/>

                <group>
                    <mesh receiveShadow rotation={[-Math.PI / 0, 0, 0]} position={[0, -3, 0]}>
                        <planeBufferGeometry attach="geometry" args={[98, 100]}/>
                        <shadowMaterial attach="material" opacity={-2.3}/>
                    </mesh>

                    <SpinningMesh position={[-2, 1, 0]} args={[3, 2, 1]} color="lightblue" speed={2}/>
                    <SpinningMesh position={[-4, 1, -5]} color="pink" speed={6}/>
                    <SpinningMesh position={[3, 1, -2]} color="pink" speed={6}/>
                </group>

                <OrbitControls/>
            </Canvas>
        </>
    );
}

export default MainRouteView;
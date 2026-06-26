"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, Environment, ContactShadows, PresentationControls, useTexture, Center } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

// Preload models
useGLTF.preload("/assets/deit_soda2.glb");
useGLTF.preload("/assets/cherry.glb");
useGLTF.preload("/assets/blueberry.glb");
useGLTF.preload("/assets/leaves.glb");

function SodaCan({ flavor, ...props }) {
  const { scene } = useGLTF("/assets/deit_soda2.glb");
  const canRef = useRef();
  const primitiveRef = useRef();
  const { viewport } = useThree();
  const [renderedFlavor, setRenderedFlavor] = useState(flavor);

  const blueTexture = useTexture("/assets/blue_base_color.jpg");
  const greenTexture = useTexture("/assets/green_base_color.jpg");

  const modelSize = useRef(1);
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    if (size.y > 0) {
      modelSize.current = size.y;
    }
  }, [scene]);

  // Handle spin and flavor swap
  const spinY = useRef(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Trigger spin animation
    gsap.to(spinY, {
      current: spinY.current + Math.PI * 2,
      duration: 0.6,
      ease: "power2.in",
      onUpdate: () => {
        if (primitiveRef.current) {
          primitiveRef.current.rotation.y = spinY.current;
        }
      },
      onComplete: () => {
        // Swap texture at peak (360 deg / PI * 2)
        setRenderedFlavor(flavor);

        // Complete the spin (another 360 deg / PI * 2)
        gsap.to(spinY, {
          current: spinY.current + Math.PI * 2,
          duration: 1.2,
          ease: "back.out(0.7)",
          onUpdate: () => {
            if (primitiveRef.current) {
              primitiveRef.current.rotation.y = spinY.current;
            }
          }
        });
      }
    });
  }, [flavor]);

  useEffect(() => {
    blueTexture.flipY = false;
    greenTexture.flipY = false;
    
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child.material.name !== "Aluminum") { // Only swap label textures
          if (child.material.map || child.material.name.toLowerCase().includes("label") || child.material.name.includes("Mat")) {
            child.material.map = renderedFlavor === 'blue' ? blueTexture : greenTexture;
            child.material.needsUpdate = true;
          }
        }
      }
    });
  }, [renderedFlavor, scene, blueTexture, greenTexture]);

  useFrame((state) => {
    // Gentle floating
    const t = state.clock.getElapsedTime();
    if (canRef.current) {
      canRef.current.position.y = Math.sin(t) * 0.15;
    }
  });

  // Calculate target height responsively
  const targetHeight = Math.min(viewport.height * 0.6, viewport.width * 0.85);
  const scale = targetHeight / modelSize.current;

  return (
    <group {...props} ref={canRef} scale={scale} rotation={[0, Math.PI, 25 * Math.PI / 180]} dispose={null}>
      <Center>
        <primitive object={scene} ref={primitiveRef} />
      </Center>
    </group>
  );
}

function FloatingItem({ url, position, scale, rotation, speed = 1, floatIntensity = 1, rotationIntensity = 1 }) {
  const { scene } = useGLTF(url);
  const clonedScene = scene.clone();
  
  return (
    <Float speed={speed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      <primitive 
        object={clonedScene} 
        position={position} 
        scale={scale} 
        rotation={rotation} 
      />
    </Float>
  );
}

export default function Scene({ flavor = 'green' }) {
  const cherryUrl = "/assets/cherry.glb";
  const blueberryUrl = "/assets/blueberry.glb";
  const leafUrl = "/assets/leaves.glb";

  const berryUrl = flavor === 'blue' ? blueberryUrl : cherryUrl;

  const items = [
    { url: berryUrl, pos: [-3, 2, -2], scale: 0.8, rot: [Math.PI / 4, 0, 0] },
    { url: berryUrl, pos: [4, 1, -3], scale: 1.2, rot: [0, Math.PI / 2, 0] },
    { url: berryUrl, pos: [-4, -1, -4], scale: 0.6, rot: [0, 0, Math.PI / 3] },
    { url: berryUrl, pos: [3, -2, -2], scale: 0.9, rot: [Math.PI / 6, 0, 0] },
    { url: leafUrl, pos: [-2, 3, -4], scale: 0.5, rot: [0, Math.PI / 4, 0] },
    { url: leafUrl, pos: [3, 3, -5], scale: 0.7, rot: [Math.PI / 2, 0, 0] },
    { url: leafUrl, pos: [-4, 0, -3], scale: 0.4, rot: [0, 0, Math.PI / 6] },
    { url: leafUrl, pos: [2, -3, -4], scale: 0.6, rot: [0, Math.PI / 3, 0] },
  ];

  return (
    <div className="hero-center" style={{ pointerEvents: 'none' }}>
      <div className="main-product-3d" style={{ pointerEvents: 'auto' }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Suspense fallback={null}>
            <PresentationControls 
              global 
              config={{ mass: 2, tension: 500 }} 
              snap={{ mass: 4, tension: 1500 }} 
              rotation={[0, 0, 0]} 
              polar={[-Math.PI / 3, Math.PI / 3]} 
              azimuth={[-Math.PI / 1.4, Math.PI / 2]}
            >
              <SodaCan flavor={flavor} />
            </PresentationControls>
            
            {items.map((item, i) => (
              <FloatingItem 
                key={`${item.url}-${i}`} 
                url={item.url} 
                position={item.pos} 
                scale={item.scale} 
                rotation={item.rot}
                speed={1.5 + Math.random()}
                floatIntensity={2}
              />
            ))}

            <Environment preset="city" />
            <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

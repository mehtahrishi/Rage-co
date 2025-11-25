'use client';

import { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={1.8} />;
}

function Fallback() {
    const ref = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * 0.5;
            ref.current.rotation.y += delta * 0.8;
        }
    });

    return (
        <mesh ref={ref}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#ffffff" wireframe />
        </mesh>
    );
}

export function BrandModel() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Switch model based on theme: brand1.glb for dark mode, brand.glb for light mode
    const modelUrl = mounted && resolvedTheme === 'dark' ? '/brand1.glb' : '/brand.glb';

    return (
        <div className="w-full h-full rounded-lg overflow-hidden transition-colors duration-300">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Suspense fallback={<Fallback />}>
                    <Center>
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                            {/* 
                  NOTE: Ensure 'brand.glb' and 'brand1.glb' are placed in the 'public' folder.
               */}
                            <Model url={modelUrl} />
                        </Float>
                    </Center>
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={4}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.5}
                />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}

// Pre-load the models to avoid waterfall
useGLTF.preload('/brand.glb');
useGLTF.preload('/brand1.glb');

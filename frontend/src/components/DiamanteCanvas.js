"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Center } from "@react-three/drei";

function DiamanteModel() {
    const { scene } = useGLTF("/diamante.glb");
    const modelRef = useRef();

    useFrame((state, delta) => {
        if (modelRef.current) {
            // Rotación matemática ligera y fluida
            modelRef.current.rotation.y += delta * 0.45;
            modelRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
            <Center>
                <primitive ref={modelRef} object={scene} scale={2.8} />
            </Center>
        </Float>
    );
}

// Precarga local rápida
useGLTF.preload("/diamante.glb");

export default function DiamanteCanvas() {
    return (
        <div className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] relative pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 4.5], fov: 45 }}
                dpr={[1, 1.5]} // ⚡ CRÍTICO: Evita renderizar a resoluciones gigantescas en celulares
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: "default",
                    preserveDrawingBuffer: false,
                }}
                className="w-full h-full"
            >
                <Suspense fallback={null}>
                    {/* Luces locales calculadas al vuelo (0 descargas de internet) */}
                    <ambientLight intensity={1.8} />
                    <directionalLight position={[5, 10, 5]} intensity={4} color="#c084fc" />
                    <directionalLight position={[-5, -8, -5]} intensity={2.5} color="#34d399" />
                    <pointLight position={[0, 0, 2]} intensity={2} color="#ffffff" />

                    {/* El diamante */}
                    <DiamanteModel />
                </Suspense>
            </Canvas>
        </div>
    );
}

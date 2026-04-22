import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BodyFigure from './BodyFigure';
import type { BodyParams } from '../../lib/body-interpolation';

interface BodySceneProps {
  params: BodyParams;
}

export default function BodyScene({ params }: BodySceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.0, 3.0], fov: 40 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      {/* Verlichting — 3-point setup voor natuurlijke schaduwen op huid */}
      <ambientLight intensity={0.35} />
      {/* Key light (warm, van rechtsboven) */}
      <directionalLight position={[3, 5, 4]} intensity={0.9} color="#FFF4E0" />
      {/* Fill light (koel, van linksonder, zachter) */}
      <directionalLight position={[-3, 2, 2]} intensity={0.35} color="#D4E4FF" />
      {/* Rim light (achter, voor silhouette) */}
      <directionalLight position={[0, 3, -4]} intensity={0.4} />

      {/* Figuur */}
      <BodyFigure params={params} />

      {/* Controls: draaien + zoom, geen pan */}
      <OrbitControls
        target={[0, 0.9, 0]}
        enablePan={false}
        minDistance={1.5}
        maxDistance={6}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.85}
      />
    </Canvas>
  );
}

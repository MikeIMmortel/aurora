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
      {/* Verlichting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={0.8} />
      <directionalLight position={[-2, 3, -3]} intensity={0.3} />

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

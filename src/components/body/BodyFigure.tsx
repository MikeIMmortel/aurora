import { useMemo } from 'react';
import * as THREE from 'three';
import type { BodyParams } from '../../lib/body-interpolation';

interface BodyFigureProps {
  params: BodyParams;
}

/** Warme huidkleur — neutraal, niet te metallic */
const SKIN_MATERIAL = {
  color: '#D4A574',
  metalness: 0.05,
  roughness: 0.75,
};

/**
 * Taperende ledemaat: cilinder met sphere-caps aan beide uiteinden voor
 * naadloze overgangen (geen harde rand waar bv. de elleboog zit).
 */
function TaperedLimb({
  topRadius,
  bottomRadius,
  length,
  position,
}: {
  topRadius: number;
  bottomRadius: number;
  length: number;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[topRadius, bottomRadius, length, 20]} />
        <meshStandardMaterial {...SKIN_MATERIAL} />
      </mesh>
      <mesh position={[0, length / 2, 0]}>
        <sphereGeometry args={[topRadius, 16, 12]} />
        <meshStandardMaterial {...SKIN_MATERIAL} />
      </mesh>
      <mesh position={[0, -length / 2, 0]}>
        <sphereGeometry args={[bottomRadius, 16, 12]} />
        <meshStandardMaterial {...SKIN_MATERIAL} />
      </mesh>
    </group>
  );
}

/**
 * Parametrisch 3D lichaam — v2.
 *
 * Verbeteringen t.o.v. v1:
 * - Torso is één doorlopend lathe-mesh met natuurlijke taille-taper, borstverbreding
 *   en schouderovergang i.p.v. twee stapelende cilinders
 * - Torso is elliptisch (bredere zijkanten dan voorkant/achterkant) door Z-vertices
 *   per hoogte te schalen naar de verhouding X/Z uit de meting
 * - Armen en benen taperen (bovenarm breder dan elleboog; dij breder dan knie etc.)
 * - Zichtbare schouders, handen en voeten als aparte meshes
 * - Huidkleur materiaal i.p.v. metalen goud
 *
 * Dimensies in meters; figuur staat op Y=0 met hoofd rond Y=1.73.
 */
export default function BodyFigure({ params }: BodyFigureProps) {
  const {
    headRadius,
    neckRadius,
    chestRadiusX,
    chestRadiusZ,
    waistRadiusX,
    waistRadiusZ,
    upperArmRadius,
    forearmRadius,
    upperLegRadius,
    lowerLegRadius,
  } = params;

  // --- Anatomische Y-posities ---------------------------------------------
  const hipY = 1.04;
  const neckBaseY = 1.52;
  const torsoHeight = neckBaseY - hipY; // 0.48
  const shoulderY = 1.44;
  const headCenterY = 1.66;

  const upperArmH = 0.28;
  const forearmH = 0.24;
  const upperArmCenterY = shoulderY - 0.02 - upperArmH / 2;
  const forearmCenterY = upperArmCenterY - upperArmH / 2 - forearmH / 2 - 0.02;
  const handY = forearmCenterY - forearmH / 2 - 0.05;

  const upperLegH = 0.38;
  const lowerLegH = 0.38;
  const upperLegCenterY = hipY - upperLegH / 2;
  const lowerLegCenterY = upperLegCenterY - upperLegH / 2 - lowerLegH / 2 - 0.02;
  const footY = lowerLegCenterY - lowerLegH / 2 - 0.03;

  const shoulderX = chestRadiusX * 0.85 + upperArmRadius * 0.6;
  const legOffsetX = 0.08;

  // --- Torso als lathe-mesh met elliptische cross-section ----------------
  const torsoGeo = useMemo(() => {
    // Profiel: [hoogtefractie 0–1, radius in X-as]
    const profile: [number, number][] = [
      [0.00, waistRadiusX * 1.05],  // heup (iets breder)
      [0.12, waistRadiusX * 0.98],
      [0.28, waistRadiusX * 0.88],  // taille (smalst)
      [0.44, waistRadiusX * 1.04],  // onderaan borstkas
      [0.62, chestRadiusX * 0.98],
      [0.72, chestRadiusX],         // borst (breedst bovenin)
      [0.84, chestRadiusX * 0.80],
      [0.92, chestRadiusX * 0.45],  // schouderovergang
      [1.00, neckRadius * 1.15],    // nekbasis
    ];

    const points = profile.map(([f, r]) => new THREE.Vector2(r, f * torsoHeight));
    const geo = new THREE.LatheGeometry(points, 40);

    // Maak torso elliptisch: voorkant/achterkant smaller dan zijkant
    const waistRatio = waistRadiusZ / waistRadiusX;
    const chestRatio = chestRadiusZ / chestRadiusX;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const frac = Math.max(0, Math.min(1, y / torsoHeight));
      // Blend tussen waist-ratio (onder) en chest-ratio (boven)
      let ratio: number;
      if (frac < 0.28) ratio = waistRatio;
      else if (frac > 0.72) ratio = chestRatio;
      else ratio = waistRatio + (chestRatio - waistRatio) * ((frac - 0.28) / 0.44);
      pos.setZ(i, z * ratio);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [chestRadiusX, chestRadiusZ, waistRadiusX, waistRadiusZ, neckRadius, torsoHeight]);

  return (
    <group>
      {/* --- HOOFD + NEK --- */}
      <mesh position={[0, headCenterY, 0]}>
        <sphereGeometry args={[headRadius, 32, 24]} />
        <meshStandardMaterial {...SKIN_MATERIAL} />
      </mesh>
      {/* Kaaklijn — subtiel */}
      <mesh position={[0, headCenterY - headRadius * 0.35, headRadius * 0.25]} scale={[1, 0.7, 1]}>
        <sphereGeometry args={[headRadius * 0.55, 16, 12]} />
        <meshStandardMaterial {...SKIN_MATERIAL} />
      </mesh>

      <mesh position={[0, neckBaseY + 0.04, 0]}>
        <cylinderGeometry args={[neckRadius, neckRadius * 1.1, 0.10, 20]} />
        <meshStandardMaterial {...SKIN_MATERIAL} />
      </mesh>

      {/* --- TORSO (één mesh) --- */}
      <mesh position={[0, hipY, 0]} geometry={torsoGeo}>
        <meshStandardMaterial {...SKIN_MATERIAL} />
      </mesh>

      {/* --- SCHOUDERS (smoothing capsule) --- */}
      {[-1, 1].map((side) => (
        <mesh
          key={`sh-${side}`}
          position={[side * shoulderX * 0.92, shoulderY + 0.02, 0]}
        >
          <sphereGeometry args={[upperArmRadius * 1.25, 20, 16]} />
          <meshStandardMaterial {...SKIN_MATERIAL} />
        </mesh>
      ))}

      {/* --- ARMEN --- */}
      {[-1, 1].map((side) => (
        <group key={`arm-${side}`}>
          <TaperedLimb
            topRadius={upperArmRadius}
            bottomRadius={forearmRadius * 1.15}
            length={upperArmH}
            position={[side * shoulderX, upperArmCenterY, 0]}
          />
          <TaperedLimb
            topRadius={forearmRadius}
            bottomRadius={forearmRadius * 0.68}
            length={forearmH}
            position={[side * shoulderX, forearmCenterY, 0]}
          />
          {/* Hand — langwerpig en iets afgeplat */}
          <mesh
            position={[side * shoulderX, handY, 0]}
            scale={[1, 1.5, 0.55]}
          >
            <sphereGeometry args={[forearmRadius * 0.75, 16, 12]} />
            <meshStandardMaterial {...SKIN_MATERIAL} />
          </mesh>
        </group>
      ))}

      {/* --- BENEN --- */}
      {[-1, 1].map((side) => (
        <group key={`leg-${side}`}>
          <TaperedLimb
            topRadius={upperLegRadius}
            bottomRadius={lowerLegRadius * 1.1}
            length={upperLegH}
            position={[side * legOffsetX, upperLegCenterY, 0]}
          />
          <TaperedLimb
            topRadius={lowerLegRadius}
            bottomRadius={lowerLegRadius * 0.58}
            length={lowerLegH}
            position={[side * legOffsetX, lowerLegCenterY, 0]}
          />
          {/* Voet — langwerpig naar voren */}
          <mesh
            position={[side * legOffsetX, footY, 0.08]}
            scale={[1, 0.5, 2.2]}
          >
            <sphereGeometry args={[lowerLegRadius * 0.78, 16, 12]} />
            <meshStandardMaterial {...SKIN_MATERIAL} />
          </mesh>
        </group>
      ))}

      {/* --- GROND-INDICATOR --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[0.45, 32]} />
        <meshStandardMaterial color="#2A2A2A" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

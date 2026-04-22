import { useMemo } from 'react';
import * as THREE from 'three';
import type { BodyParams } from '../../lib/body-interpolation';

interface BodyFigureProps {
  params: BodyParams;
}

/** Aurora gold materiaal — gedeeld door alle meshes */
const MATERIAL_PROPS = {
  color: '#C8A55C',
  metalness: 0.3,
  roughness: 0.6,
};

/**
 * Parametrisch 3D lichaam.
 *
 * Figuur staat rechtop op Y=0, totale hoogte ~1.73 units.
 * Elke dimensie reageert op de BodyParams die uit de meetdata komen.
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

  // ------- Hoogte-posities (van boven naar beneden) -------
  const headY = 1.64;
  const neckY = 1.52;
  const neckH = 0.06;
  const chestH = 0.30;
  const chestY = 1.34;
  const waistH = 0.15;
  const waistY = chestY - chestH / 2 - waistH / 2; // ~1.115
  const hipY = waistY - waistH / 2; // ~1.04

  // Armen: schouders net onder bovenkant borst
  const shoulderY = chestY + chestH / 2 - 0.04; // ~1.45
  const shoulderSpread = chestRadiusX + upperArmRadius + 0.02;
  const upperArmH = 0.28;
  const upperArmY = shoulderY - upperArmH / 2 - 0.02;
  const forearmH = 0.24;
  const forearmY = upperArmY - upperArmH / 2 - forearmH / 2;

  // Benen: beginnen bij heupen
  const legSpread = 0.08;
  const upperLegH = 0.38;
  const upperLegY = hipY - upperLegH / 2;
  const lowerLegH = 0.38;
  const lowerLegY = upperLegY - upperLegH / 2 - lowerLegH / 2;

  // ------- Elliptische torso geometrie (chest + waist) -------
  const chestGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(1, 1, chestH, 24);
    // Schaal de vertices naar ellips-vorm
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setX(i, x * chestRadiusX);
      pos.setZ(i, z * chestRadiusZ);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [chestRadiusX, chestRadiusZ, chestH]);

  const waistGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(1, 1, waistH, 24);
    const pos = geo.attributes.position;
    // Top van waist = iets smaller (overgang van borst)
    // Bottom = iets breder (heupen)
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      // Interpoleer van borst-breedte (top) naar taille-breedte (bottom)
      const blend = (y / waistH) + 0.5; // 0=bottom, 1=top
      const rx = chestRadiusX * blend + waistRadiusX * (1 - blend);
      const rz = chestRadiusZ * blend + waistRadiusZ * (1 - blend);
      pos.setX(i, x * rx);
      pos.setZ(i, z * rz);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [chestRadiusX, chestRadiusZ, waistRadiusX, waistRadiusZ, waistH]);

  // Capsule geometrie helper
  const capsule = (radius: number, height: number) => (
    <capsuleGeometry args={[radius, height, 8, 16]} />
  );

  return (
    <group>
      {/* Hoofd */}
      <mesh position={[0, headY, 0]}>
        <sphereGeometry args={[headRadius, 24, 24]} />
        <meshStandardMaterial {...MATERIAL_PROPS} />
      </mesh>

      {/* Nek */}
      <mesh position={[0, neckY, 0]}>
        <cylinderGeometry args={[neckRadius, neckRadius, neckH, 16]} />
        <meshStandardMaterial {...MATERIAL_PROPS} />
      </mesh>

      {/* Bovenlichaam (borst) - elliptisch */}
      <mesh position={[0, chestY, 0]} geometry={chestGeo}>
        <meshStandardMaterial {...MATERIAL_PROPS} />
      </mesh>

      {/* Taille/buik - elliptisch, overvloeiend */}
      <mesh position={[0, waistY, 0]} geometry={waistGeo}>
        <meshStandardMaterial {...MATERIAL_PROPS} />
      </mesh>

      {/* ===== ARMEN ===== */}
      {[-1, 1].map((side) => (
        <group key={`arm-${side}`}>
          {/* Bovenarm */}
          <mesh position={[side * shoulderSpread, upperArmY, 0]}>
            {capsule(upperArmRadius, upperArmH)}
            <meshStandardMaterial {...MATERIAL_PROPS} />
          </mesh>
          {/* Onderarm */}
          <mesh position={[side * shoulderSpread, forearmY, 0]}>
            {capsule(forearmRadius, forearmH)}
            <meshStandardMaterial {...MATERIAL_PROPS} />
          </mesh>
        </group>
      ))}

      {/* ===== BENEN ===== */}
      {[-1, 1].map((side) => (
        <group key={`leg-${side}`}>
          {/* Bovenbeen */}
          <mesh position={[side * legSpread, upperLegY, 0]}>
            {capsule(upperLegRadius, upperLegH)}
            <meshStandardMaterial {...MATERIAL_PROPS} />
          </mesh>
          {/* Onderbeen */}
          <mesh position={[side * legSpread, lowerLegY, 0]}>
            {capsule(lowerLegRadius, lowerLegH)}
            <meshStandardMaterial {...MATERIAL_PROPS} />
          </mesh>
        </group>
      ))}

      {/* Grond-indicator (subtiele cirkel) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshStandardMaterial
          color="#2A2A2A"
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

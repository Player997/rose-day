
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

/**
 * Procedural Realistic Petal Geometry
 * Creates an organic spade-like shape with custom vertex displacement for realistic curvature.
 */
const createPetalGeometry = (width: number, height: number, curl: number, roll: number, scaleFactor: number) => {
  const shape = new THREE.Shape();
  // Organic, slightly irregular silhouette
  shape.moveTo(0, 0);
  shape.bezierCurveTo(width * 0.45, height * 0.1, width * 0.85, height * 0.4, width * 0.5, height * 0.98);
  shape.bezierCurveTo(width * 0.2, height * 1.15, -width * 0.2, height * 1.15, -width * 0.5, height * 0.98);
  shape.bezierCurveTo(-width * 0.85, height * 0.4, -width * 0.45, height * 0.1, 0, 0);

  const geometry = new THREE.ShapeGeometry(shape, 64);
  const pos = geometry.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const yRatio = v.y / height;
    const xRatio = Math.abs(v.x / width);

    // Deep central fold for the 'cup' look
    const cup = Math.pow(xRatio, 2) * 0.6 + Math.pow(yRatio, 2) * 0.2;
    
    // Outward flare for blooming effect
    const flare = Math.pow(yRatio, 3) * curl;
    
    // Delicate rolled edge at the tip for that DSLR macro detail
    const edgeRoll = Math.sin(yRatio * Math.PI) * Math.pow(yRatio, 6) * roll;
    
    // Add organic noise/imperfections to the surface
    const noise = (Math.sin(v.y * 15) * 0.01) + (Math.cos(v.x * 12) * 0.01);
    
    pos.setZ(i, (cup + flare + edgeRoll + noise) * scaleFactor);
  }
  
  geometry.computeVertexNormals();
  return geometry;
};

const Petal = ({ layer, index, total }: { layer: number; index: number; total: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    // Inner petals are tighter/smaller, outer are broader and more curled
    const w = 0.35 + (layer * 0.25);
    const h = 0.65 + (layer * 0.2);
    const curl = layer * 0.5;
    const roll = layer > 1 ? 0.35 : 0.05;
    const scale = 1.0;
    return createPetalGeometry(w, h, curl, roll, scale);
  }, [layer]);

  const material = useMemo(() => {
    // Deep red to light crimson gradient simulation via Physical Material
    const deepRed = new THREE.Color('#8b0000'); // Core
    const brightRed = new THREE.Color('#e0115f'); // Mid
    const edgePink = new THREE.Color('#ff4d6d'); // Edges
    
    const color = deepRed.clone().lerp(brightRed, layer * 0.25);
    
    return new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: 0.85, // Matte velvety feel
      metalness: 0.0,
      sheen: 1.0, // Critical for fabric/petal velvet look
      sheenColor: edgePink,
      sheenRoughness: 0.9,
      side: THREE.DoubleSide,
      transmission: 0.1, // Slight light passing through thin edges
      thickness: 0.5,
      emissive: new THREE.Color('#200000'),
      emissiveIntensity: 0.1
    });
  }, [layer]);

  const angle = (index / total) * Math.PI * 2 + (layer * 0.85);
  const tilt = (Math.PI / 16) + (layer * 0.45);

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry} 
      material={material} 
      rotation={[-tilt, angle, 0]} 
      castShadow
    />
  );
};

export const RoseModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      // Ultra subtle organic "breathing" to feel alive but stable
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.02;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.02} floatIntensity={0.05}>
      <group ref={groupRef} scale={0.48}>
        {/* Bloom Center */}
        {[...Array(6)].map((_, i) => (
          <Petal key={`L0-${i}`} layer={0} index={i} total={6} />
        ))}
        {/* Middle Layers */}
        {[...Array(8)].map((_, i) => (
          <Petal key={`L1-${i}`} layer={1} index={i} total={8} />
        ))}
        {[...Array(10)].map((_, i) => (
          <Petal key={`L2-${i}`} layer={2} index={i} total={10} />
        ))}
        {/* Outer Flare */}
        {[...Array(12)].map((_, i) => (
          <Petal key={`L3-${i}`} layer={3} index={i} total={12} />
        ))}

        {/* Stem (Realistic Green) */}
        <mesh position={[0, -2.5, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 5, 12]} />
          <meshPhysicalMaterial color="#1b4332" roughness={0.8} />
        </mesh>
        
        {/* Sepals at the base of the flower */}
        {[...Array(5)].map((_, i) => (
          <mesh 
            key={i} 
            rotation={[Math.PI / 1.2, (i * Math.PI * 2) / 5, 0]} 
            position={[0, -0.1, 0]}
          >
            <coneGeometry args={[0.08, 0.5, 8]} />
            <meshStandardMaterial color="#1b4332" />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

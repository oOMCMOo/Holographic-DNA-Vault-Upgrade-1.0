
import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Sphere, Text } from '@react-three/drei';

export const Helix3D = ({ searchQuery = "" }: { searchQuery?: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<{ side: 'a' | 'b', index: number } | null>(null);
  
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 60; i++) {
      pts.push({
        y: (i - 30) * 0.3,
        angle: i * 0.3,
        base: ['A', 'T', 'G', 'C'][i % 4]
      });
    }
    return pts;
  }, []);

  const highlightedIndices = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return new Set<number>();
    const sequence = points.map(p => p.base).join("");
    const matches = new Set<number>();
    const query = searchQuery.toUpperCase();
    
    let pos = sequence.indexOf(query);
    while (pos !== -1) {
      for (let i = 0; i < query.length; i++) {
        matches.add(pos + i);
      }
      pos = sequence.indexOf(query, pos + 1);
    }
    return matches;
  }, [searchQuery, points]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((p, i) => {
        const isHoveredA = hoveredNode?.side === 'a' && hoveredNode?.index === i;
        const isHoveredB = hoveredNode?.side === 'b' && hoveredNode?.index === i;
        const isSelected = highlightedIndices.has(i);

        return (
          <group key={i}>
            {/* Strand 1 (Cyan) */}
            <group 
              position={[Math.sin(p.angle) * 3, p.y, Math.cos(p.angle) * 3]}
              onPointerOver={(e) => { e.stopPropagation(); setHoveredNode({ side: 'a', index: i }); }}
              onPointerOut={() => setHoveredNode(null)}
            >
              <Sphere args={[isHoveredA || isSelected ? 0.15 : 0.1, 32, 32]}>
                <meshStandardMaterial 
                  color={isSelected ? "#10b981" : (isHoveredA ? "#ffffff" : "#22d3ee")} 
                  emissive={isSelected ? "#10b981" : (isHoveredA ? "#ffffff" : "#22d3ee")} 
                  emissiveIntensity={isSelected ? 10 : (isHoveredA ? 5 : 2)} 
                />
              </Sphere>
              {(isHoveredA || isSelected) && (
                <Text
                  position={[0.4, 0, 0]}
                  fontSize={0.2}
                  color={isSelected ? "#10b981" : "#ffffff"}
                  font="https://fonts.gstatic.com/s/jetbrainsmono/v18/t64vAdNSv7z3sR099WosqG67.woff"
                >
                  {p.base}
                </Text>
              )}
            </group>
            
            {/* Strand 2 (Violet) */}
            <group 
              position={[Math.sin(p.angle + Math.PI) * 3, p.y, Math.cos(p.angle + Math.PI) * 3]}
              onPointerOver={(e) => { e.stopPropagation(); setHoveredNode({ side: 'b', index: i }); }}
              onPointerOut={() => setHoveredNode(null)}
            >
              <Sphere args={[isHoveredB || isSelected ? 0.15 : 0.1, 32, 32]}>
                <meshStandardMaterial 
                  color={isSelected ? "#10b981" : (isHoveredB ? "#ffffff" : "#a78bfa")} 
                  emissive={isSelected ? "#10b981" : (isHoveredB ? "#ffffff" : "#a78bfa")} 
                  emissiveIntensity={isSelected ? 10 : (isHoveredB ? 5 : 2)} 
                />
              </Sphere>
              {(isHoveredB || isSelected) && (
                <Text
                  position={[-0.4, 0, 0]}
                  fontSize={0.2}
                  color={isSelected ? "#10b981" : "#ffffff"}
                  font="https://fonts.gstatic.com/s/jetbrainsmono/v18/t64vAdNSv7z3sR099WosqG67.woff"
                >
                  {['T', 'A', 'C', 'G'][i % 4]}
                </Text>
              )}
            </group>

            {/* Connection Rungs */}
            {i % 2 === 0 && (
              <mesh 
                position={[0, p.y, 0]} 
                rotation={[0, p.angle, Math.PI / 2]}
              >
                <boxGeometry args={[0.02, 6, 0.02]} />
                <meshStandardMaterial 
                  color={isSelected ? "#10b981" : "#ffffff"} 
                  opacity={hoveredNode?.index === i || isSelected ? 0.8 : 0.2} 
                  transparent 
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

export const VaultBackground = () => {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      particlesRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* Distant stars/points */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={5000}
            array={new Float32Array(5000 * 3).map(() => (Math.random() - 0.5) * 100)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.1} 
          color="#22d3ee" 
          transparent 
          opacity={0.4} 
          blending={THREE.AdditiveBlending} 
        />
      </points>

      {/* Floating Data Packets (Simulated) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={new Float32Array(100 * 3).map(() => (Math.random() - 0.5) * 20)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.3} 
          color="#a78bfa" 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Sacred Geometry Planes */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh rotation={[Math.PI / 4, 0, 0]} position={[0, 0, -15]}>
          <circleGeometry args={[25, 64]} />
          <meshBasicMaterial color="#4c1d95" opacity={0.03} transparent wireframe />
        </mesh>
      </Float>

      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#a78bfa" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#22d3ee" />
      <fog attach="fog" args={['#000000', 10, 30]} />
    </group>
  );
};

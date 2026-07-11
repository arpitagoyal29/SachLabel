import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

const NODE_COLORS = ['#c9c2b4', '#8f97a3', '#a6b0a0', '#b3a3a8', '#9aa6b3', '#b0ab9a']
const SEVERITY_GLOW = { CRITICAL: '#ff3b30', HIGH: '#ff3b30', MEDIUM: '#e0a020', LOW: '#8a8e97' }

const FRESNEL_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRESNEL_FRAGMENT = `
  uniform vec3 glowColor;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.2);
    gl_FragColor = vec4(glowColor, fresnel * 0.55);
  }
`

function DangerHalo() {
  const uniforms = useMemo(() => ({ glowColor: { value: [1, 0.23, 0.19] } }), [])
  return (
    <mesh>
      <sphereGeometry args={[0.66, 32, 32]} />
      <shaderMaterial transparent depthWrite={false} uniforms={uniforms} vertexShader={FRESNEL_VERTEX} fragmentShader={FRESNEL_FRAGMENT} />
    </mesh>
  )
}

function Node({ position, label, color, delay }) {
  const meshRef = useRef()
  const startedAt = useRef(null)

  useFrame((state) => {
    if (startedAt.current === null) startedAt.current = state.clock.elapsedTime
    const t = Math.min(Math.max((state.clock.elapsedTime - startedAt.current - delay) / 0.5, 0), 1)
    const scale = 1 - Math.pow(1 - t, 3)
    if (meshRef.current) meshRef.current.scale.setScalar(scale)
  })

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={0}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} />
      </mesh>
      <DangerHalo />
      <Html center position={[0, -0.85, 0]} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--ink)', pointerEvents: 'none' }}>
        {label}
      </Html>
    </group>
  )
}

function Edge({ from, to, color, delay }) {
  const meshRef = useRef()
  const matRef = useRef()
  const startedAt = useRef(null)

  const { mid, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...from)
    const end = new THREE.Vector3(...to)
    const dir = end.clone().sub(start)
    return {
      mid: start.clone().add(end).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()),
      length: dir.length(),
    }
  }, [from, to])

  useFrame((state) => {
    if (startedAt.current === null) startedAt.current = state.clock.elapsedTime
    const t = Math.min(Math.max((state.clock.elapsedTime - startedAt.current - delay) / 0.4, 0), 1)
    if (meshRef.current) meshRef.current.scale.y = t
    if (matRef.current) matRef.current.emissiveIntensity = t * (Math.sin(state.clock.elapsedTime * 3) * 0.3 + 1.3)
  })

  return (
    <mesh ref={meshRef} position={mid.toArray()} quaternion={quaternion}>
      <cylinderGeometry args={[0.07, 0.07, length, 16]} />
      <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={1.5} roughness={0.4} />
    </mesh>
  )
}

function Scene({ findings }) {
  const nodeNames = useMemo(() => {
    const set = new Set()
    findings.forEach((f) => { set.add(f.ingredientA); set.add(f.ingredientB) })
    return [...set]
  }, [findings])

  const radius = 1 + nodeNames.length * 0.35

  const nodePositions = useMemo(() => {
    const map = {}
    nodeNames.forEach((name, i) => {
      const angle = (i / nodeNames.length) * Math.PI * 2
      map[name] = [Math.cos(angle) * radius, Math.sin(angle) * radius, 0]
    })
    return map
  }, [nodeNames, radius])

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 3, 4]} intensity={0.9} />
      <Environment preset="studio" />

      {nodeNames.map((name, i) => (
        <Node key={name} position={nodePositions[name]} label={name} color={NODE_COLORS[i % NODE_COLORS.length]} delay={i * 0.1} />
      ))}

      {findings.map((f, i) => (
        <Edge
          key={`${f.ingredientA}-${f.ingredientB}-${i}`}
          from={nodePositions[f.ingredientA]}
          to={nodePositions[f.ingredientB]}
          color={SEVERITY_GLOW[f.severity] || '#8a8e97'}
          delay={nodeNames.length * 0.1 + 0.2}
        />
      ))}
    </>
  )
}

function CombinationGraph({ findings }) {
    const nodeCount = new Set(findings.flatMap((f) => [f.ingredientA, f.ingredientB])).size
  const cameraDistance = 5 + nodeCount * 1.1

  return (
    <div style={{ height: 380, borderRadius: 10, overflow: 'hidden', background: 'var(--paper-sunk)' }}>
      <Canvas camera={{ position: [0, 0, cameraDistance], fov: 45 }}>
        <Scene findings={findings} />
            <OrbitControls enableZoom enablePan={false} minDistance={3} maxDistance={cameraDistance * 1.8} />
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={0.6} luminanceSmoothing={0.25} intensity={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default CombinationGraph

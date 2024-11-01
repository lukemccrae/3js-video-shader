import React, { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { shaderMaterial, Environment, Plane } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber';

const VideoShaderMaterial = shaderMaterial(
  { uTexture: null, time: 0, amplitude: 1.5, time: 20 },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float time;
    uniform float amplitude;\

    void main() {
      vec2 uv = vUv;
      uv.y += sin(uv.x * 40.0 + time) * amplitude;
      vec4 color = texture2D(uTexture, uv);
      gl_FragColor = color;
    }
  `
)

extend({ VideoShaderMaterial })

// 2. Define the component to load and play the video
function VideoMaterial({ src, amplitude, time }) {
  const shaderRef = useRef()
  const videoRef = useRef(document.createElement('video'))

  useEffect(() => {
    const video = videoRef.current
    video.src = src
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.play()

    const texture = new THREE.VideoTexture(video)
    shaderRef.current.uTexture = texture
  }, [src])

  useFrame(({ clock }) => {
    // Update time and amplitude uniform to animate wave effect
    shaderRef.current.time = clock.getElapsedTime()
    shaderRef.current.amplitude = amplitude // Pass dynamic amplitude value to shader
  })

  return <videoShaderMaterial ref={shaderRef} />
}

export default function App() {
  const [amplitude, setAmplitude] = useState(1.5);
  const [time, setTime] = useState(5);
  const [vid, setVid] = useState(0)
  const vids = ['vid.mp4', 'mov.mp4']

  // Increase amplitude with an example setInterval (or use any control logic you prefer)
  useEffect(() => {
    const interval = setInterval(() => {
      setAmplitude(amplitude + 0.01)
      setTime(time + .5)
      setVid(vid === 0 ? 1 : 0)
    }, 2000)

    return () => clearInterval(interval)
  }, [time])

  return (
    <Canvas camera={{ position: [0, 0, 3], zoom: 1.8 }}>
      <Plane args={[4, 2.25]} position-y={0}>
        <Suspense fallback={<meshStandardMaterial wireframe={true} />}>
          <VideoMaterial src={vids[vid]} amplitude={amplitude} time={time} />
        </Suspense>
      </Plane>
      <Environment preset="lobby" />
    </Canvas>
  )
}

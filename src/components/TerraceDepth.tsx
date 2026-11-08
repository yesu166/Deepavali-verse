import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function TerraceDepth() {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = host.current
    if (!root) return
    const mobile = window.matchMedia('(max-width: 760px)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: 'low-power' })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.5))
    renderer.setSize(root.clientWidth, root.clientHeight)
    renderer.setClearColor(0x000000, 0)
    root.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, root.clientWidth / root.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 13)
    const count = mobile ? 95 : 260
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - .5) * 21
      positions[i * 3 + 1] = (Math.random() - .5) * 12
      positions[i * 3 + 2] = (Math.random() - .5) * 7
      sizes[i] = .018 + Math.random() * .045
      phases[i] = Math.random() * Math.PI * 2
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    const material = new THREE.PointsMaterial({ color: 0xffd58a, size: .055, transparent: true, opacity: .68, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true })
    const motes = new THREE.Points(geometry, material)
    scene.add(motes)
    const blueGeometry = new THREE.BufferGeometry()
    const bluePositions = new Float32Array(Math.round(count * .28) * 3)
    for (let i = 0; i < bluePositions.length; i += 3) {
      bluePositions[i] = (Math.random() - .5) * 19
      bluePositions[i + 1] = (Math.random() - .5) * 10
      bluePositions[i + 2] = -2 - Math.random() * 5
    }
    blueGeometry.setAttribute('position', new THREE.BufferAttribute(bluePositions, 3))
    const bluePoints = new THREE.Points(blueGeometry, new THREE.PointsMaterial({ color: 0x7fa8ff, size: .035, transparent: true, opacity: .45, blending: THREE.AdditiveBlending, depthWrite: false }))
    scene.add(bluePoints)
    const mouse = new THREE.Vector2()
    const target = new THREE.Vector2()
    const onPointer = (e: PointerEvent) => { mouse.x = (e.clientX / window.innerWidth - .5) * 2; mouse.y = (e.clientY / window.innerHeight - .5) * -2 }
    const onResize = () => {
      if (!root.isConnected) return
      const w = root.clientWidth, h = root.clientHeight
      camera.aspect = w / Math.max(1, h)
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.5))
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('resize', onResize)
    let frame = 0
    let raf = 0
    let visible = !document.hidden
    const onVisibility = () => { visible = !document.hidden }
    document.addEventListener('visibilitychange', onVisibility)
    const clock = new THREE.Clock()
    const draw = () => {
      if (!visible) { raf = window.requestAnimationFrame(draw); return }
      const t = clock.getElapsedTime()
      target.lerp(mouse, .035)
      camera.position.x = target.x * (mobile ? .12 : .38)
      camera.position.y = target.y * (mobile ? .07 : .22)
      camera.lookAt(0, 0, 0)
      if (!reduced) {
        const p = geometry.attributes.position as THREE.BufferAttribute
        for (let i = 0; i < count; i++) {
          p.array[i * 3 + 1] += Math.sin(t * .35 + phases[i]) * .0007
          p.array[i * 3] += Math.cos(t * .22 + phases[i]) * .00035
        }
        p.needsUpdate = true
        motes.rotation.z = Math.sin(t * .09) * .012
        bluePoints.rotation.y = Math.sin(t * .05) * .018
      }
      if (frame++ % (mobile ? 2 : 1) === 0) renderer.render(scene, camera)
      raf = window.requestAnimationFrame(draw)
    }
    draw()
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      geometry.dispose(); material.dispose(); blueGeometry.dispose(); (bluePoints.material as THREE.Material).dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])
  return <div className="terrace-depth" ref={host} aria-hidden="true" />
}
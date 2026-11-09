import { useLayoutEffect, useRef } from 'react'

/** Desktop-only guided cursor. The light tracks the pointer directly; the rocket eases behind it. */
export default function RocketCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const rocketRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)').matches) return
    let raf = 0, visible = false
    let x = -100, y = -100, rocketX = -136, rocketY = -100
    let velocityX = 1, velocityY = 0, previousX = x, previousY = y, previousTime = 0, angle = 90, hasPointer = false
    const show = () => {
      visible = true
      dotRef.current?.classList.add('is-visible')
      rocketRef.current?.classList.add('is-visible')
      if (!raf) { previousTime = performance.now(); raf = requestAnimationFrame(animate) }
    }
    const hide = () => {
      visible = false
      dotRef.current?.classList.remove('is-visible')
      rocketRef.current?.classList.remove('is-visible')
      cancelAnimationFrame(raf); raf = 0
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      x = event.clientX; y = event.clientY
      if (!hasPointer) {
        hasPointer = true
        rocketX = x - 38; rocketY = y + 10
        previousX = x; previousY = y
      } else {
        const dx = x - previousX, dy = y - previousY, distance = Math.hypot(dx, dy)
        if (distance > .6) { const blend = Math.min(.42, .14 + distance * .012); velocityX += (dx - velocityX) * blend; velocityY += (dy - velocityY) * blend }
        previousX = x; previousY = y
      }
      if (dotRef.current) dotRef.current.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%)'
      show()
    }
    const animate = (time: number) => {
      if (!visible) { raf = 0; return }
      const dt = Math.min(32, time - previousTime || 16); previousTime = time
      const speed = Math.hypot(velocityX, velocityY)
      if (speed > .12) {
        const nx = velocityX / speed, ny = velocityY / speed
        const desiredX = x - nx * 31, desiredY = y - ny * 31
        const ease = 1 - Math.pow(.0008, dt / 1000)
        rocketX += (desiredX - rocketX) * ease; rocketY += (desiredY - rocketY) * ease
        const aimX = x - rocketX, aimY = y - rocketY
        if (Math.hypot(aimX, aimY) > 1) angle = Math.atan2(aimY, aimX) * 180 / Math.PI + 90
      } else { rocketX += (x - rocketX) * .035; rocketY += (y - rocketY) * .035 }
      if (rocketRef.current) rocketRef.current.style.transform = 'translate3d(' + rocketX + 'px,' + rocketY + 'px,0) translate(-50%,-50%) rotate(' + angle + 'deg)'
      raf = requestAnimationFrame(animate)
    }
    document.addEventListener('pointermove', move, { passive: true, capture: true })
    document.documentElement.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    document.addEventListener('visibilitychange', hide)
    return () => { cancelAnimationFrame(raf); document.removeEventListener('pointermove', move, true); document.documentElement.removeEventListener('pointerleave', hide); window.removeEventListener('blur', hide); document.removeEventListener('visibilitychange', hide) }
  }, [])
  return <>
    <div ref={dotRef} className="cursor-light-dot" aria-hidden="true" />
    <div ref={rocketRef} className="cursor-chaser-rocket" aria-hidden="true">
      <svg viewBox="0 0 40 76" width="28" height="54">
        <defs>
          <linearGradient id="chaserHull" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#fff5d6"/><stop offset=".42" stopColor="#e8d8b8"/><stop offset="1" stopColor="#9f8061"/></linearGradient>
          <linearGradient id="chaserFlame" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff4ab"/><stop offset=".48" stopColor="#ffc04e"/><stop offset="1" stopColor="#ed6732" stopOpacity="0"/></linearGradient>
        </defs>
        <path d="M20 2 C10 12 9 28 10 46 L30 46 C31 28 30 12 20 2Z" fill="url(#chaserHull)" stroke="#fff0c9" strokeWidth="1"/>
        <path d="M20 2 C16 9 14 13 13 18 L27 18 C26 13 24 9 20 2Z" fill="#f6c875"/>
        <path d="M13 24 L27 24 L27 29 L13 29Z" fill="#b38b5c" opacity=".7"/>
        <ellipse cx="20" cy="34" rx="5.2" ry="6.5" fill="#1b4860" stroke="#f9dda1" strokeWidth="1.5"/>
        <ellipse cx="18.5" cy="32" rx="1.6" ry="2.2" fill="#b8f4ff" opacity=".8"/>
        <path d="M10 37 L3 51 L12 47 L15 42Z" fill="#d7ac70" stroke="#f5d9a4" strokeWidth=".8"/>
        <path d="M30 37 L37 51 L28 47 L25 42Z" fill="#d7ac70" stroke="#f5d9a4" strokeWidth=".8"/>
        <path d="M15 47 L25 47 L20 73Z" fill="url(#chaserFlame)" opacity=".95"/><path d="M18 47 L22 47 L20 64Z" fill="#fff7c8"/>
      </svg><span className="rocket-chaser-trail"/>
    </div>
  </>
}
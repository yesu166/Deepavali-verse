import { useEffect, useRef } from 'react'

type Particle = { x:number; y:number; vx:number; vy:number; life:number; maxLife:number; hue:number; size:number }
type Rocket = { x:number; y:number; targetY:number; hue:number; speed:number }
const rand = (min:number,max:number) => Math.random()*(max-min)+min

export default function FireworksCanvas({ active = true, interactive = true }: { active?: boolean; interactive?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const rockets = useRef<Rocket[]>([])
  const frame = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return
    let width = 0, height = 0, raf = 0, last = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
      width = window.innerWidth; height = window.innerHeight
      canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr)
      canvas.style.width = width+'px'; canvas.style.height = height+'px'
      ctx.setTransform(dpr,0,0,dpr,0,0)
    }
    const burst = (x:number,y:number,hue:number) => {
      const count = width < 600 ? 36 : 66
      for (let i=0;i<count;i++) {
        const angle = Math.PI*2*i/count + rand(-.08,.08)
        const speed = rand(1.1,4.2)
        particles.current.push({ x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:rand(46,90),maxLife:90,hue:hue+rand(-28,28),size:rand(1,2.5) })
      }
    }
    const launch = (x:number,y:number) => rockets.current.push({x,y:height+8,targetY:y,hue:rand(25,350),speed:rand(6,9)})
    const onPointer = (event:PointerEvent) => {
      if (!interactive) return
      launch(event.clientX, Math.max(90,event.clientY-rand(30,120)))
    }
    const onResize = () => resize()
    resize()
    canvas.addEventListener('pointerdown',onPointer)
    window.addEventListener('resize',onResize)
    const draw = (time:number) => {
      raf = requestAnimationFrame(draw)
      if (time-last < 30) return
      last = time
      ctx.clearRect(0,0,width,height)
      frame.current++
      if (frame.current % (width < 600 ? 130 : 95) === 0) launch(rand(width*.12,width*.88),rand(height*.12,height*.48))
      rockets.current = rockets.current.filter(rocket => {
        rocket.y -= rocket.speed
        ctx.fillStyle = `hsla(${rocket.hue},100%,75%,.8)`
        ctx.fillRect(rocket.x,rocket.y,2,7)
        if (rocket.y <= rocket.targetY) { burst(rocket.x,rocket.y,rocket.hue); return false }
        return true
      })
      particles.current = particles.current.filter(p => p.life > 0)
      for (const p of particles.current) {
        p.x += p.vx; p.y += p.vy; p.vy += .035; p.vx *= .989; p.vy *= .989; p.life--
        const alpha = Math.max(0,p.life/p.maxLife)
        ctx.beginPath(); ctx.fillStyle = `hsla(${p.hue},100%,${65+alpha*22}%,${alpha})`
        ctx.shadowBlur = 12; ctx.shadowColor = `hsla(${p.hue},100%,65%,.8)`
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill()
      }
      ctx.shadowBlur = 0
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener('pointerdown',onPointer); window.removeEventListener('resize',onResize) }
  }, [active,interactive])
  return <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true" />
}
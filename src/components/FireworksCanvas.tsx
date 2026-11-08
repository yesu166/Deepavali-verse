import { useEffect, useRef } from 'react'

export type LaunchCommand = {
  id:number
  kind:'sky'|'volley'|'battery'|'fountain'
  hue?:number
  x?:number
  y?:number
}
type Particle={x:number;y:number;vx:number;vy:number;life:number;maxLife:number;hue:number;size:number;gravity:number;drag:number;twinkle:number}
type Rocket={x:number;y:number;tx:number;ty:number;hue:number;speed:number;kind:LaunchCommand['kind'];style:'bloom'|'willow'|'comet'}
const rand=(min:number,max:number)=>Math.random()*(max-min)+min

export default function FireworksCanvas({active=true,interactive=true,ambient=false,launchRequest,placementMode=false,pattern='bloom',hue=-1,onPlace}:{active?:boolean;interactive?:boolean;ambient?:boolean;launchRequest?:LaunchCommand|null;placementMode?:boolean;hue?:number;pattern?:'bloom'|'willow'|'comet';onPlace?:(x:number,y:number)=>void}) {
 const canvasRef=useRef<HTMLCanvasElement>(null)
 const particles=useRef<Particle[]>([])
 const rockets=useRef<Rocket[]>([])
 const frame=useRef(0)
 const onPlaceRef=useRef(onPlace)
 onPlaceRef.current=onPlace
 useEffect(()=>{
  const canvas=canvasRef.current
  if(!canvas||!active)return
  const ctx=canvas.getContext('2d',{alpha:true})
  if(!ctx)return
  let width=0,height=0,raf=0,last=0
  const mobile=window.matchMedia('(max-width: 760px)').matches
  const maxParticles=mobile?650:1700
  const resize=()=>{
   const dpr=Math.min(window.devicePixelRatio||1,mobile?1.1:1.5)
   width=window.innerWidth;height=window.innerHeight
   canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr)
   canvas.style.width=width+'px';canvas.style.height=height+'px'
   ctx.setTransform(dpr,0,0,dpr,0,0)
  }
  const burst=(x:number,y:number,hue:number,kind:LaunchCommand['kind'],style:'bloom'|'willow'|'comet')=>{
   const count=kind==='volley'?95:kind==='battery'?74:kind==='fountain'?46:(mobile?65:110)
   const shape=kind==='fountain'?'fountain':style==='willow'||kind==='battery'?'willow':style==='comet'?'comet':'bloom'
   for(let i=0;i<count&&particles.current.length<maxParticles;i++){
    const angle=shape==='fountain'?rand(-Math.PI*.92,-Math.PI*.08):Math.PI*2*i/count+rand(-.06,.06)
    const speed=shape==='fountain'?rand(1.7,4.4):shape==='willow'?rand(.7,2.5):rand(1.5,4.9)
    particles.current.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:shape==='willow'?rand(75,130):rand(46,100),maxLife:shape==='willow'?130:100,hue:hue+rand(-24,24),size:rand(1.2,2.7),gravity:shape==='willow'?.065:.038,drag:shape==='willow'?.992:.988,twinkle:Math.random()*6})
   }
  }
  const launch=(xRatio:number,yRatio:number,hue:number,kind:LaunchCommand['kind'])=>{
   rockets.current.push({x:Math.max(12,Math.min(width-12,width*xRatio)),y:height*1.02,tx:width*xRatio,ty:height*yRatio,hue,speed:kind==='fountain'?11:rand(7.2,10.5),kind,style:pattern})
  }
  const trigger=(command:LaunchCommand)=>{
   const x=command.x??rand(.18,.84),y=command.y??rand(.23,.47),hue=command.hue??rand(12,345)
   if(command.kind==='volley'){
    for(let i=0;i<5;i++)launch(Math.min(.9,Math.max(.1,x+(i-2)*.105)),Math.max(.18,y+rand(-.1,.1)),hue+rand(-40,40),'sky')
   }else if(command.kind==='battery'){
    launch(x,y,hue,'battery');launch(Math.min(.92,x+.055),y+.08,hue+24,'battery');launch(Math.max(.08,x-.055),y-.04,hue-24,'battery')
   }else launch(x,y,hue,command.kind)
  }
  if(launchRequest)trigger(launchRequest)
  const onPointer=(event:PointerEvent)=>{
   if(placementMode){
    const rect=canvas.getBoundingClientRect()
    onPlaceRef.current?.((event.clientX-rect.left)/rect.width,(event.clientY-rect.top)/rect.height)
   }else if(interactive){
    const chosenHue=hue>=0?hue:rand(12,345)
    launch(event.clientX/width,Math.max(.16,event.clientY/height-rand(.04,.16)),chosenHue,'sky')
   }
  }
  const onResize=()=>resize()
  resize();canvas.addEventListener('pointerdown',onPointer);window.addEventListener('resize',onResize)
  const draw=(time:number)=>{
   raf=requestAnimationFrame(draw)
   if(time-last<24)return
   const dt=Math.min(34,time-last||16)/16.67;last=time
   ctx.clearRect(0,0,width,height);frame.current++
   if(ambient&&frame.current%(mobile?175:105)===0)launch(rand(.12,.9),rand(.16,.46),rand(12,345),'sky')
   rockets.current=rockets.current.filter(r=>{
    const dx=r.tx-r.x,dy=r.ty-r.y,dist=Math.hypot(dx,dy)||1
    const step=Math.min(r.speed*dt,dist)
    r.x+=dx/dist*step;r.y+=dy/dist*step
    ctx.beginPath();ctx.strokeStyle='hsla('+r.hue+',100%,75%,.8)';ctx.lineWidth=2
    ctx.moveTo(r.x,r.y+13);ctx.lineTo(r.x,r.y);ctx.stroke()
    if(dist<r.speed*dt+1){burst(r.tx,r.ty,r.hue,r.kind,r.style);return false}
    return true
   })
   particles.current=particles.current.filter(p=>p.life>0)
   for(const p of particles.current){
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.gravity*dt;p.vx*=Math.pow(p.drag,dt);p.vy*=Math.pow(p.drag,dt);p.life-=dt
    const alpha=Math.max(0,p.life/p.maxLife)
    const flicker=.75+Math.sin(time*.025+p.twinkle)*.25
    ctx.beginPath();ctx.fillStyle='hsla('+p.hue+',100%,'+(62+alpha*26)+'%,'+(alpha*flicker)+')'
    ctx.shadowBlur=mobile?5:9;ctx.shadowColor='hsla('+p.hue+',100%,65%,.65)'
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill()
   }
   ctx.shadowBlur=0
  }
  raf=requestAnimationFrame(draw)
  return()=>{cancelAnimationFrame(raf);canvas.removeEventListener('pointerdown',onPointer);window.removeEventListener('resize',onResize)}
 },[active,interactive,ambient,launchRequest?.id,placementMode,pattern,hue])
 return <canvas ref={canvasRef} className={'fireworks-canvas '+(placementMode?'fireworks-placement':'')} aria-label={placementMode?'Tap the terrace to place a firework battery':undefined}/>
}
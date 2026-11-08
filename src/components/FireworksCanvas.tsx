import { useEffect, useRef } from 'react'
import { soundEngine } from '../lib/soundEngine'

export type CrackKind='sky'|'volley'|'battery'|'fountain'|'anar'|'chakri'|'phooljhadi'|'ladi'
export type LaunchCommand={id:number;kind:CrackKind;hue?:number;x?:number;y?:number}
type BurstKind=CrackKind
type Particle={x:number;y:number;vx:number;vy:number;life:number;maxLife:number;hue:number;size:number;gravity:number;drag:number;twinkle:number}
type Rocket={x:number;y:number;tx:number;ty:number;hue:number;speed:number;kind:BurstKind;style:'bloom'|'willow'|'comet'}
type PendingAction={at:number;x:number;y:number;hue:number;kind:BurstKind;mode:'rocket'|'burst'}
const rand=(min:number,max:number)=>Math.random()*(max-min)+min

export default function FireworksCanvas({active=true,interactive=true,ambient=false,launchRequest,placementMode=false,pattern='bloom',hue=-1,onPlace}:{active?:boolean;interactive?:boolean;ambient?:boolean;launchRequest?:LaunchCommand|null;placementMode?:boolean;pattern?:'bloom'|'willow'|'comet';hue?:number;onPlace?:(x:number,y:number)=>void}) {
 const canvasRef=useRef<HTMLCanvasElement>(null)
 const particles=useRef<Particle[]>([])
 const rockets=useRef<Rocket[]>([])
 const pending=useRef<PendingAction[]>([])
 const frame=useRef(0)
 const onPlaceRef=useRef(onPlace)
 const config=useRef({hue,pattern,placementMode})
 const lastCommand=useRef<number|null>(null)
 onPlaceRef.current=onPlace
 config.current={hue,pattern,placementMode}

 useEffect(()=>{
  if(!launchRequest||lastCommand.current===launchRequest.id)return
  lastCommand.current=launchRequest.id
  const x=launchRequest.x??.53,y=launchRequest.y??.43,hue=launchRequest.hue??rand(22,345),now=performance.now()
  const add=(delay:number,xx:number,yy:number,kind:BurstKind,mode:'rocket'|'burst'='rocket')=>pending.current.push({at:now+delay,x:xx,y:yy,hue:hue+rand(-18,18),kind,mode})
  if(launchRequest.kind==='volley'){
   for(let i=0;i<5;i++)add(i*145,Math.min(.91,Math.max(.09,x+(i-2)*.105)),Math.max(.16,y+rand(-.09,.09)),'sky')
  }else if(launchRequest.kind==='battery'){
   add(0,x,y,'battery');add(210,Math.min(.92,x+.06),Math.max(.18,y+.06),'battery');add(420,Math.max(.08,x-.06),Math.max(.16,y-.035),'battery')
  }else if(launchRequest.kind==='ladi'){
   soundEngine.play('ladi')
   for(let i=0;i<18;i++)add(i*78,Math.min(.96,Math.max(.04,x+(i-8.5)*.052)),Math.min(.84,Math.max(.63,y+rand(-.045,.045))),'ladi','burst')
  }else if(['anar','chakri','phooljhadi','fountain'].includes(launchRequest.kind)){
   add(0,x,Math.max(.68,y),launchRequest.kind,'burst')
  }else add(0,x,y,launchRequest.kind)
 },[launchRequest?.id])

 useEffect(()=>{
  const canvas=canvasRef.current
  if(!canvas||!active)return
  const ctx=canvas.getContext('2d',{alpha:true})
  if(!ctx)return
  const mobile=window.matchMedia('(max-width: 760px)').matches
  const maxParticles=mobile?780:2200
  let width=0,height=0,raf=0,last=0
  const resize=()=>{
   const dpr=Math.min(window.devicePixelRatio||1,mobile?1.15:1.45)
   width=window.innerWidth;height=window.innerHeight
   canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr)
   canvas.style.width=width+'px';canvas.style.height=height+'px'
   ctx.setTransform(dpr,0,0,dpr,0,0)
  }
  const burst=(x:number,y:number,burstHue:number,kind:BurstKind,style:'bloom'|'willow'|'comet')=>{
   const shape=kind==='fountain'||kind==='anar'||kind==='phooljhadi'?'fountain':kind==='chakri'?'chakri':kind==='ladi'?'pop':style==='willow'||kind==='battery'?'willow':style==='comet'?'comet':'bloom'
   const count=kind==='ladi'?26:kind==='chakri'?88:kind==='anar'||kind==='fountain'?96:kind==='phooljhadi'?52:kind==='volley'?105:kind==='battery'?86:(mobile?76:126)
   for(let i=0;i<count&&particles.current.length<maxParticles;i++){
    const angle=shape==='fountain'?rand(-Math.PI*.94,-Math.PI*.06):shape==='pop'?rand(0,Math.PI*2):Math.PI*2*i/count+rand(-.055,.055)
    const speed=shape==='fountain'?rand(kind==='phooljhadi'?1.1:1.7,kind==='phooljhadi'?3.2:4.8):shape==='chakri'?rand(1.1,2.8):shape==='pop'?rand(.7,2.2):shape==='willow'?rand(.7,2.5):shape==='comet'?rand(2.3,5.9):rand(1.5,4.9)
    let vx=Math.cos(angle)*speed,vy=Math.sin(angle)*speed
    if(shape==='chakri'){vx+=-Math.sin(angle)*1.45;vy+=Math.cos(angle)*1.45}
    const life=kind==='phooljhadi'?rand(22,49):kind==='ladi'?rand(18,38):shape==='willow'?rand(76,132):rand(47,100)
    particles.current.push({x,y,vx,vy,life,maxLife:life,hue:burstHue+rand(-25,25),size:kind==='ladi'?rand(.9,1.7):rand(1.25,2.9),gravity:shape==='fountain'?.072:shape==='willow'?.062:.038,drag:shape==='willow'?.992:.988,twinkle:Math.random()*6})
   }
  }
  const launch=(xRatio:number,yRatio:number,launchHue:number,kind:BurstKind)=>{
   const style=config.current.pattern
   rockets.current.push({x:Math.max(12,Math.min(width-12,width*xRatio)),y:height*1.02,tx:width*xRatio,ty:height*yRatio,hue:launchHue,speed:rand(8.1,11.4),kind,style})
   soundEngine.play('rocket')
  }
  const onPointer=(event:PointerEvent)=>{
   const rect=canvas.getBoundingClientRect()
   const x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height
   if(config.current.placementMode){onPlaceRef.current?.(x,y);return}
   if(interactive){
    const selected=config.current.hue>=0?config.current.hue:rand(12,345)
    pending.current.push({at:performance.now(),x,y:Math.max(.16,y-rand(.035,.12)),hue:selected,kind:'sky',mode:'rocket'})
   }
  }
  const onResize=()=>resize()
  resize()
  canvas.addEventListener('pointerdown',onPointer)
  window.addEventListener('resize',onResize)
  let visible=!document.hidden
  const onVisibility=()=>{visible=!document.hidden}
  document.addEventListener('visibilitychange',onVisibility)
  const draw=(time:number)=>{
   raf=requestAnimationFrame(draw)
   if(!visible)return
   if(time-last<22)return
   const dt=Math.min(36,time-last||16)/16.67
   last=time
   ctx.clearRect(0,0,width,height)
   frame.current++
   if(ambient&&frame.current%(mobile?470:360)===0){
    pending.current.push({at:time,x:rand(.11,.9),y:rand(.17,.43),hue:rand(18,345),kind:'sky',mode:'rocket'})
   }
   const due=pending.current.filter(a=>a.at<=time)
   if(due.length)pending.current=pending.current.filter(a=>a.at>time)
   for(const action of due){
    if(action.mode==='burst'){
     burst(action.x*width,action.y*height,action.hue,action.kind,config.current.pattern)
     if(action.kind==='anar'||action.kind==='fountain'||action.kind==='chakri'||action.kind==='phooljhadi')soundEngine.play(action.kind==='fountain'?'anar':action.kind)
    }else launch(action.x,action.y,action.hue,action.kind)
   }
   rockets.current=rockets.current.filter(r=>{
    const dx=r.tx-r.x,dy=r.ty-r.y,dist=Math.hypot(dx,dy)||1
    const step=Math.min(r.speed*dt,dist)
    r.x+=dx/dist*step;r.y+=dy/dist*step
    const tail=ctx.createLinearGradient(r.x,r.y+18,r.x,r.y)
    tail.addColorStop(0,'hsla('+r.hue+',100%,65%,0)')
    tail.addColorStop(1,'hsla('+r.hue+',100%,82%,.9)')
    ctx.beginPath();ctx.strokeStyle=tail;ctx.lineWidth=2.4;ctx.moveTo(r.x,r.y+18);ctx.lineTo(r.x,r.y);ctx.stroke()
    if(dist<r.speed*dt+1){
     burst(r.tx,r.ty,r.hue,r.kind,r.style)
     if(r.kind==='ladi')soundEngine.play('ladi')
     else soundEngine.play(r.kind==='anar'||r.kind==='fountain'?'anar':r.kind==='chakri'?'chakri':r.kind==='phooljhadi'?'phooljhadi':'burst')
     return false
    }
    return true
   })
   particles.current=particles.current.filter(p=>p.life>0)
   for(const p of particles.current){
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.gravity*dt;p.vx*=Math.pow(p.drag,dt);p.vy*=Math.pow(p.drag,dt);p.life-=dt
    const alpha=Math.max(0,p.life/p.maxLife)
    const flicker=.73+Math.sin(time*.03+p.twinkle)*.27
    ctx.beginPath()
    ctx.fillStyle='hsla('+p.hue+',100%,'+(65+alpha*23)+'%,'+(alpha*flicker)+')'
    ctx.shadowBlur=mobile?5.5:10;ctx.shadowColor='hsla('+p.hue+',100%,68%,.72)'
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill()
   }
   ctx.shadowBlur=0
  }
  raf=requestAnimationFrame(draw)
  return()=>{
   cancelAnimationFrame(raf)
   canvas.removeEventListener('pointerdown',onPointer)
   window.removeEventListener('resize',onResize)
   document.removeEventListener('visibilitychange',onVisibility)
   rockets.current=[];particles.current=[];pending.current=[]
  }
 },[active,interactive,ambient])
 return <canvas ref={canvasRef} className={'fireworks-canvas '+(placementMode?'fireworks-placement':'')} aria-label={placementMode?'Tap the terrace to place a firework battery':undefined}/>
}
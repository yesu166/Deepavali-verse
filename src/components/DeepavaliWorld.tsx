import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Flower2, Flame, Gift, Heart, Maximize2, Rocket, Sparkles, Volume2, VolumeX, PartyPopper, Target } from 'lucide-react'
import type { SceneId } from '../store/useVerseStore'
import { useVerseStore } from '../store/useVerseStore'
import { ART } from '../assets'
import FireworksCanvas, { type LaunchCommand } from './FireworksCanvas'
import TerraceDepth from './TerraceDepth'

const destinations:{id:SceneId;title:string;subtitle:string;icon:typeof Flame;className:string;symbol:string}[]=[
 {id:'diya',title:'Diya Courtyard',subtitle:'Light the lamps',icon:Flame,className:'portal-diya',symbol:'✦'},
 {id:'rangoli',title:'Rangoli Atelier',subtitle:'Design your rangoli',icon:Flower2,className:'portal-rangoli',symbol:'✿'},
 {id:'fireworks',title:'Fireworks Terrace',subtitle:'Shoot sky shots',icon:PartyPopper,className:'portal-fireworks',symbol:'✧'},
 {id:'bazaar',title:'Sweet Bazaar',subtitle:'Play & collect',icon:Gift,className:'portal-bazaar',symbol:'❀'},
 {id:'lanterns',title:'Lantern Ghat',subtitle:'Release a wish',icon:Heart,className:'portal-lanterns',symbol:'♡'},
 {id:'greetings',title:'Greeting Pavilion',subtitle:'Create & share',icon:ArrowUpRight,className:'portal-greetings',symbol:'❋'},
]
type Pad={id:number;x:number;y:number}

export default function DeepavaliWorld(){
 const setScene=useVerseStore(s=>s.setScene)
 const litDiyas=useVerseStore(s=>s.litDiyas)
 const soundEnabled=useVerseStore(s=>s.soundEnabled)
 const toggleSound=useVerseStore(s=>s.toggleSound)
 const [launchRequest,setLaunchRequest]=useState<LaunchCommand|null>(null)
 const [placing,setPlacing]=useState(false)
 const [pads,setPads]=useState<Pad[]>([])
 const [showTools,setShowTools]=useState(true)
 const [hue,setHue]=useState(42)
 const fire=(kind:LaunchCommand['kind'],x=.53,y=.43)=>{
  setLaunchRequest(old=>({id:(old?.id??0)+1,kind,x,y,hue}))
  setPlacing(false)
 }
 const place=(x:number,y:number)=>{
  const pad={id:Date.now(),x,y}
  setPads(old=>[...old.slice(-5),pad])
  setPlacing(false)
 }
 const fullscreen=()=>{if(!document.fullscreenElement)void document.documentElement.requestFullscreen?.();else void document.exitFullscreen?.()}
 const complete=Math.min(6,[litDiyas.length>=14, pads.length>=1, false, false, false, false].filter(Boolean).length)
 return <main className="world-shell terrace-world">
  <div className="world-art" aria-hidden="true">
   <img className="courtyard-backdrop terrace-backdrop" src={ART.terrace} alt="" fetchPriority="high"/>
   <div className="world-image-grade terrace-grade"/>
   <div className="foreground-vignette"/>
  </div>
  <TerraceDepth/>
  <FireworksCanvas active ambient interactive={false} placementMode={placing} onPlace={place} launchRequest={launchRequest}/>
  <header className="world-topbar terrace-topbar">
   <button className="brand-lockup" onClick={()=>setScene('courtyard')} aria-label="Deepavali Verse home"><span className="brand-mark"><Flame size={20}/></span><span>DEEPAVALI <b>VERSE</b></span></button>
   <nav className="world-navigation" aria-label="Main navigation">
    <button className="nav-active" onClick={()=>setScene('courtyard')}>Explore</button>
    <button onClick={()=>setScene('greetings')}>Create</button>
    <button onClick={()=>setScene('bazaar')}>Play</button>
    <button onClick={()=>setScene('fireworks')}>Celebrate</button>
   </nav>
   <div className="topbar-right"><button className="icon-button" onClick={toggleSound} aria-label={soundEnabled?'Mute sound':'Sound off'}>{soundEnabled?<Volume2 size={17}/>:<VolumeX size={17}/>}</button><button className="icon-button" onClick={fullscreen} aria-label="Toggle fullscreen"><Maximize2 size={16}/></button></div>
  </header>

  <section className="terrace-hero-copy">
   <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="terrace-brand-seal"><span>✺</span> A FESTIVAL OF LIGHTS <span>✺</span></motion.div>
   <motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.1,duration:.7}}>A terrace full of <em>wonder.</em></motion.h1>
   <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.35}}>Light a lamp. Paint the sky. Send a wish into the night.</motion.p>
  </section>

  <aside className={'sky-shot-console '+(placing?'console-placement':'')}>
   <div className="console-heading"><span className="console-icon"><Rocket size={16}/></span><div><b>Terrace Fireworks</b><small>{placing?'Tap an open spot to place a battery':'The sky is yours to paint'}</small></div><button onClick={()=>setShowTools(v=>!v)} aria-label="Toggle fireworks controls">{showTools?'−':'+'}</button></div>
   {showTools&&<div className="console-actions">
    <button onClick={()=>fire('sky')}><Rocket size={16}/><span><b>Sky shot</b><small>One brilliant burst</small></span></button>
    <button onClick={()=>fire('volley')}><Sparkles size={16}/><span><b>Multi volley</b><small>Five-shot sequence</small></span></button>
    <button onClick={()=>setPlacing(v=>!v)} className={placing?'is-placing':''}><Target size={16}/><span><b>{placing?'Cancel placement':'Place battery'}</b><small>Choose a launch point</small></span></button>
    <label className="console-colour"><span>BURST COLOUR</span><div>{[25,42,130,175,210,280,325].map(v=><button key={v} className={hue===v?'chosen':''} onClick={()=>setHue(v)} style={{background:'hsl('+v+',90%,62%)'}} aria-label={'Choose firework colour '+v}/>)}</div></label>
   </div>}
   {pads.length>0&&<div className="placed-pads-list"><span>{pads.length} BATTERIES PLACED</span><button onClick={()=>setPads([])}>Clear</button></div>}
  </aside>
  {pads.map((pad,i)=><button key={pad.id} className="placed-firework-pad" style={{left:pad.x*100+'%',top:pad.y*100+'%'}} onClick={()=>fire('battery',pad.x,.36)} aria-label={'Fire battery '+(i+1)}><span>✦</span><small>FIRE</small></button>)}

  <div className="terrace-floor-markers" aria-hidden="true"><span className="floor-diya diya-left">🪔</span><span className="floor-diya diya-right">🪔</span></div>

  <section className="portal-dock" aria-label="Explore the festival">
   <div className="portal-dock-heading"><span>STEP INTO THE FESTIVAL</span><small>CHOOSE YOUR NEXT MOMENT</small></div>
   <div className="portal-grid">
    {destinations.map((item,index)=>{const Icon=item.icon;return <motion.button key={item.id} className={'portal-card '+item.className} onClick={()=>setScene(item.id)} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.15+index*.065,duration:.45}}>
      <span className="portal-card-top">{item.symbol}</span>
      <span className="portal-card-icon"><Icon size={34} strokeWidth={1.45}/></span>
      <b>{item.title}</b><small>{item.subtitle}</small>
      <span className="portal-card-enter"><ArrowUpRight size={15}/></span>
    </motion.button>})}
   </div>
  </section>

  {placing&&<div className="placement-hint"><Target size={16}/> Tap anywhere on the open terrace to place your firework battery <button onClick={()=>setPlacing(false)}>Cancel</button></div>}
  <footer className="world-footer terrace-footer"><span>DEEPAVALI · A TIME TO SHINE</span><div><span>YOUR FESTIVAL TRAIL</span><b>{String(complete).padStart(2,'0')} / 06</b><i><em style={{width:(complete/6*100)+'%'}}/></i></div><span>MAKE THE NIGHT YOURS ✦</span></footer>
 </main>
}
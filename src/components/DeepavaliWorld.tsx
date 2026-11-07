import { motion } from 'framer-motion'
import { ArrowUpRight, Flower2, Flame, Gift, Heart, Maximize2, Sparkles } from 'lucide-react'
import { useVerseStore, type SceneId } from '../store/useVerseStore'
import { ART } from '../assets'
import FireworksCanvas from './FireworksCanvas'

const destinations: {id:SceneId; title:string; subtitle:string; icon: typeof Flame; className:string; x:string; y:string}[] = [
  {id:'diya',title:'Diya Courtyard',subtitle:'Light the lamps',icon:Flame,className:'hotspot-diya',x:'25%',y:'54%'},
  {id:'rangoli',title:'Rangoli Atelier',subtitle:'Create something beautiful',icon:Flower2,className:'hotspot-rangoli',x:'50%',y:'75%'},
  {id:'fireworks',title:'Fireworks Terrace',subtitle:'Paint the night sky',icon:Sparkles,className:'hotspot-fireworks',x:'37%',y:'19%'},
  {id:'bazaar',title:'Sweet Bazaar',subtitle:'Play & collect',icon:Gift,className:'hotspot-bazaar',x:'11%',y:'65%'},
  {id:'lanterns',title:'Lantern Ghat',subtitle:'Send a wish skyward',icon:Heart,className:'hotspot-lanterns',x:'84%',y:'53%'},
  {id:'greetings',title:'Greeting Pavilion',subtitle:'Make it personal',icon:ArrowUpRight,className:'hotspot-greetings',x:'83%',y:'72%'},
]
function Diya({id,index,onLight,lit}:{id:number;index:number;onLight:(id:number)=>void;lit:boolean}) {
  return <button className={`mini-diya ${lit?'is-lit':''}`} style={{left:`${12+(index%7)*12.5}%`,top:`${88+Math.floor(index/7)*4}%`}} onClick={()=>onLight(id)} aria-label={lit?'Diya already lit':'Light diya'}>
    <span className="diya-flame"/><span className="diya-bowl"/>
  </button>
}
export default function DeepavaliWorld() {
  const setScene = useVerseStore(s=>s.setScene)
  const litDiyas = useVerseStore(s=>s.litDiyas)
  const lightDiya = useVerseStore(s=>s.lightDiya)
  const enterFullscreen = () => { if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.(); else void document.exitFullscreen?.() }
  return <main className="world-shell" onPointerMove={event=>{if(event.pointerType==='touch')return;const x=(event.clientX/window.innerWidth-.5)*-9;const y=(event.clientY/window.innerHeight-.5)*-6;event.currentTarget.style.setProperty('--parallax-x',x+'px');event.currentTarget.style.setProperty('--parallax-y',y+'px')}} onPointerLeave={event=>{event.currentTarget.style.setProperty('--parallax-x','0px');event.currentTarget.style.setProperty('--parallax-y','0px')}}>
    <div className="world-art" aria-hidden="true">
      <img className="courtyard-backdrop" src={ART.courtyard} alt="" fetchPriority="high" />
      <div className="world-image-grade"/>
      <div className="world-atmosphere"/>
      {Array.from({length:18},(_,i)=><span key={i} className="star-dust" style={{left:`${(i*37)%97}%`,top:`${(i*19)%51}%`,animationDelay:`${i*.37}s`}}/>)}
      <div className="foreground-vignette"/>
    </div>
    <FireworksCanvas active interactive={false} />
    <header className="world-topbar">
      <button className="brand-lockup" onClick={()=>setScene('courtyard')} aria-label="Return to courtyard"><span className="brand-mark"><Flame size={19}/></span><span>DEEPAVALI <b>VERSE</b></span></button>
      <nav className="world-navigation" aria-label="Main navigation">
        <button className="nav-active" onClick={()=>setScene('courtyard')}>Explore</button>
        <button onClick={()=>setScene('greetings')}>Create</button>
        <button onClick={()=>setScene('bazaar')}>Play</button>
      </nav>
      <div className="topbar-right"><span className="festival-status"><i/> THE NIGHT IS YOURS</span><button className="icon-button" onClick={enterFullscreen} aria-label="Toggle fullscreen"><Maximize2 size={16}/></button></div>
    </header>
    <div className="world-copy">
      <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.2}} className="eyebrow"><span/> A FESTIVAL OF LIGHT <span/></motion.p>
      <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.3}}>A night woven<br/><em>with wonder.</em></motion.h1>
      <motion.p className="world-description" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.55}}>Follow the lamps through a palace of colour, craft and celebration.</motion.p>
      <button className="world-primary-cta" onClick={()=>setScene('diya')}><span>Find the first flame</span><ArrowUpRight size={15}/></button>
    </div>
    <div className="discovery-note"><span className="discovery-orbit"/><span>Choose a glowing marker to explore</span></div>
    <div className="hotspot-layer">
      {destinations.map((item,i)=>{const Icon=item.icon;return <motion.button key={item.id} className={`world-hotspot ${item.className}`} style={{left:item.x,top:item.y}} onClick={()=>setScene(item.id)} initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.55+i*.08,type:'spring',stiffness:150,damping:18}}>
        <span className="hotspot-pulse"/><span className="hotspot-icon"><Icon size={17}/></span><span className="hotspot-label"><b>{item.title}</b><small>{item.subtitle}</small></span>
      </motion.button>})}
      {Array.from({length:14},(_,i)=><Diya key={i} id={i} index={i} onLight={lightDiya} lit={litDiyas.includes(i)}/>)}
    </div>
    <aside className="journey-card">
      <div><span>YOUR FESTIVAL TRAIL</span><b>{String(Math.min(litDiyas.length,14)).padStart(2,'0')} <small>/ 14</small></b></div>
      <div className="journey-track"><i style={{width:`${Math.min(100,litDiyas.length/14*100)}%`}}/></div>
      <small>Light a diya to leave your mark.</small>
    </aside>
    <footer className="world-footer"><span>DEEPAVALI · A TIME TO SHINE</span><span>SCROLL LESS. DISCOVER MORE. ✦</span></footer>
  </main>
}
import { motion } from 'framer-motion'
import { ArrowUpRight, Flower2, Flame, Gift, Heart, Music2, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { useVerseStore, type SceneId } from '../store/useVerseStore'
import FireworksCanvas from './FireworksCanvas'

const destinations: {id:SceneId; title:string; subtitle:string; icon: typeof Flame; className:string; x:string; y:string}[] = [
  {id:'rangoli',title:'Rangoli Atelier',subtitle:'Make something beautiful',icon:Flower2,className:'hotspot-rangoli',x:'51%',y:'71%'},
  {id:'fireworks',title:'The Terrace',subtitle:'Paint the night sky',icon:Sparkles,className:'hotspot-fireworks',x:'50%',y:'14%'},
  {id:'bazaar',title:'Sweet Bazaar',subtitle:'A little festival game',icon:Gift,className:'hotspot-bazaar',x:'12%',y:'59%'},
  {id:'lanterns',title:'Lantern Ghat',subtitle:'Send a wish into the night',icon:Heart,className:'hotspot-lanterns',x:'85%',y:'58%'},
  {id:'greetings',title:'Greeting Pavilion',subtitle:'Make a greeting to share',icon:ArrowUpRight,className:'hotspot-greetings',x:'80%',y:'78%'},
]
function Diya({id,index,onLight,lit}:{id:number;index:number;onLight:(id:number)=>void;lit:boolean}) {
  return <button className={`mini-diya ${lit?'is-lit':''}`} style={{left:`${12+(index%7)*12.5}%`,top:`${69+Math.floor(index/7)*8}%`}} onClick={()=>onLight(id)} aria-label={lit?'Diya already lit':'Light diya'}>
    <span className="diya-flame"/><span className="diya-bowl"/>
  </button>
}
export default function DeepavaliWorld() {
  const setScene = useVerseStore(s=>s.setScene)
  const litDiyas = useVerseStore(s=>s.litDiyas)
  const lightDiya = useVerseStore(s=>s.lightDiya)
  const soundEnabled = useVerseStore(s=>s.soundEnabled)
  const toggleSound = useVerseStore(s=>s.toggleSound)
  return <main className="world-shell">
    <div className="world-art" aria-hidden="true">
      <div className="sky-stars"/><div className="distant-city"/>
      <div className="palace palace-left"/><div className="palace palace-right"/>
      <div className="palace palace-back"><div className="palace-roof"/><div className="arch-row">{Array.from({length:9},(_,i)=><span key={i} className="arch"><i/></span>)}</div><div className="lower-arches">{Array.from({length:13},(_,i)=><span key={i}/>)}</div></div>
      <div className="courtyard-floor"/><div className="floor-reflection"/>
      <div className="rangoli-art"><div className="rangoli-ring ring-one"/><div className="rangoli-ring ring-two"/><div className="rangoli-petals">{Array.from({length:12},(_,i)=><i key={i} style={{transform:`rotate(${i*30}deg) translateY(-37%)`}}/>)}</div><div className="rangoli-centre"/></div>
      <div className="marigold-garland garland-left"/><div className="marigold-garland garland-right"/>
      <div className="ambient-glow glow-center"/>
      <div className="foreground-diya"><span className="big-flame"/><span className="big-bowl"/></div>
      {Array.from({length:18},(_,i)=><span key={i} className="star-dust" style={{left:`${(i*37)%97}%`,top:`${(i*19)%51}%`,animationDelay:`${i*.37}s`}}/>)}
    </div>
    <FireworksCanvas active />
    <header className="world-topbar">
      <button className="brand-lockup" onClick={()=>setScene('courtyard')} aria-label="Return to courtyard"><span className="brand-mark"><Flame size={19}/></span><span>DEEPAVALI <b>VERSE</b></span></button>
      <div className="topbar-right"><span className="festival-status"><i/> THE NIGHT IS ALIVE</span><button className="icon-button" onClick={toggleSound} aria-label={soundEnabled?'Mute sound':'Enable sound'}>{soundEnabled?<Volume2 size={17}/>:<VolumeX size={17}/>}</button></div>
    </header>
    <div className="world-copy">
      <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.2}} className="eyebrow"><span/> A FESTIVAL OF A THOUSAND LIGHTS <span/></motion.p>
      <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.3}}>Let the light<br/><em>find its way.</em></motion.h1>
      <motion.p className="world-description" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.55}}>An evening of colour, craft and little moments worth keeping.</motion.p>
      <div className="world-progress"><span>{litDiyas.length.toString().padStart(2,'0')}</span><div><i style={{width:`${Math.min(100,litDiyas.length*10)}%`}}/></div><small>DIYAS LIT</small></div>
    </div>
    <div className="discovery-note"><span className="discovery-orbit"/><span>Wander a little. There's more here.</span></div>
    <div className="hotspot-layer">
      {destinations.map((item,i)=>{const Icon=item.icon;return <motion.button key={item.id} className={`world-hotspot ${item.className}`} style={{left:item.x,top:item.y}} onClick={()=>setScene(item.id)} initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.65+i*.09,type:'spring',stiffness:150,damping:18}}>
        <span className="hotspot-pulse"/><span className="hotspot-icon"><Icon size={17}/></span><span className="hotspot-label"><b>{item.title}</b><small>{item.subtitle}</small></span>
      </motion.button>})}
      {Array.from({length:14},(_,i)=><Diya key={i} id={i} index={i} onLight={lightDiya} lit={litDiyas.includes(i)}/>)}
    </div>
    <footer className="world-footer"><span>MADE OF LIGHT & LITTLE WONDERS</span><span>DEEPAVALI · A TIME TO SHINE</span></footer>
  </main>
}
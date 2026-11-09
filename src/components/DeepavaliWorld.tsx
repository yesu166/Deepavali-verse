import { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Flower2, Flame, Gift, Heart, Maximize2, Rocket, PartyPopper } from 'lucide-react'
import type { SceneId } from '../store/useVerseStore'
import { useVerseStore } from '../store/useVerseStore'
import { ART } from '../assets'
import FireworksCanvas, { type LaunchCommand } from './FireworksCanvas'
import SoundControl from './SoundControl'
import RocketCursor from './RocketCursor'
import CrackerTerrace3D, { type IndianCracker, type PlacedCracker } from './CrackerTerrace3D'
const TerraceDepth = lazy(() => import('./TerraceDepth'))

const destinations:{id:SceneId;title:string;subtitle:string;icon:typeof Flame;className:string;symbol:string}[]=[
 {id:'diya',title:'Diya Courtyard',subtitle:'Light the lamps',icon:Flame,className:'portal-diya',symbol:'✦'},
 {id:'rangoli',title:'Rangoli Atelier',subtitle:'Design your rangoli',icon:Flower2,className:'portal-rangoli',symbol:'✿'},
 {id:'fireworks',title:'Fireworks Terrace',subtitle:'Shoot sky shots',icon:PartyPopper,className:'portal-fireworks',symbol:'✧'},
 {id:'bazaar',title:'Sweet Bazaar',subtitle:'Play & collect',icon:Gift,className:'portal-bazaar',symbol:'❀'},
 {id:'lanterns',title:'Lantern Ghat',subtitle:'Release a wish',icon:Heart,className:'portal-lanterns',symbol:'♡'},
 {id:'greetings',title:'Greeting Pavilion',subtitle:'Create & share',icon:ArrowUpRight,className:'portal-greetings',symbol:'❋'},
]
const crackers:{id:IndianCracker;name:string;detail:string;glyph:string;hue:number}[]=[
 {id:'rocket',name:'Rocket',detail:'Aerial trail',glyph:'↗',hue:42},
 {id:'flower-pot',name:'Flower Pot',detail:'Golden fountain',glyph:'△',hue:42},
 {id:'anar',name:'Anar',detail:'Rising fountain',glyph:'✺',hue:28},
 {id:'chakri',name:'Chakri',detail:'Spinning wheel',glyph:'◎',hue:185},
 {id:'sparkler',name:'Phooljhadi',detail:'Hand sparkler',glyph:'✳',hue:48},
 {id:'ladi',name:'Ladi',detail:'Cracker chain',glyph:'▤',hue:12},
 {id:'bijili',name:'Bijili',detail:'Quick pop',glyph:'▰',hue:135},
 {id:'atom-bomb',name:'Atom Bomb',detail:'Round burst',glyph:'●',hue:165},
 {id:'sutli-bomb',name:'Sutli Bomb',detail:'Deep report',glyph:'◉',hue:28},
 {id:'snake-pill',name:'Snake Tablet',detail:'Coiling trail',glyph:'∿',hue:275},
 {id:'1000-wala',name:'1000 Wala',detail:'Long chain',glyph:'▥',hue:8},
 {id:'multi-shot',name:'Shot Battery',detail:'Multi-shot box',glyph:'▦',hue:215},
]
function CrackerThumb({kind,glyph}:{kind:IndianCracker;glyph:string}) {
 return <span className={'cracker-thumb thumb-'+kind} aria-hidden="true"><i/><b>{glyph}</b></span>
}

export default function DeepavaliWorld(){
 const setScene=useVerseStore(s=>s.setScene)
 const litDiyas=useVerseStore(s=>s.litDiyas)
 const [launchRequest,setLaunchRequest]=useState<LaunchCommand|null>(null)
 const [placing,setPlacing]=useState(false)
 const [pads,setPads]=useState<PlacedCracker[]>([])
 const [showTools,setShowTools]=useState(true)
 const [selectedCracker,setSelectedCracker]=useState<IndianCracker>('flower-pot')
 const [hue,setHue]=useState(42)
 const [pattern,setPattern]=useState<'bloom'|'willow'|'comet'>('bloom')
 const fire=(kind:LaunchCommand['kind'],x=.53,y=.43,chosenHue=hue)=>{
  setLaunchRequest(old=>({id:(old?.id??0)+1,kind,x,y,hue:chosenHue}))
  setPlacing(false)
 }
 const place=(x:number,z:number)=>{
  const item:PlacedCracker={id:Date.now()+Math.floor(Math.random()*1000),kind:selectedCracker,x,z,hue}
  setPads(old=>[...old.slice(-9),item])
  setPlacing(false)
 }
 const ignite=(kind:IndianCracker,x:number,y:number,colour:number)=>fire(kind,x,y,colour)
 const fireSky=(x:number,y:number)=>fire('sky',x,y)
 const fireSelected=()=>{
  const ground=['flower-pot','anar','chakri','sparkler','phooljhadi','ladi','bijili','atom-bomb','sutli-bomb','snake-pill','1000-wala','multi-shot'].includes(selectedCracker)
  fire(selectedCracker,.5,ground?.71:.39)
 }
 const fullscreen=()=>{if(!document.fullscreenElement)void document.documentElement.requestFullscreen?.();else void document.exitFullscreen?.()}
 const complete=Math.min(6,[litDiyas.length>=14,pads.length>=1,false,false,false,false].filter(Boolean).length)
 return <main className="world-shell terrace-world" onClick={e=>{if(window.matchMedia('(max-width:760px)').matches)return;const target=e.target as HTMLElement;if(target.closest('button,a,input,select,textarea,[role=button],.cracker-map3d'))return;fireSky(e.clientX/window.innerWidth,e.clientY/window.innerHeight)}}>
  <div className="world-art" aria-hidden="true">
   <img className="courtyard-backdrop terrace-backdrop" src={ART.terrace} alt="" fetchPriority="high"/>
   <div className="world-image-grade terrace-grade"/>
   <div className="foreground-vignette"/>
  </div>
  <Suspense fallback={null}><TerraceDepth/></Suspense>
  <RocketCursor/>
  <FireworksCanvas active ambient interactive={false} launchRequest={launchRequest} pattern={pattern}/>
  <CrackerTerrace3D placements={pads} selected={selectedCracker} placementMode={placing} onPlace={place} onIgnite={ignite} onSky={fireSky}/>
  <header className="world-topbar terrace-topbar">
   <button className="brand-lockup" onClick={()=>setScene('courtyard')} aria-label="Deepavali Verse home"><span className="brand-mark"><Flame size={20}/></span><span>DEEPAVALI <b>VERSE</b></span></button>
   <nav className="world-navigation" aria-label="Main navigation">
    <button className="nav-active" onClick={()=>setScene('courtyard')}>Explore</button>
    <button onClick={()=>setScene('greetings')}>Create</button>
    <button onClick={()=>setScene('bazaar')}>Play</button>
    <button onClick={()=>setScene('fireworks')}>Celebrate</button>
   </nav>
   <div className="topbar-right"><SoundControl/><button className="icon-button" onClick={fullscreen} aria-label="Toggle fullscreen"><Maximize2 size={16}/></button></div>
  </header>

  <section className="terrace-hero-copy">
   <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="terrace-brand-seal"><span>✺</span> A FESTIVAL OF LIGHTS <span>✺</span></motion.div>
   <motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.1,duration:.7}}>A terrace full of <em>wonder.</em></motion.h1>
   <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.35}}>Light a lamp. Arrange crackers. Paint the night. Send a wish.</motion.p>
  </section>

  <aside className={'sky-shot-console cracker-console '+(placing?'console-placement':'')}>
   <div className="console-heading"><span className="console-icon"><Rocket size={16}/></span><div><b>Terrace Fireworks</b><small>{placing?'Tap the open floor to place your 3D cracker':'Choose a cracker to preview, place and ignite'}</small></div><button onClick={()=>setShowTools(v=>!v)} aria-label="Toggle fireworks controls">{showTools?'−':'+'}</button></div>
   {showTools&&<>
    <div className="cracker-catalogue">
     {crackers.map(item=><button key={item.id} className={'cracker-choice '+(selectedCracker===item.id?'is-selected':'')} onClick={()=>{setSelectedCracker(item.id);setHue(item.hue)}} aria-pressed={selectedCracker===item.id}>
       <CrackerThumb kind={item.id} glyph={item.glyph}/>
       <span><b>{item.name}</b><small>{item.detail}</small></span>
     </button>)}
    </div>
    <div className="console-colour cracker-colour"><span>BURST COLOUR</span><div>{[25,42,130,175,210,280,325].map(v=><button key={v} className={hue===v?'chosen':''} onClick={()=>setHue(v)} style={{background:'hsl('+v+',90%,62%)'}} aria-label={'Choose firework colour '+v}/>)}</div>
     <label className="console-style"><small>BURST SHAPE</small><select value={pattern} onChange={e=>setPattern(e.target.value as 'bloom'|'willow'|'comet')}><option value="bloom">Bloom</option><option value="willow">Willow</option><option value="comet">Comet</option></select></label>
    </div>
    <div className="cracker-actions">
     <button className="cracker-place-action" onClick={()=>setPlacing(v=>!v)}>{placing?'Cancel placement':'Place 3D cracker'}</button>
     <button className="cracker-fire-action" onClick={fireSelected}>Ignite selected</button>
    </div>
    <div className="cracker-model-hint"><span className="live-dot"/> Live 3D model preview · click a placed model to ignite it</div>
   </>}
   {pads.length>0&&<div className="placed-pads-list"><span>{pads.length} CRACKERS ON TERRACE</span><button onClick={()=>setPads([])}>Clear all</button></div>}
  </aside>

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

  {placing&&<div className="placement-hint"><Target size={16}/> Choose a spot on the floor to place your {crackers.find(c=>c.id===selectedCracker)?.name} <button onClick={()=>setPlacing(false)}>Cancel</button></div>}
  <footer className="world-footer terrace-footer"><span>DEEPAVALI · A TIME TO SHINE</span><div><span>YOUR FESTIVAL TRAIL</span><b>{String(complete).padStart(2,'0')} / 06</b><i><em style={{width:(complete/6*100)+'%'}}/></i></div><span>MAKE THE NIGHT YOURS ✦</span></footer>
 </main>
}

import { useState } from 'react'
import { AudioLines, Volume2, VolumeX, Waves, Rocket, Sparkles, Flame, CircleDot, Bell, Zap } from 'lucide-react'
import { soundEngine, type FestivalSound } from '../lib/soundEngine'
import { useVerseStore } from '../store/useVerseStore'

const samples: {label:string;kind:FestivalSound;icon:typeof Rocket}[]=[
 {label:'Rocket',kind:'rocket',icon:Rocket},
 {label:'Anar',kind:'anar',icon:Flame},
 {label:'Chakri',kind:'chakri',icon:CircleDot},
 {label:'Phooljhadi',kind:'phooljhadi',icon:Sparkles},
 {label:'Ladi',kind:'ladi',icon:Zap},
 {label:'Aerial burst',kind:'burst',icon:Bell},
]
export default function SoundControl() {
 const enabled=useVerseStore(s=>s.soundEnabled)
 const setEnabled=useVerseStore(s=>s.setSoundEnabled)
 const [open,setOpen]=useState(false)
 const [volume,setVolume]=useState(72)
 const [ambience,setAmbience]=useState(20)
 const toggle=()=>{
  const next=!enabled
  if(next)void soundEngine.enable()
  else soundEngine.disable()
  setEnabled(next)
 }
 const audition=(kind:FestivalSound)=>{
  if(!enabled){void soundEngine.enable();setEnabled(true);window.setTimeout(()=>soundEngine.play(kind),90)}
  else soundEngine.play(kind)
 }
 return <div className="sound-control">
  <button className={'sound-toggle '+(enabled?'sound-enabled':'')} onClick={toggle} aria-label={enabled?'Turn festival sound off':'Enable festival sound'} aria-pressed={enabled} title={enabled?'Sound on':'Sound off'}>
   {enabled?<Volume2 size={16}/>:<VolumeX size={16}/>}<span>{enabled?'SOUND ON':'SOUND OFF'}</span>
  </button>
  <button className={'sound-more '+(open?'is-open':'')} onClick={()=>setOpen(v=>!v)} aria-label="Open sound mixer" aria-expanded={open}><AudioLines size={15}/></button>
  {open&&<div className="sound-mixer">
   <div className="sound-mixer-heading"><div><b>Festival sound</b><small>{enabled?'A little life in every corner':'Tap sound on to hear the scene'}</small></div><button onClick={()=>setOpen(false)} aria-label="Close sound mixer">×</button></div>
   <label className="mixer-range"><span><Volume2 size={13}/> MASTER</span><input type="range" min="0" max="100" value={volume} onChange={e=>{const v=Number(e.target.value);setVolume(v);soundEngine.setVolume(v/100)}}/><b>{volume}%</b></label>
   <label className="mixer-range"><span><Waves size={13}/> AMBIENCE</span><input type="range" min="0" max="60" value={ambience} onChange={e=>{const v=Number(e.target.value);setAmbience(v);soundEngine.setAmbienceVolume(v/100)}}/><b>{ambience}%</b></label>
   <div className="mixer-samples-title">TRY THE FIREWORKS</div>
   <div className="mixer-samples">{samples.map(({label,kind,icon:Icon})=><button key={kind} onClick={()=>audition(kind)}><Icon size={14}/>{label}</button>)}</div>
   <p>Original synthesized effects · Sound starts only after your tap.</p>
  </div>}
 </div>
}
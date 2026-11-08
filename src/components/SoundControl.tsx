import { useState } from 'react'
import { AudioLines, Volume2, Waves, Rocket, Sparkles, Flame, CircleDot, Bell, Zap } from 'lucide-react'
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
 const unlock=()=>{
  if(enabled){setOpen(v=>!v);return}
  void soundEngine.enable().then(()=>setEnabled(true)).catch(()=>setEnabled(false))
 }
 const audition=(kind:FestivalSound)=>{
  void soundEngine.enable().then(()=>{setEnabled(true);soundEngine.play(kind)}).catch(()=>setEnabled(false))
 }
 return <div className="sound-control">
  <button className={'sound-toggle sound-enabled '+(!enabled?'sound-awaiting':'')} onClick={unlock} aria-label={enabled?'Festival sound is on. Open sound mixer':'Tap to start festival sound'} aria-pressed={enabled} title={enabled?'Festival sound on':'Tap once to start festival sound'}>
   <Volume2 size={16}/><span>{enabled?'SOUND ON':'TAP FOR SOUND'}</span>
  </button>
  <button className={'sound-more '+(open?'is-open':'')} onClick={()=>setOpen(v=>!v)} aria-label="Open sound mixer" aria-expanded={open}><AudioLines size={15}/></button>
  {open&&<div className="sound-mixer">
   <div className="sound-mixer-heading"><div><b>Festival sound</b><small>{enabled?'The celebration is playing':'One tap starts the celebration'}</small></div><button onClick={()=>setOpen(false)} aria-label="Close sound mixer">×</button></div>
   <label className="mixer-range"><span><Volume2 size={13}/> MASTER</span><input type="range" min="20" max="100" value={volume} onChange={e=>{const v=Number(e.target.value);setVolume(v);soundEngine.setVolume(v/100)}}/><b>{volume}%</b></label>
   <label className="mixer-range"><span><Waves size={13}/> AMBIENCE</span><input type="range" min="5" max="60" value={ambience} onChange={e=>{const v=Number(e.target.value);setAmbience(v);soundEngine.setAmbienceVolume(v/100)}}/><b>{ambience}%</b></label>
   <div className="mixer-samples-title">PREVIEW THE FIREWORKS</div>
   <div className="mixer-samples">{samples.map(({label,kind,icon:Icon})=><button key={kind} onClick={()=>audition(kind)}><Icon size={14}/>{label}</button>)}</div>
   <p>Original festival ambience and firework effects · Sound stays on while you explore.</p>
  </div>}
 </div>
}

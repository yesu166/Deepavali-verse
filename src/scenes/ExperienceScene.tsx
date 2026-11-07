import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { ArrowLeft, ArrowRight, Download, Eraser, Send, RotateCcw, Trophy } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useVerseStore } from '../store/useVerseStore'
import SceneFrame from '../components/SceneFrame'
import { ART } from '../assets'
import FireworksCanvas from '../components/FireworksCanvas'

const palettes = [['#ef4d88','#ffbd42','#24aa91','#5789df','#9e62ce'],['#f27f37','#edbd43','#d84f50','#7e9f48','#ffffff'],['#8e5dc4','#df6dad','#f0c65a','#5a9dcc','#42ad91']]
const petals = Array.from({length:16},(_,i)=>i)
const sweets = ['🟠','🍬','🟡','🍥','⭐']

function BackBar({title,sub}:{title:string;sub:string}) {
 const setScene=useVerseStore(s=>s.setScene)
 return <header className="experience-header"><button className="back-button" onClick={()=>setScene('courtyard')}><ArrowLeft size={17}/> Courtyard</button><div><b>{title}</b><small>{sub}</small></div><span className="header-spark">✦</span></header>
}


function DiyaStudio() {
 const litDiyas = useVerseStore(s => s.litDiyas)
 const lightDiya = useVerseStore(s => s.lightDiya)
 const allLit = litDiyas.length >= 14
 return <SceneFrame className="experience-scene diya-scene">
  <BackBar title="Diya Courtyard" sub="One small flame changes everything"/>
  <div className="diya-studio-art" style={{backgroundImage:'url('+ART.courtyard+')'}}/>
  <div className="diya-studio-layout">
   <div className="experience-intro"><span className="eyebrow">A LIGHT YOU CAN LEAVE BEHIND</span><h2>One flame.<br/><em>A thousand ripples.</em></h2><p>Touch a lamp to wake its flame. As the courtyard fills with light, the whole place begins to glow.</p><div className="diya-score"><strong>{String(Math.min(litDiyas.length,14)).padStart(2,'0')}</strong><span>OF 14 DIYAS LIT</span></div></div>
   <div className="diya-orchard"><div className="diya-orchard-top"><span>THE LAMP GARDEN</span><small>{allLit?'THE COURTYARD IS GLOWING':'CHOOSE A LAMP'}</small></div><div className="diya-grid">{Array.from({length:14},(_,i)=>{const lit=litDiyas.includes(i);return <button key={i} className={'orchard-lamp '+(lit?'lamp-lit':'')} onClick={()=>lightDiya(i)} aria-label={lit?'Diya '+(i+1)+' is lit':'Light diya '+(i+1)}><i className="orchard-flame"/><span className="orchard-bowl"/><small>{String(i+1).padStart(2,'0')}</small></button>})}</div><div className="diya-meter"><i style={{width:Math.min(100,litDiyas.length/14*100)+'%'}}/></div><p>{allLit?'Every corner is glowing. You made this light.':'Your light is joining the evening, one diya at a time.'}</p></div>
  </div>
 </SceneFrame>
}

function RangoliStudio() {
 const [palette,setPalette]=useState(0)
 const [template,setTemplate]=useState(0)
 const [colours,setColours]=useState<string[]>(Array(16).fill('#ef4d88'))
 const [selectedColour,setSelectedColour]=useState(palettes[0][0])
 const [history,setHistory]=useState<string[][]>([])
 const canvasRef=useRef<HTMLDivElement>(null)
 const petalCount=template===0?12:template===1?16:8
 const paint=(i:number)=>{const index=i%colours.length;setHistory(h=>[...h,colours]);setColours(old=>old.map((v,j)=>index===j?selectedColour:v))}
 const undo=()=>{const previous=history.at(-1);if(previous){setColours(previous);setHistory(h=>h.slice(0,-1))}}
 const exportDesign=async()=>{if(!canvasRef.current)return;const data=await toPng(canvasRef.current,{pixelRatio:2,backgroundColor:'#101629'});const link=document.createElement('a');link.download='my-deepavali-rangoli.png';link.href=data;link.click()}
 return <SceneFrame className="experience-scene rangoli-scene"><BackBar title="Rangoli Atelier" sub="A little colour, a lot of joy"/><div className="experience-content rangoli-content"><div className="experience-intro"><span className="eyebrow">COLOUR YOUR EVENING</span><h2>Made by hand.<br/><em>Made by you.</em></h2><p>Choose a shade, then touch each petal to bring your rangoli to life.</p></div><div className="rangoli-workshop"><div className="rangoli-toolbar"><span>YOUR CANVAS</span><div><button onClick={undo} disabled={!history.length} aria-label="Undo"><RotateCcw size={16}/></button><button onClick={()=>{setHistory([]);setColours(Array(16).fill('#ef4d88'));setSelectedColour(palettes[0][0]);setPalette(0)}} aria-label="Reset"><Eraser size={16}/></button></div></div><div className="rangoli-canvas" ref={canvasRef}><svg viewBox="0 0 500 500" role="img" aria-label="Editable floral rangoli design"><defs><radialGradient id="rgCenter"><stop stopColor="#fff0bb"/><stop offset="1" stopColor="#d88b37"/></radialGradient></defs><circle cx="250" cy="250" r="232" fill="#1b2638"/><circle cx="250" cy="250" r="220" fill="none" stroke="#e8bd66" strokeWidth="3" strokeDasharray="2 8"/><circle cx="250" cy="250" r="190" fill="none" stroke="#f1d28c" strokeWidth="2"/>{petals.slice(0,petalCount).map(i=><g key={i} transform={'rotate('+i*(360/petalCount)+' 250 250)'}><ellipse onClick={()=>paint(i)} cx="250" cy={template===2?'132':'121'} rx={template===2?'49':'40'} ry={template===2?'90':'105'} fill={colours[i]} stroke="#ffe0a0" strokeWidth="4" className="rangoli-petal" role="button" tabIndex={0}/><ellipse cx="250" cy="121" rx="15" ry="66" fill="#ffffff" opacity=".16" pointerEvents="none"/><circle cx="250" cy="39" r="6" fill="#f9d88d"/></g>)}<circle cx="250" cy="250" r="89" fill="#d5a44f" stroke="#fff0bd" strokeWidth="5"/><circle cx="250" cy="250" r="69" fill="url(#rgCenter)"/>{Array.from({length:8},(_,i)=><path key={i} d="M250 190 Q281 221 250 250 Q219 221 250 190" transform={'rotate('+i*45+' 250 250)'} fill="#b94772" stroke="#fff0bd" strokeWidth="2"/>)}<circle cx="250" cy="250" r="22" fill="#1d3041" stroke="#fff0bd" strokeWidth="4"/></svg></div><div className="rangoli-controls"><div className="colour-story"><span>COLOUR STORY</span><div className="palette-tabs">{palettes.map((set,i)=><button key={i} className={palette===i?'active':''} onClick={()=>{setPalette(i);setSelectedColour(set[0])}} style={{background:'linear-gradient(90deg,'+set.join(',')+')'}} aria-label={'Choose colour palette '+(i+1)}/>)}</div><div className="swatches">{palettes[palette].map((c,i)=><button key={c} className={selectedColour===c?'selected':''} onClick={()=>setSelectedColour(c)} style={{background:c}} aria-label={'Select colour '+(i+1)}/>)}</div></div><div className="template-control"><span>DESIGN</span><div><button onClick={()=>setTemplate(v=>(v+2)%3)}><ArrowLeft size={15}/></button><b>0{template+1}</b><button onClick={()=>setTemplate(v=>(v+1)%3)}><ArrowRight size={15}/></button></div></div><button className="gold-action" onClick={exportDesign}><Download size={15}/> Save rangoli</button></div></div></div></SceneFrame>
}

function FireworksStudio() {
 const [hue,setHue]=useState(42)
 const [pattern,setPattern]=useState<'bloom'|'willow'|'comet'>('bloom')
 return <SceneFrame className="experience-scene fireworks-scene"><BackBar title="The Fireworks Terrace" sub="The night is yours to paint"/><FireworksCanvas active interactive hue={hue} pattern={pattern}/><div className="fireworks-content"><span className="eyebrow">A SKY FULL OF POSSIBILITY</span><h2>Make the night<br/><em>your canvas.</em></h2><p>Tap anywhere in the sky. Every touch leaves a little celebration behind.</p><div className="firework-panel"><label>BURST COLOUR</label><div className="firework-colours">{[25,42,130,175,210,280,325].map(v=><button key={v} onClick={()=>setHue(v)} className={hue===v?'selected':''} style={{background:'hsl('+v+',90%,62%)'}} aria-label={'Select colour '+v}/>)}</div><label>BURST STYLE</label><div className="pattern-pills">{(['bloom','willow','comet'] as const).map(v=><button key={v} className={pattern===v?'selected':''} onClick={()=>setPattern(v)}>{v}</button>)}</div><div className="name-row"><span className="fine-print">Selected hue</span><span className="selected-hue" style={{background:'hsl('+hue+',90%,62%)'}}/></div><small className="fine-print">Click the open sky to launch your display. Choose a colour to set the mood.</small></div></div></SceneFrame>
}

function SweetGame() {
 const [running,setRunning]=useState(false)
 const [seconds,setSeconds]=useState(30)
 const [basket,setBasket]=useState(50)
 const [items,setItems]=useState<{id:number;left:number;top:number;icon:string}[]>([])
 const score=useVerseStore(s=>s.score), addScore=useVerseStore(s=>s.addScore), best=useVerseStore(s=>s.bestScore)
 useEffect(()=>{if(!running)return;const timer=window.setInterval(()=>setSeconds(s=>{if(s<=1){setRunning(false);return 0}return s-1}),1000);return()=>clearInterval(timer)},[running])
 useEffect(()=>{if(!running)return;const spawn=window.setInterval(()=>setItems(old=>[...old.filter(i=>i.top<94),{id:Date.now()+Math.random(),left:8+Math.random()*84,top:-8,icon:sweets[Math.floor(Math.random()*sweets.length)]}].slice(-14)),520);const fall=window.setInterval(()=>setItems(old=>old.map(i=>({...i,top:i.top+2.1})).filter(i=>i.top<105)),80);return()=>{clearInterval(spawn);clearInterval(fall)}},[running])
 useEffect(()=>{if(!running)return;const hits=items.filter(i=>i.top>78&&i.top<96&&Math.abs(i.left-basket)<13);if(hits.length){addScore(hits.length*10);setItems(old=>old.filter(i=>!hits.some(h=>h.id===i.id)))}},[items,basket,running,addScore])
 const start=()=>{useVerseStore.setState({score:0});setItems([]);setSeconds(30);setRunning(true)}
 const move=(e:ReactPointerEvent<HTMLDivElement>)=>{const rect=e.currentTarget.getBoundingClientRect();setBasket(Math.max(8,Math.min(92,((e.clientX-rect.left)/rect.width)*100)))}
 return <SceneFrame className="experience-scene bazaar-scene"><BackBar title="Sweet Bazaar" sub="A tiny game for a sweet evening"/><div className="bazaar-art" style={{backgroundImage:'url('+ART.bazaar+')'}}/><div className="game-layout"><div className="experience-intro"><span className="eyebrow">THE SWEETEST CHALLENGE</span><h2>Laddu<br/><em>Catcher.</em></h2><p>Catch the festival treats before they tumble away. Thirty seconds. Ready?</p><div className="game-stats"><span><Trophy size={15}/> BEST {best}</span><span>✦ SCORE {score}</span><span>◷ {seconds}s</span></div></div><div className="game-board" onPointerMove={move} onPointerDown={move}><div className="bazaar-lights"/><div className="game-stall">SWEET BAZAAR <span>✦ ✦ ✦</span></div>{items.map(item=><span key={item.id} className="falling-sweet" style={{left:item.left+'%',top:item.top+'%'}}>{item.icon}</span>)}<div className="catch-basket" style={{left:basket+'%'}}>╭────────╮<b>✦</b></div>{!running&&<div className="game-overlay"><span className="game-emblem">✦</span><h3>{seconds===0?'Sweet run complete':'Ready for a sweet run?'}</h3><p>{seconds===0?'You collected '+score+' points.':'Move your pointer or finger to guide the basket.'}</p><button className="gold-action" onClick={start}>{seconds===0?'Play again':'Start catching'}</button></div>}</div></div></SceneFrame>
}

function LanternStudio() {
 const [wish,setWish]=useState('')
 const [released,setReleased]=useState(false)
 const saveWish=useVerseStore(s=>s.saveWish), wishes=useVerseStore(s=>s.wishes)
 const release=()=>{if(!wish.trim())return;saveWish(wish.trim());setReleased(true);setWish('');window.setTimeout(()=>setReleased(false),4200)}
 return <SceneFrame className="experience-scene lantern-scene"><BackBar title="Lantern Ghat" sub="A quiet place for bright wishes"/><div className="lantern-water"/><div className="lantern-content"><span className="eyebrow">SOMETHING GOOD, SENT SKYWARD</span><h2>Let a wish<br/><em>take flight.</em></h2><p>Leave a thought for the year ahead. Your lantern will carry it into the evening.</p><div className="wish-card"><label htmlFor="wish">YOUR WISH</label><textarea id="wish" value={wish} onChange={e=>setWish(e.target.value)} maxLength={140} placeholder="A little hope for the days ahead..."/><div className="wish-card-bottom"><small>{wish.length}/140</small><button className="gold-action" disabled={!wish.trim()} onClick={release}><Send size={15}/> Release lantern</button></div></div>{released&&<div className="released-message">Your wish is on its way ✦</div>}<div className="wish-count">{wishes.length.toString().padStart(2,'0')} wishes kept close</div></div>{released&&<div className="released-lantern" aria-hidden="true">🏮</div>}</SceneFrame>
}

function GreetingStudio() {
 const [from,setFrom]=useState('');const [to,setTo]=useState('');const [message,setMessage]=useState('May your home glow with happiness, your heart shine with hope, and your year overflow with new beginnings.')
 const [design,setDesign]=useState(0)
 const cardRef=useRef<HTMLDivElement>(null)
 const exportCard=async()=>{if(!cardRef.current)return;const data=await toPng(cardRef.current,{pixelRatio:2,cacheBust:true});const link=document.createElement('a');link.download='deepavali-greeting.png';link.href=data;link.click()}
 const share=()=>{const text='Happy Deepavali'+(to?', '+to:'')+'! '+message+(from?' — '+from:'');window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener,noreferrer')}
 return <SceneFrame className="experience-scene greeting-scene"><BackBar title="Greeting Pavilion" sub="A little light, sent your way"/><div className="greeting-layout"><div className="experience-intro"><span className="eyebrow">A NOTE TO SOMEONE DEAR</span><h2>Make it<br/><em>personal.</em></h2><p>A few words can travel a long way. Make a greeting and send some warmth.</p><div className="greeting-fields"><label>FROM<input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Your name"/></label><label>TO<input value={to} onChange={e=>setTo(e.target.value)} placeholder="Someone special"/></label><label>YOUR MESSAGE<textarea value={message} onChange={e=>setMessage(e.target.value)} maxLength={220}/></label><label>DESIGN<div className="design-picks">{[0,1,2].map(i=><button key={i} className={design===i?'active':''} onClick={()=>setDesign(i)}><span className={'design-swatch swatch-'+i}/><small>0{i+1}</small></button>)}</div></label><div className="greeting-actions"><button className="gold-action" onClick={exportCard}><Download size={15}/> Download card</button><button className="outline-action" onClick={share}><Send size={15}/> WhatsApp</button></div></div></div><div className="greeting-preview" ref={cardRef}><div className={'greeting-card card-design-'+design}><div className="card-ornament"><span>✺</span><span>✧</span><span>✺</span></div><div className="card-diya">🪔</div><span className="card-overline">WITH LIGHT & LOVE</span><h3>Happy<br/><em>Deepavali</em></h3><div className="card-divider">✦</div><p>{message}</p><div className="card-names">{from&&<span>WITH LOVE, {from}</span>}{to&&<b>FOR {to}</b>}</div><div className="card-footer">MAY THE LIGHT STAY WITH YOU</div></div></div></div></SceneFrame>
}

export default function ExperienceScene({scene}:{scene:string}) {
 if(scene==='diya')return <DiyaStudio/>
 if(scene==='rangoli')return <RangoliStudio/>
 if(scene==='fireworks')return <FireworksStudio/>
 if(scene==='bazaar')return <SweetGame/>
 if(scene==='lanterns')return <LanternStudio/>
 if(scene==='greetings')return <GreetingStudio/>
 return null
}
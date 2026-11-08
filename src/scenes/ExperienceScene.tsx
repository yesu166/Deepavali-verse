import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { ArrowLeft, ArrowRight, Download, Eraser, Send, RotateCcw, Trophy, Rocket, Sparkles, Layers3, Flame, Sun, Orbit, Zap } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useVerseStore } from '../store/useVerseStore'
import SceneFrame from '../components/SceneFrame'
import { ART } from '../assets'
import SoundControl from '../components/SoundControl'
import { soundEngine } from '../lib/soundEngine'
import FireworksCanvas, { type LaunchCommand } from '../components/FireworksCanvas'
const TerraceDepth = lazy(() => import('../components/TerraceDepth'))

const palettes = [['#ef4d88','#ffbd42','#24aa91','#5789df','#9e62ce'],['#f27f37','#edbd43','#d84f50','#7e9f48','#ffffff'],['#8e5dc4','#df6dad','#f0c65a','#5a9dcc','#42ad91']]
const petals = Array.from({length:16},(_,i)=>i)
const sweets = ['🟠','🍬','🟡','🍥','⭐']

function BackBar({title,sub}:{title:string;sub:string}) {
 const setScene=useVerseStore(s=>s.setScene)
 return <header className="experience-header"><button className="back-button" onClick={()=>setScene('courtyard')}><ArrowLeft size={17}/> Courtyard</button><div><b>{title}</b><small>{sub}</small></div><SoundControl/><span className="header-spark">✦</span></header>
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
   <div className="diya-orchard"><div className="diya-orchard-top"><span>THE LAMP GARDEN</span><small>{allLit?'THE COURTYARD IS GLOWING':'CHOOSE A LAMP'}</small></div><div className="diya-grid">{Array.from({length:14},(_,i)=>{const lit=litDiyas.includes(i);return <button key={i} className={'orchard-lamp '+(lit?'lamp-lit':'')} onClick={()=>{if(!lit)soundEngine.play('diya');lightDiya(i)}} aria-label={lit?'Diya '+(i+1)+' is lit':'Light diya '+(i+1)}><i className="orchard-flame"/><span className="orchard-bowl"/><small>{String(i+1).padStart(2,'0')}</small></button>})}</div><div className="diya-meter"><i style={{width:Math.min(100,litDiyas.length/14*100)+'%'}}/></div><p>{allLit?'Every corner is glowing. You made this light.':'Your light is joining the evening, one diya at a time.'}</p></div>
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
 const paint=(i:number)=>{const index=i%colours.length;setHistory(h=>[...h,colours]);setColours(old=>old.map((v,j)=>index===j?selectedColour:v));soundEngine.play('rangoli')}
 const undo=()=>{const previous=history.at(-1);if(previous){setColours(previous);setHistory(h=>h.slice(0,-1))}}
 const exportDesign=async()=>{if(!canvasRef.current)return;const data=await toPng(canvasRef.current,{pixelRatio:2,backgroundColor:'#101629'});const link=document.createElement('a');link.download='my-deepavali-rangoli.png';link.href=data;link.click()}
 return <SceneFrame className="experience-scene rangoli-scene"><BackBar title="Rangoli Atelier" sub="A little colour, a lot of joy"/><div className="experience-content rangoli-content"><div className="experience-intro"><span className="eyebrow">COLOUR YOUR EVENING</span><h2>Made by hand.<br/><em>Made by you.</em></h2><p>Choose a shade, then touch each petal to bring your rangoli to life.</p></div><div className="rangoli-workshop"><div className="rangoli-toolbar"><span>YOUR CANVAS</span><div><button onClick={undo} disabled={!history.length} aria-label="Undo"><RotateCcw size={16}/></button><button onClick={()=>{setHistory([]);setColours(Array(16).fill('#ef4d88'));setSelectedColour(palettes[0][0]);setPalette(0)}} aria-label="Reset"><Eraser size={16}/></button></div></div><div className="rangoli-canvas" ref={canvasRef}><svg viewBox="0 0 500 500" role="img" aria-label="Editable floral rangoli design"><defs><radialGradient id="rgCenter"><stop stopColor="#fff0bb"/><stop offset="1" stopColor="#d88b37"/></radialGradient></defs><circle cx="250" cy="250" r="232" fill="#1b2638"/><circle cx="250" cy="250" r="220" fill="none" stroke="#e8bd66" strokeWidth="3" strokeDasharray="2 8"/><circle cx="250" cy="250" r="190" fill="none" stroke="#f1d28c" strokeWidth="2"/>{petals.slice(0,petalCount).map(i=><g key={i} transform={'rotate('+i*(360/petalCount)+' 250 250)'}><ellipse onClick={()=>paint(i)} cx="250" cy={template===2?'132':'121'} rx={template===2?'49':'40'} ry={template===2?'90':'105'} fill={colours[i]} stroke="#ffe0a0" strokeWidth="4" className="rangoli-petal" role="button" tabIndex={0}/><ellipse cx="250" cy="121" rx="15" ry="66" fill="#ffffff" opacity=".16" pointerEvents="none"/><circle cx="250" cy="39" r="6" fill="#f9d88d"/></g>)}<circle cx="250" cy="250" r="89" fill="#d5a44f" stroke="#fff0bd" strokeWidth="5"/><circle cx="250" cy="250" r="69" fill="url(#rgCenter)"/>{Array.from({length:8},(_,i)=><path key={i} d="M250 190 Q281 221 250 250 Q219 221 250 190" transform={'rotate('+i*45+' 250 250)'} fill="#b94772" stroke="#fff0bd" strokeWidth="2"/>)}<circle cx="250" cy="250" r="22" fill="#1d3041" stroke="#fff0bd" strokeWidth="4"/></svg></div><div className="rangoli-controls"><div className="colour-story"><span>COLOUR STORY</span><div className="palette-tabs">{palettes.map((set,i)=><button key={i} className={palette===i?'active':''} onClick={()=>{setPalette(i);setSelectedColour(set[0])}} style={{background:'linear-gradient(90deg,'+set.join(',')+')'}} aria-label={'Choose colour palette '+(i+1)}/>)}</div><div className="swatches">{palettes[palette].map((c,i)=><button key={c} className={selectedColour===c?'selected':''} onClick={()=>setSelectedColour(c)} style={{background:c}} aria-label={'Select colour '+(i+1)}/>)}</div></div><div className="template-control"><span>DESIGN</span><div><button onClick={()=>setTemplate(v=>(v+2)%3)}><ArrowLeft size={15}/></button><b>0{template+1}</b><button onClick={()=>setTemplate(v=>(v+1)%3)}><ArrowRight size={15}/></button></div></div><button className="gold-action" onClick={exportDesign}><Download size={15}/> Save rangoli</button></div></div></div></SceneFrame>
}

function FireworksStudio() {
 const [hue,setHue]=useState(42)
 const [pattern,setPattern]=useState<'bloom'|'willow'|'comet'>('bloom')
 const [launchRequest,setLaunchRequest]=useState<LaunchCommand|null>(null)
 const fire=(kind:LaunchCommand['kind'])=>setLaunchRequest(old=>({id:(old?.id??0)+1,kind,hue,x:.52,y:(kind==='anar'||kind==='chakri'||kind==='phooljhadi'||kind==='ladi')?0.77:0.43}))
 return <SceneFrame className="experience-scene fireworks-scene terrace-fireworks-scene">
  <BackBar title="Terrace Fireworks" sub="A clear sky. A terrace full of possibility"/>
  <div className="fireworks-terrace-art" style={{backgroundImage:'url('+ART.terrace+')'}}/>
  <Suspense fallback={null}><TerraceDepth/></Suspense>
  <FireworksCanvas active ambient interactive hue={hue} pattern={pattern} launchRequest={launchRequest}/>
  <div className="fireworks-stage-copy"><span className="eyebrow">THE OPEN SKY IS YOUR CANVAS</span><h2>Make the night<br/><em>come alive.</em></h2><p>Tap the sky for a single shot, or compose a sequence from the launch deck.</p></div>
  <div className="firework-deck">
   <div className="firework-deck-title"><span>LAUNCH DECK</span><small>CHOOSE YOUR DISPLAY</small></div>
   <div className="firework-deck-actions">
    <button onClick={()=>fire('sky')}><Rocket size={18}/><b>Sky shot</b><small>Single shell</small></button>
    <button onClick={()=>fire('volley')}><Sparkles size={18}/><b>Five-shot volley</b><small>Layered burst</small></button>
    <button onClick={()=>fire('battery')}><Layers3 size={18}/><b>Battery</b><small>Three launches</small></button>
    <button onClick={()=>fire('fountain')}><Flame size={18}/><b>Fountain</b><small>Ground shimmer</small></button>
    <button onClick={()=>fire('anar')}><Sun size={18}/><b>Anar</b><small>Golden fountain</small></button>
    <button onClick={()=>fire('chakri')}><Orbit size={18}/><b>Chakri</b><small>Spinning wheel</small></button>
    <button onClick={()=>fire('phooljhadi')}><Sparkles size={18}/><b>Phooljhadi</b><small>Glittering sparks</small></button>
    <button onClick={()=>fire('ladi')}><Zap size={18}/><b>Ladi</b><small>Rapid-fire chain</small></button>
   </div>
   <div className="firework-deck-options"><div><label>COLOUR</label><div className="firework-colours">{[25,42,130,175,210,280,325].map(v=><button key={v} onClick={()=>setHue(v)} className={hue===v?'selected':''} style={{background:'hsl('+v+',90%,62%)'}} aria-label={'Choose hue '+v}/>)}</div></div><div><label>BURST SHAPE</label><div className="pattern-pills">{(['bloom','willow','comet'] as const).map(v=><button key={v} className={pattern===v?'selected':''} onClick={()=>setPattern(v)}>{v}</button>)}</div></div></div>
   <small className="fine-print">Tip: tap open sky to launch at the point you choose. A battery sends three rockets in sequence.</small>
  </div>
 </SceneFrame>
}

function LanternIllustration({theme=0,motif='lotus'}:{theme?:number;motif?:string}) {
 const colours=[['#f8d27a','#9b4b2d','#f7a84f'],['#f8a9cf','#8c2767','#d75d9c'],['#9be0d0','#176e70','#39ad9e'],['#c8b7ff','#543e9b','#8b71d7'],['#ffd6a0','#a54a25','#ed8c42']][theme]
 return <svg className="lantern-svg" viewBox="0 0 240 310" role="img" aria-label="Decorative glowing wish lantern">
  <defs><linearGradient id="lanternPaper" x1="0" y1="0" x2="1" y2="1"><stop stopColor={colours[0]}/><stop offset=".5" stopColor={colours[1]}/><stop offset="1" stopColor={colours[2]}/></linearGradient><radialGradient id="lanternGlow"><stop stopColor="#fff5c7" stopOpacity=".9"/><stop offset="1" stopColor="#ffbd55" stopOpacity="0"/></radialGradient></defs>
  <path d="M120 7v23M88 28q32 17 64 0M96 35l-8 15h64l-8-15" fill="none" stroke={colours[0]} strokeWidth="3"/>
  <path d="M72 53Q120 27 168 53L190 98Q202 155 174 233L120 268 66 233Q38 155 50 98Z" fill="url(#lanternPaper)" stroke={colours[0]} strokeWidth="5"/>
  <path d="M75 55Q120 83 165 55M52 100Q120 125 188 100M49 206Q120 227 191 206M66 233Q120 259 174 233" fill="none" stroke={colours[0]} strokeWidth="2" opacity=".9"/>
  {motif==='lotus'?<path d="M120 69c-28 29-31 64 0 92 31-28 28-63 0-92Z" fill="none" stroke={colours[0]} strokeWidth="3"/>:motif==='mandala'?<g fill="none" stroke={colours[0]} strokeWidth="2"><circle cx="120" cy="150" r="39"/><circle cx="120" cy="150" r="25"/>{Array.from({length:12},(_,i)=><ellipse key={i} cx="120" cy="112" rx="8" ry="21" transform={'rotate('+i*30+' 120 150)'}/>)}</g>:<g fill={colours[0]}>{Array.from({length:9},(_,i)=><path key={i} d="M120 123l7 16 17 2-13 11 4 17-15-9-15 9 4-17-13-11 17-2Z" transform={'translate('+(i%3-1)*34+' '+(Math.floor(i/3)-1)*38+') scale(.55)'}/>)}</g>}
  <path d="M120 91c-14 17-14 32 0 48 14-16 14-31 0-48Z" fill="url(#lanternGlow)"/>
  <path d="M78 148q42-43 84 0-42 44-84 0Z" fill="none" stroke={colours[0]} strokeWidth="2.5"/>
  <path d="M65 183q55-35 110 0-55 38-110 0Z" fill="none" stroke={colours[0]} strokeWidth="2"/>
  {Array.from({length:8},(_,i)=><path key={i} d="M120 49v14" stroke={colours[0]} strokeWidth="2" transform={'rotate('+i*45+' 120 155)'}/>)}
  <path d="M78 268l-13 15m43-10-5 19m37-19 5 19m30-24 13 15" stroke={colours[0]} strokeWidth="3" strokeLinecap="round"/>
  <ellipse cx="120" cy="156" rx="87" ry="117" fill="url(#lanternGlow)" opacity=".35"/>
  <path d="M93 274h54l-8 15h-38Z" fill={colours[1]} stroke={colours[0]} strokeWidth="3"/>
 </svg>
}

function LanternStudio() {
 const [wish,setWish]=useState('')
 const [sender,setSender]=useState('')
 const [released,setReleased]=useState(false)
 const [theme,setTheme]=useState(0)
 const [motif,setMotif]=useState('lotus')
 const [wishFont,setWishFont]=useState('Cormorant Garamond')
 const [wishSize,setWishSize]=useState(12)
 const saveWish=useVerseStore(s=>s.saveWish), wishes=useVerseStore(s=>s.wishes)
 const release=()=>{if(!wish.trim())return;saveWish((sender?'From '+sender+': ':'')+wish.trim());soundEngine.play('lantern');setReleased(true);setWish('');window.setTimeout(()=>setReleased(false),5200)}
 const suggestions=['May our home stay full of laughter.','Health, courage and new beginnings.','A little more kindness for everyone.']
 return <SceneFrame className="experience-scene lantern-scene">
  <BackBar title="Lantern Ghat" sub="Give a quiet wish its own light"/>
  <div className="lantern-skyline"/>
  <div className="lantern-workspace">
   <div className="lantern-editor-copy"><span className="eyebrow">A WISH, MADE VISIBLE</span><h2>Send a little<br/><em>light skyward.</em></h2><p>Shape your lantern, write a wish, then release it into the night. Your wishes stay saved on this device.</p>
    <div className="wish-editor">
     <label htmlFor="wish">YOUR WISH</label><textarea id="wish" value={wish} onChange={e=>setWish(e.target.value)} maxLength={160} placeholder="Write something you hope the year will hold..."/>
     <div className="wish-suggestions">{suggestions.map(v=><button key={v} onClick={()=>setWish(v)}>{v}</button>)}</div>
     <label htmlFor="wish-sender">FROM</label><input id="wish-sender" value={sender} onChange={e=>setSender(e.target.value)} maxLength={30} placeholder="Your name (optional)"/>
     <div className="lantern-customize"><span>COLOUR YOUR LANTERN</span><div>{['#f1b85a','#d65b9a','#35a89e','#8f79db','#eb8652'].map((c,i)=><button key={c} className={theme===i?'selected':''} onClick={()=>setTheme(i)} style={{background:c}} aria-label={'Lantern colour '+(i+1)}/>)}</div></div>
     <div className="lantern-customize"><span>LETTERING</span><div className="wish-lettering"><select value={wishFont} onChange={e=>setWishFont(e.target.value)}><option>Cormorant Garamond</option><option>DM Sans</option><option>Georgia</option></select><input aria-label="Wish lettering size" type="range" min="9" max="17" value={wishSize} onChange={e=>setWishSize(Number(e.target.value))}/></div></div>
     <div className="lantern-customize"><span>ORNAMENT</span><div className="pattern-pills">{['lotus','mandala','stars'].map(v=><button key={v} className={motif===v?'selected':''} onClick={()=>setMotif(v)}>{v}</button>)}</div></div>
     <button className="gold-action wish-release" disabled={!wish.trim()} onClick={release}><Send size={16}/> Release my lantern</button>
    </div>
   </div>
   <div className="lantern-preview-column"><div className="lantern-preview-glow"/><div className={'large-lantern '+(released?'lantern-releasing':'')}><LanternIllustration theme={theme} motif={motif}/><div className="lantern-preview-message" style={{fontFamily:wishFont,fontSize:wishSize+'px'}}>{wish||'A little light for the world'}<small>{sender||'A wish from you'}</small></div></div><span className="lantern-preview-caption">YOUR LANTERN · {motif.toUpperCase()} EDITION</span><div className="wish-count">{wishes.length.toString().padStart(2,'0')} wishes kept close</div>{released&&<div className="released-message">Your wish is on its way ✦</div>}</div>
  </div>
 </SceneFrame>
}

function GreetingOrnament({kind}:{kind:number}) {
 return <svg className={'greeting-ornament ornament-'+kind} viewBox="0 0 420 520" aria-hidden="true">
  <defs><pattern id="mandalaGrid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M22 2Q40 22 22 42Q4 22 22 2M2 22Q22 4 42 22Q22 40 2 22" fill="none" stroke="currentColor" strokeWidth="1" opacity=".55"/></pattern></defs>
  <rect x="15" y="15" width="390" height="490" rx="18" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  <rect x="26" y="26" width="368" height="468" rx="14" fill="none" stroke="currentColor" strokeWidth=".8" strokeDasharray="2 5"/>
  {kind===0?<><circle cx="210" cy="260" r="135" fill="url(#mandalaGrid)"/>{Array.from({length:16},(_,i)=><path key={i} d="M210 93Q249 164 210 210Q171 164 210 93" fill="none" stroke="currentColor" strokeWidth="2" transform={'rotate('+i*22.5+' 210 260)'}/>)}</>:kind===1?<>{Array.from({length:4},(_,i)=><path key={i} d="M55 55Q210 12 365 55Q330 260 210 465Q90 260 55 55Z" fill="none" stroke="currentColor" strokeWidth="2" transform={'rotate('+i*90+' 210 260)'}/>)}</>:<><rect x="44" y="44" width="332" height="432" fill="url(#mandalaGrid)" opacity=".35"/>{Array.from({length:12},(_,i)=><path key={i} d="M210 36Q260 110 210 155Q160 110 210 36" fill="none" stroke="currentColor" strokeWidth="2" transform={'rotate('+i*30+' 210 260)'}/>)}</>}
 </svg>
}

function GreetingStudio() {
 const [from,setFrom]=useState('');const [to,setTo]=useState('')
 const [message,setMessage]=useState('May your home glow with happiness, your heart shine with hope, and your year overflow with new beginnings.')
 const [theme,setTheme]=useState(0);const [ornament,setOrnament]=useState(0);const [font,setFont]=useState('Cormorant Garamond')
 const [align,setAlign]=useState<'center'|'left'>('center');const [scale,setScale]=useState(18);const [layout,setLayout]=useState('portrait')
 const [showDiya,setShowDiya]=useState(true);const [showBorder,setShowBorder]=useState(true)
 const cardRef=useRef<HTMLDivElement>(null)
 const themes=[{name:'Royal ruby',bg:'#4c1236',accent:'#f0c46c',glow:'#d34a83'},{name:'Peacock',bg:'#103f4a',accent:'#79d4c1',glow:'#238b92'},{name:'Midnight',bg:'#17233e',accent:'#f2d08c',glow:'#7867bf'},{name:'Saffron',bg:'#7b321a',accent:'#ffe0a0',glow:'#df7d36'},{name:'Lotus dusk',bg:'#45204d',accent:'#ffc0dc',glow:'#d95aab'}]
 const current=themes[theme]
 const presets=['May light find every corner of your home.','Wishing you peace, prosperity and a beautiful year ahead.','May every new beginning bring a reason to smile.']
 const exportCard=async()=>{if(!cardRef.current)return;soundEngine.play('ui');await document.fonts.ready;const data=await toPng(cardRef.current,{pixelRatio:2,cacheBust:true});const link=document.createElement('a');link.download='deepavali-greeting.png';link.href=data;link.click()}
 const share=()=>{soundEngine.play('ui');const text='Happy Deepavali'+(to?', '+to:'')+'! '+message+(from?' — '+from:'');window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener,noreferrer')}
 return <SceneFrame className="experience-scene greeting-scene">
  <BackBar title="Greeting Pavilion" sub="Design a keepsake worth sharing"/>
  <div className="greeting-studio-layout">
   <div className="greeting-editor-column"><div className="experience-intro"><span className="eyebrow">A GREETING WITH YOUR SIGNATURE</span><h2>Make it<br/><em>unmistakably yours.</em></h2><p>Layer a message over intricate festival ornament. Change the palette, frame, type and composition.</p></div>
    <div className="greeting-fields">
     <label>FROM<input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Your name"/></label>
     <label>TO<input value={to} onChange={e=>setTo(e.target.value)} placeholder="Someone special"/></label>
     <label>MESSAGE<textarea value={message} onChange={e=>setMessage(e.target.value)} maxLength={320}/></label>
     <div className="message-presets">{presets.map(v=><button key={v} onClick={()=>setMessage(v)}>{v}</button>)}</div>
     <div className="designer-row"><label>PALETTE<div className="designer-swatches">{themes.map((v,i)=><button key={v.name} className={theme===i?'selected':''} style={{background:'linear-gradient(135deg,'+v.bg+','+v.glow+')'}} onClick={()=>setTheme(i)} aria-label={v.name}/>)}</div></label><label>ORNAMENT<div className="design-picks">{['Mandala','Lotus','Jali'].map((v,i)=><button key={v} className={ornament===i?'active':''} onClick={()=>setOrnament(i)}><small>{v}</small></button>)}</div></label></div>
     <div className="designer-row"><label>TYPEFACE<select value={font} onChange={e=>setFont(e.target.value)}><option>Cormorant Garamond</option><option>DM Sans</option><option>Georgia</option><option>cursive</option></select></label><label>LAYOUT<select value={layout} onChange={e=>setLayout(e.target.value)}><option value="portrait">Portrait</option><option value="square">Square</option></select></label></div>
     <div className="designer-row"><label>TEXT SIZE<input type="range" min="13" max="25" value={scale} onChange={e=>setScale(Number(e.target.value))}/></label><label>ALIGNMENT<div className="align-toggle"><button className={align==='center'?'selected':''} onClick={()=>setAlign('center')}>Center</button><button className={align==='left'?'selected':''} onClick={()=>setAlign('left')}>Left</button></div></label></div>
     <div className="designer-checks"><label><input type="checkbox" checked={showDiya} onChange={e=>setShowDiya(e.target.checked)}/> Diya motif</label><label><input type="checkbox" checked={showBorder} onChange={e=>setShowBorder(e.target.checked)}/> Ornamental frame</label></div>
     <div className="greeting-actions"><button className="gold-action" onClick={exportCard}><Download size={15}/> Download PNG</button><button className="outline-action" onClick={share}><Send size={15}/> Share on WhatsApp</button></div>
    </div>
   </div>
   <div className="greeting-preview-column"><div className={'greeting-card-final card-layout-'+layout} ref={cardRef} style={{'--card-bg':current.bg,'--card-accent':current.accent,'--card-glow':current.glow,'--message-size':scale+'px','--message-align':align,'--message-font':font} as React.CSSProperties}>
     {showBorder&&<GreetingOrnament kind={ornament}/>}
     <div className="greeting-card-topline">A FESTIVAL OF LIGHTS</div>
     {showDiya&&<div className="greeting-card-diya">🪔</div>}
     <div className="greeting-card-title">Happy<br/><em>Deepavali</em></div>
     <div className="greeting-card-divider">✦ ✺ ✦</div>
     <p className="greeting-card-message">{message}</p>
     <div className="greeting-card-names">{from&&<span>WITH LOVE, {from}</span>}{to&&<b>FOR {to}</b>}</div>
     <div className="greeting-card-footer">MAY THE LIGHT STAY WITH YOU</div>
    </div><span className="preview-caption">LIVE PREVIEW · YOUR DESIGN UPDATES AS YOU CREATE</span></div>
  </div>
 </SceneFrame>
}

export default function ExperienceScene({scene}:{scene:string}) {
 if(scene==='diya')return <DiyaStudio/>
 if(scene==='rangoli')return <RangoliStudio/>
 if(scene==='fireworks')return <FireworksStudio/>
 if(scene==='bazaar')return <SweetGame/>
 if(scene==='lanterns')return <LanternStudio/>
 if(scene==='greetings')return <GreetingStudio/>
 return null
function SweetGame() {
 const [running,setRunning]=useState(false)
 const [seconds,setSeconds]=useState(30)
 const [basket,setBasket]=useState(50)
 const [items,setItems]=useState<{id:number;left:number;top:number;icon:string}[]>([])
 const score=useVerseStore(s=>s.score), addScore=useVerseStore(s=>s.addScore), best=useVerseStore(s=>s.bestScore)
 useEffect(()=>{if(!running)return;const timer=window.setInterval(()=>setSeconds(s=>{if(s<=1){setRunning(false);return 0}return s-1}),1000);return()=>clearInterval(timer)},[running])
 useEffect(()=>{if(!running)return;const spawn=window.setInterval(()=>setItems(old=>[...old.filter(i=>i.top<94),{id:Date.now()+Math.random(),left:8+Math.random()*84,top:-8,icon:sweets[Math.floor(Math.random()*sweets.length)]}].slice(-14)),520);const fall=window.setInterval(()=>setItems(old=>old.map(i=>({...i,top:i.top+2.1})).filter(i=>i.top<105)),80);return()=>{clearInterval(spawn);clearInterval(fall)}},[running])
 useEffect(()=>{if(!running)return;const hits=items.filter(i=>i.top>78&&i.top<96&&Math.abs(i.left-basket)<13);if(hits.length){addScore(hits.length*10);soundEngine.play('catch');setItems(old=>old.filter(i=>!hits.some(h=>h.id===i.id)))}},[items,basket,running,addScore])
 const start=()=>{useVerseStore.setState({score:0});setItems([]);setSeconds(30);setRunning(true)}
 const move=(e:ReactPointerEvent<HTMLDivElement>)=>{const rect=e.currentTarget.getBoundingClientRect();setBasket(Math.max(8,Math.min(92,((e.clientX-rect.left)/rect.width)*100)))}
 return <SceneFrame className="experience-scene bazaar-scene"><BackBar title="Sweet Bazaar" sub="A tiny game for a sweet evening"/><div className="bazaar-art" style={{backgroundImage:'url('+ART.bazaar+')'}}/><div className="game-layout"><div className="experience-intro"><span className="eyebrow">THE SWEETEST CHALLENGE</span><h2>Laddu<br/><em>Catcher.</em></h2><p>Catch the festival treats before they tumble away. Thirty seconds. Ready?</p><div className="game-stats"><span><Trophy size={15}/> BEST {best}</span><span>✦ SCORE {score}</span><span>◷ {seconds}s</span></div></div><div className="game-board" onPointerMove={move} onPointerDown={move}><div className="bazaar-lights"/><div className="game-stall">SWEET BAZAAR <span>✦ ✦ ✦</span></div>{items.map(item=><span key={item.id} className="falling-sweet" style={{left:item.left+'%',top:item.top+'%'}}>{item.icon}</span>)}<div className="catch-basket" style={{left:basket+'%'}}>╭────────╮<b>✦</b></div>{!running&&<div className="game-overlay"><span className="game-emblem">✦</span><h3>{seconds===0?'Sweet run complete':'Ready for a sweet run?'}</h3><p>{seconds===0?'You collected '+score+' points.':'Move your pointer or finger to guide the basket.'}</p><button className="gold-action" onClick={start}>{seconds===0?'Play again':'Start catching'}</button></div>}</div></div></SceneFrame>
}


}
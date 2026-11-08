import { ArrowUpRight, Flower2, Flame, Gift, Heart, Maximize2, PartyPopper, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import type { SceneId } from '../store/useVerseStore'
import { useVerseStore } from '../store/useVerseStore'
import { ART } from '../assets'
import SoundControl from './SoundControl'

const destinations: { id: SceneId; title: string; subtitle: string; icon: typeof Flame; number: string }[] = [
  { id: 'diya', title: 'Diya Courtyard', subtitle: 'Light the lamps', icon: Flame, number: '01' },
  { id: 'rangoli', title: 'Rangoli Atelier', subtitle: 'Create your own pattern', icon: Flower2, number: '02' },
  { id: 'fireworks', title: 'Fireworks Terrace', subtitle: 'Paint the night sky', icon: PartyPopper, number: '03' },
  { id: 'bazaar', title: 'Sweet Bazaar', subtitle: 'Play & collect sweets', icon: Gift, number: '04' },
  { id: 'lanterns', title: 'Lantern Ghat', subtitle: 'Send a wish skyward', icon: Heart, number: '05' },
  { id: 'greetings', title: 'Greeting Pavilion', subtitle: 'Make it personal', icon: ArrowUpRight, number: '06' },
]

export default function MobileDeepavaliWorld() {
  const setScene = useVerseStore(s => s.setScene)
  const litDiyas = useVerseStore(s => s.litDiyas)
  const wishes = useVerseStore(s => s.wishes)
  const fullscreen = () => {
    if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.()
    else void document.exitFullscreen?.()
  }
  const progress = Math.min(14, litDiyas.length)
  return <main className="mobile-verse">
    <header className="mobile-verse-header">
      <button className="mobile-verse-brand" onClick={() => setScene('courtyard')} aria-label="Deepavali Verse home">
        <span><Flame size={20}/></span><b>DEEPAVALI <i>VERSE</i></b>
      </button>
      <div className="mobile-verse-header-actions"><SoundControl/><button onClick={fullscreen} aria-label="Toggle fullscreen"><Maximize2 size={17}/></button></div>
    </header>

    <section className="mobile-verse-hero">
      <img src={ART.terrace} alt="" className="mobile-verse-art" fetchPriority="high"/>
      <div className="mobile-verse-art-grade"/>
      <div className="mobile-verse-hero-copy">
        <motion.div className="mobile-verse-eyebrow" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>✦ &nbsp; A FESTIVAL OF LIGHTS &nbsp; ✦</motion.div>
        <motion.h1 initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.08}}>A night woven<br/>with <em>wonder.</em></motion.h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}}>Follow the lamps through a palace of colour, craft and celebration.</motion.p>
        <button className="mobile-verse-cta" onClick={() => setScene('diya')}>Find the first flame <ArrowUpRight size={17}/></button>
      </div>
      <div className="mobile-verse-art-caption"><span>THE PALACE OF A THOUSAND LIGHTS</span><span>01 / 06</span></div>
    </section>

    <section className="mobile-verse-discover">
      <div className="mobile-verse-section-heading"><div><span>YOUR FESTIVAL, YOUR WAY</span><h2>Choose a little <em>wonder.</em></h2></div><Sparkles size={22}/></div>
      <div className="mobile-verse-destinations">
        {destinations.map((item, index) => {
          const Icon = item.icon
          return <motion.button key={item.id} className="mobile-verse-destination" onClick={() => setScene(item.id)} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{delay:index*.045}}>
            <span className="mobile-verse-destination-number">{item.number}</span>
            <span className="mobile-verse-destination-icon"><Icon size={22} strokeWidth={1.6}/></span>
            <span className="mobile-verse-destination-copy"><b>{item.title}</b><small>{item.subtitle}</small></span>
            <span className="mobile-verse-destination-arrow"><ArrowUpRight size={17}/></span>
          </motion.button>
        })}
      </div>
    </section>

    <section className="mobile-verse-trail">
      <div className="mobile-verse-trail-icon"><Flame size={20}/></div>
      <div className="mobile-verse-trail-content"><div><span>YOUR FESTIVAL TRAIL</span><b>{String(progress).padStart(2,'0')} <small>/ 14</small></b></div><i><span style={{width:(progress/14*100)+'%'}}/></i><p>Light a diya and leave your mark. {wishes.length ? 'Your wishes are glowing in the night.' : 'Your little moments are saved as you explore.'}</p></div>
    </section>
    <footer className="mobile-verse-footer"><span>DEEPAVALI · A TIME TO SHINE</span><span>MADE OF LIGHT & WONDER ✦</span></footer>
  </main>
}

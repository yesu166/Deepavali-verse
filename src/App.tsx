import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import DeepavaliWorld from './components/DeepavaliWorld'
import MobileDeepavaliWorld from './components/MobileDeepavaliWorld'
import ExperienceScene from './scenes/ExperienceScene'
import { useVerseStore } from './store/useVerseStore'
import { soundEngine } from './lib/soundEngine'

function useMobileLayout() {
 const [mobile,setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches)
 useEffect(() => {
  const media = window.matchMedia('(max-width: 760px)')
  const update = () => setMobile(media.matches)
  update()
  media.addEventListener?.('change',update)
  return () => media.removeEventListener?.('change',update)
 },[])
 return mobile
}
function useFestivalSound() {
 const setEnabled = useVerseStore(s => s.setSoundEnabled)
 useEffect(() => {
  let started = false
  const start = () => {
   if (started) return
   started = true
   void soundEngine.enable().then(() => setEnabled(true)).catch(() => setEnabled(false))
   window.removeEventListener('pointerdown',start)
   window.removeEventListener('keydown',start)
   window.removeEventListener('touchstart',start)
  }
  void soundEngine.enable().then(() => setEnabled(true)).catch(() => setEnabled(false))
  window.addEventListener('pointerdown',start,{once:true})
  window.addEventListener('keydown',start,{once:true})
  window.addEventListener('touchstart',start,{once:true,passive:true})
  return () => {
   window.removeEventListener('pointerdown',start)
   window.removeEventListener('keydown',start)
   window.removeEventListener('touchstart',start)
  }
 },[setEnabled])
}
export default function App() {
 const scene=useVerseStore(s=>s.scene)
 const mobile=useMobileLayout()
 useFestivalSound()
 return <div className="app-root"><AnimatePresence mode="wait">{scene==='courtyard'?(mobile?<MobileDeepavaliWorld key="mobile-courtyard"/>:<DeepavaliWorld key="desktop-courtyard"/>):<ExperienceScene key={scene} scene={scene}/>}</AnimatePresence></div>
}

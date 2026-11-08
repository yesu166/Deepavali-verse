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
  let unlocked = false
  const removeUnlockListeners = () => {
   window.removeEventListener('pointerdown',unlock)
   window.removeEventListener('keydown',unlock)
   window.removeEventListener('touchstart',unlock)
  }
  const unlock = () => {
   if (unlocked) return
   // Called directly from a real user gesture so mobile browsers can unlock Web Audio.
   void soundEngine.enable().then(() => {
    unlocked = true
    setEnabled(true)
    removeUnlockListeners()
   }).catch(() => setEnabled(false))
  }
  const resumeIfNeeded = () => {
   if (document.visibilityState === 'visible' && soundEngine.isEnabled) {
    void soundEngine.enable().then(() => setEnabled(true)).catch(() => setEnabled(false))
   }
  }
  // Try immediately on browsers that permit autoplay; otherwise the first touch/click unlocks it.
  void soundEngine.enable().then(() => { unlocked = true; setEnabled(true); removeUnlockListeners() }).catch(() => setEnabled(false))
  window.addEventListener('pointerdown',unlock)
  window.addEventListener('keydown',unlock)
  window.addEventListener('touchstart',unlock,{passive:true})
  document.addEventListener('visibilitychange',resumeIfNeeded)
  return () => {
   removeUnlockListeners()
   document.removeEventListener('visibilitychange',resumeIfNeeded)
  }
 },[setEnabled])
}
export default function App() {
 const scene=useVerseStore(s=>s.scene)
 const mobile=useMobileLayout()
 useFestivalSound()
 return <div className="app-root"><AnimatePresence mode="wait">{scene==='courtyard'?(mobile?<MobileDeepavaliWorld key="mobile-courtyard"/>:<DeepavaliWorld key="desktop-courtyard"/>):<ExperienceScene key={scene} scene={scene}/>}</AnimatePresence></div>
}

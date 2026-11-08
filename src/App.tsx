import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import DeepavaliWorld from './components/DeepavaliWorld'
import MobileDeepavaliWorld from './components/MobileDeepavaliWorld'
import ExperienceScene from './scenes/ExperienceScene'
import { useVerseStore } from './store/useVerseStore'

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
export default function App() {
 const scene=useVerseStore(s=>s.scene)
 const mobile=useMobileLayout()
 return <div className="app-root"><AnimatePresence mode="wait">{scene==='courtyard'?(mobile?<MobileDeepavaliWorld key="mobile-courtyard"/>:<DeepavaliWorld key="desktop-courtyard"/>):<ExperienceScene key={scene} scene={scene}/>}</AnimatePresence></div>
}

import { AnimatePresence } from 'framer-motion'
import DeepavaliWorld from './components/DeepavaliWorld'
import ExperienceScene from './scenes/ExperienceScene'
import { useVerseStore } from './store/useVerseStore'
export default function App() {
 const scene=useVerseStore(s=>s.scene)
 return <div className="app-root"><AnimatePresence mode="wait">{scene==='courtyard'?<DeepavaliWorld key="courtyard"/>:<ExperienceScene key={scene} scene={scene}/>}</AnimatePresence></div>
}
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
export default function SceneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <motion.section className={`scene-frame ${className}`} initial={{opacity:0,scale:1.015}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.985}} transition={{duration:.55,ease:[.22,1,.36,1]}}>{children}</motion.section>
}
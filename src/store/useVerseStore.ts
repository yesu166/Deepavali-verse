import { create } from 'zustand'

export type SceneId = 'courtyard' | 'diya' | 'rangoli' | 'fireworks' | 'bazaar' | 'lanterns' | 'greetings'
type VerseState = {
  scene: SceneId
  litDiyas: number[]
  score: number
  bestScore: number
  wishes: string[]
  soundEnabled: boolean
  setScene: (scene: SceneId) => void
  lightDiya: (id: number) => void
  addScore: (points: number) => void
  saveWish: (wish: string) => void
  toggleSound: () => void
  setSoundEnabled: (enabled: boolean) => void
}
const readNumber = (key: string) => {
  try { return Number(localStorage.getItem(key) || 0) } catch { return 0 }
}
const readArray = <T,>(key: string, fallback: T[]): T[] => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T[] : fallback } catch { return fallback }
}
export const useVerseStore = create<VerseState>((set, get) => ({
  scene: 'courtyard',
  litDiyas: readArray<number>('verse-lit-diyas', []),
  score: 0,
  bestScore: readNumber('verse-best-score'),
  wishes: readArray<string>('verse-wishes', []),
  soundEnabled: false,
  setScene: (scene) => set({ scene }),
  lightDiya: (id) => {
    const litDiyas = [...new Set([...get().litDiyas, id])]
    try { localStorage.setItem('verse-lit-diyas', JSON.stringify(litDiyas)) } catch { /* storage may be unavailable */ }
    set({ litDiyas })
  },
  addScore: (points) => {
    const score = get().score + points
    const bestScore = Math.max(score, get().bestScore)
    try { localStorage.setItem('verse-best-score', String(bestScore)) } catch { /* storage may be unavailable */ }
    set({ score, bestScore })
  },
  saveWish: (wish) => {
    const wishes = [...get().wishes, wish].slice(-30)
    try { localStorage.setItem('verse-wishes', JSON.stringify(wishes)) } catch { /* storage may be unavailable */ }
    set({ wishes })
  },
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
}))
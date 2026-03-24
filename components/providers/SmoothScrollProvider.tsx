'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LenisContext = createContext<any>(null)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lenis, setLenis] = useState<any>(null)
  const rafId = useRef<number>()

  useEffect(() => {
    let lenisInstance: any

    async function init() {
      const { default: Lenis } = await import('@studio-freight/lenis')
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)

      lenisInstance = new Lenis({
        duration:        1.4,
        easing:          (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel:     true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.5,
        infinite:        false,
      })

      // Connect Lenis → GSAP ticker
      const ticker = (time: number) => lenisInstance.raf(time * 1000)
      gsap.ticker.add(ticker)
      gsap.ticker.lagSmoothing(0)

      // Keep ScrollTrigger in sync
      lenisInstance.on('scroll', ScrollTrigger.update)

      setLenis(lenisInstance)

      return () => {
        gsap.ticker.remove(ticker)
        lenisInstance.destroy()
      }
    }

    const cleanup = init()

    return () => {
      cleanup.then(fn => fn?.())
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}

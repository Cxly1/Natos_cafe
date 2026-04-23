'use client'

import { useEffect, useRef, useState } from 'react'

export default function Preloader() {
  const [hidden, setHidden] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const letterNRef   = useRef<HTMLSpanElement>(null)
  const letterCRef   = useRef<HTMLSpanElement>(null)
  const dotRef       = useRef<HTMLSpanElement>(null)
  const taglineRef   = useRef<HTMLParagraphElement>(null)
  const barRef       = useRef<HTMLDivElement>(null)
  const counterRef   = useRef<HTMLSpanElement>(null)
  const maskRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.remove('no-scroll')
      setHidden(true)
      return
    }

    async function run() {
      const { gsap } = await import('gsap')

      const tl = gsap.timeline()

      // Set initial states
      gsap.set([letterNRef.current, letterCRef.current], { y: 60, opacity: 0, skewY: 6 })
      gsap.set(dotRef.current,     { scale: 0, opacity: 0, rotate: 0 })
      gsap.set(taglineRef.current, { y: 10, opacity: 0 })
      gsap.set(barRef.current,     { width: '0%' })
      gsap.set(maskRef.current,    { yPercent: 0 })

      // Trompo spin — runs in parallel, will be killed when element unmounts
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          rotate: 360,
          duration: 2.6,
          ease: 'none',
          repeat: -1,
        })
      }

      tl
        // Letters slide in
        .to(letterNRef.current, {
          y: 0, opacity: 1, skewY: 0,
          duration: 0.8, ease: 'expo.out',
        }, 0)
        .to(letterCRef.current, {
          y: 0, opacity: 1, skewY: 0,
          duration: 0.8, ease: 'expo.out',
        }, 0.15)
        .to(dotRef.current, {
          scale: 1, opacity: 1,
          duration: 0.5, ease: 'back.out(2)',
        }, 0.3)
        .to(taglineRef.current, {
          y: 0, opacity: 1,
          duration: 0.6, ease: 'expo.out',
        }, 0.4)

        // Progress bar fills + counter counts
        .to(barRef.current, {
          width: '100%',
          duration: 1.8,
          ease: 'power2.inOut',
          onUpdate: function () {
            if (counterRef.current) {
              counterRef.current.textContent = Math.round(this.progress() * 100) + '%'
            }
          },
        }, 0.5)

        // Hold
        .to({}, { duration: 0.3 })

        // Mask sweeps upward — revealing the page
        .to(maskRef.current, {
          yPercent: -100,
          duration: 1.0,
          ease: 'expo.inOut',
        })

        // Fade out preloader
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            document.body.classList.remove('no-scroll')
            setHidden(true)
          },
        }, '-=0.1')
    }

    run()
  }, [])

  if (hidden) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Logo */}
      <div className="text-center">
        <div className="font-display text-[clamp(4rem,10vw,9rem)] font-light text-accent leading-none tracking-widest flex items-center gap-[0.08em]">
          <span ref={letterNRef} style={{ opacity: 0 }}>E</span>
          <span
            ref={dotRef}
            style={{ opacity: 0, display: 'inline-block' }}
            className="text-saffron"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[0.55em] h-[0.55em]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* piña top */}
              <path d="M12 2.5 L10.5 4.5 L13.5 4.5 Z" fill="currentColor" />
              <path d="M12 4.5 L12 6" />
              {/* trompo cone */}
              <path d="M7 7 L17 7 L14.5 19 L9.5 19 Z" fill="currentColor" opacity="0.85" />
              {/* stripes */}
              <path d="M8 10 L16 10" stroke="#130a05" strokeWidth="0.8" />
              <path d="M8.3 13 L15.7 13" stroke="#130a05" strokeWidth="0.8" />
              <path d="M8.7 16 L15.3 16" stroke="#130a05" strokeWidth="0.8" />
              {/* base */}
              <path d="M9 19 L15 19 L14.2 21 L9.8 21 Z" fill="currentColor" />
            </svg>
          </span>
          <span ref={letterCRef} style={{ opacity: 0 }}>J</span>
        </div>
        <p
          ref={taglineRef}
          style={{ opacity: 0 }}
          className="font-body text-xs-f tracking-[0.3em] uppercase text-text-muted mt-4"
        >
          Taquería Tradicional
        </p>
      </div>

      {/* Progress bar + counter */}
      <div className="absolute bottom-12 left-[var(--pad)] right-[var(--pad)] flex items-center gap-6">
        <div className="flex-1 h-px bg-white/10 overflow-hidden">
          <div ref={barRef} className="h-full bg-accent" style={{ width: 0 }} />
        </div>
        <span ref={counterRef} className="font-body text-xs-f text-accent tracking-widest w-12 text-right">
          0%
        </span>
      </div>

      {/* Mask that sweeps upward */}
      <div ref={maskRef} className="absolute inset-0 bg-bg pointer-events-none" />
    </div>
  )
}

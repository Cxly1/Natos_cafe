'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useLenis } from '@/hooks/useLenis'
import MagneticButton from '@/components/ui/MagneticButton'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef      = useRef<HTMLDivElement>(null)
  const line1Ref   = useRef<HTMLSpanElement>(null)
  const line2Ref   = useRef<HTMLSpanElement>(null)
  const line3Ref   = useRef<HTMLSpanElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const lenis      = useLenis()

  function scrollToMenu() {
    const target = document.getElementById('menu')
    if (!target) return
    lenis ? lenis.scrollTo(target, { offset: -80 }) : target.scrollIntoView()
  }

  useEffect(() => {
    // Wait for preloader to finish (body.no-scroll is removed)
    function startWhenReady() {
      if (!document.body.classList.contains('no-scroll')) {
        runAnimations()
        return
      }
      const observer = new MutationObserver(() => {
        if (!document.body.classList.contains('no-scroll')) {
          observer.disconnect()
          runAnimations()
        }
      })
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    }

    async function runAnimations() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        // Initial states
        gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], { y: '110%' })
        gsap.set([eyebrowRef.current, ctaRef.current, indicatorRef.current], { opacity: 0, y: 20 })

        const tl = gsap.timeline({ delay: 0.1 })
        tl
          .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' })
          .to([line1Ref.current, line2Ref.current, line3Ref.current], {
            y: '0%', duration: 1.1, stagger: 0.1, ease: 'expo.out',
          }, '-=0.5')
          .to(ctaRef.current,       { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.6')
          .to(indicatorRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, '-=0.4')

        // Background parallax
        if (bgRef.current) {
          gsap.to(bgRef.current, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          })
        }
      }, sectionRef)

      return () => ctx.revert()
    }

    startWhenReady()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen min-h-[600px] flex items-end overflow-hidden"
      style={{ paddingBottom: 'clamp(3rem, 8vh, 6rem)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={bgRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <Image
            src="https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=1800&q=80"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/55 to-bg/85" />

        {/* Steam wisps — ambient heat rising over the trompo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <span className="steam-wisp absolute left-[18%] bottom-[40%] w-16 h-20 rounded-full bg-saffron/15 blur-2xl" style={{ animationDelay: '0s' }} />
          <span className="steam-wisp absolute left-[32%] bottom-[36%] w-20 h-24 rounded-full bg-accent/15 blur-2xl" style={{ animationDelay: '1.2s' }} />
          <span className="steam-wisp absolute left-[46%] bottom-[42%] w-12 h-16 rounded-full bg-saffron/12 blur-2xl" style={{ animationDelay: '2.4s' }} />
          <span className="steam-wisp absolute left-[62%] bottom-[38%] w-20 h-24 rounded-full bg-accent/12 blur-2xl" style={{ animationDelay: '0.6s' }} />
          <span className="steam-wisp absolute left-[78%] bottom-[44%] w-14 h-18 rounded-full bg-saffron/14 blur-2xl" style={{ animationDelay: '3.0s' }} />
          <span className="steam-wisp absolute left-[10%] bottom-[48%] w-10 h-14 rounded-full bg-chile/10 blur-2xl" style={{ animationDelay: '4.1s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[var(--container)] mx-auto px-[var(--pad)]">
        {/* Eyebrow */}
        <div ref={eyebrowRef} className="flex items-center gap-2 font-body text-xs-f tracking-[0.25em] uppercase text-accent mb-8">
          <span>Guadalajara</span>
          <span className="text-text-muted">·</span>
          <span>Jalisco</span>
        </div>

        {/* Heading */}
        <h1
          className="font-display font-light leading-[0.9] tracking-[-0.02em] text-text mb-12"
          style={{ fontSize: 'var(--fs-hero)' }}
        >
          <span className="block overflow-hidden">
            <span ref={line1Ref} className="block" style={{ transform: 'translateY(110%)' }}>Los tacos</span>
          </span>
          <span className="block overflow-hidden">
            <span ref={line2Ref} className="block italic text-accent" style={{ transform: 'translateY(110%)' }}>que siempre</span>
          </span>
          <span className="block overflow-hidden">
            <span ref={line3Ref} className="block" style={{ transform: 'translateY(110%)' }}>soñaste probar.</span>
          </span>
        </h1>

        {/* CTA */}
        <div ref={ctaRef} style={{ opacity: 0 }}>
          <MagneticButton
            onClick={scrollToMenu}
            className="
              inline-flex items-center gap-3 px-8 py-4 rounded-full
              bg-accent text-bg font-body text-xs-f tracking-[0.12em] uppercase
              btn-fill-wipe overflow-hidden
            "
          >
            <span>Explorar Menú</span>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={indicatorRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="absolute right-[var(--pad)] bottom-12 hidden sm:flex flex-col items-center gap-2 z-10"
      >
        <span className="block w-px h-14 bg-accent animate-scroll-pulse origin-top" />
        <span
          className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-text-muted"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const menuItems = [
  {
    name: 'Espresso',
    price: '$45',
    desc: 'Doble shot, intenso y equilibrado. Nuestro blend estrella.',
    src: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80',
    alt: 'Espresso',
  },
  {
    name: 'Latte',
    price: '$65',
    desc: 'Espresso con leche texturizada a 65°C. Suave y cremoso.',
    src: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&q=80',
    alt: 'Latte',
  },
  {
    name: 'Cold Brew',
    price: '$70',
    desc: '18 horas de extracción en frío. Oscuro, limpio y refrescante.',
    src: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
    alt: 'Cold Brew',
  },
  {
    name: 'Cappuccino',
    price: '$60',
    desc: 'Espresso, leche y espuma en perfecta proporción italiana.',
    src: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80',
    alt: 'Cappuccino',
  },
  {
    name: 'Matcha Latte',
    price: '$75',
    desc: 'Ceremonial grade desde Uji, Japón. Terroso y profundo.',
    src: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&q=80',
    alt: 'Matcha Latte',
  },
  {
    name: 'Croissant',
    price: '$55',
    desc: 'Hojaldrado, mantequilloso y crujiente. Recién horneado.',
    src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
    alt: 'Croissant',
  },
]

export default function MenuSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([])

  // Horizontal scroll (desktop only)
  useEffect(() => {
    if (window.innerWidth <= 768) return

    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const track = trackRef.current!

        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
      }, sectionRef)

      return () => ctx.revert()
    }

    const cleanup = init()
    return () => { cleanup.then(fn => fn?.()) }
  }, [])

  // 3D tilt on menu cards
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    async function initTilt() {
      const { gsap } = await import('gsap')

      const cleanups: (() => void)[] = []

      cardRefs.current.forEach(card => {
        if (!card) return

        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width  - 0.5
          const y = (e.clientY - rect.top)  / rect.height - 0.5
          gsap.to(card, {
            rotateY:  x * 10,
            rotateX: -y * 10,
            transformPerspective: 900,
            duration: 0.4, ease: 'power2.out',
          })
        }
        const onLeave = () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'expo.out' })
        }

        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove)
          card.removeEventListener('mouseleave', onLeave)
        })
      })

      return () => cleanups.forEach(fn => fn())
    }

    const cleanup = initTilt()
    return () => { cleanup.then(fn => fn?.()) }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="menu"
      className="relative bg-bg"
      style={{ minHeight: '100vh' }}
    >
      {/* Header */}
      <div className="max-w-[var(--container)] mx-auto px-[var(--pad)] pt-24 pb-12">
        <span className="block font-body text-xs-f tracking-[0.25em] uppercase text-accent mb-4">
          Lo que hacemos bien
        </span>
        <h2
          className="font-display font-light leading-[0.95] text-text"
          style={{ fontSize: 'var(--fs-3xl)' }}
        >
          <span className="block">Nuestro</span>
          <em className="block text-accent">Menú</em>
        </h2>
      </div>

      {/* Horizontal track */}
      <div className="overflow-hidden w-full">
        <div
          ref={trackRef}
          className="flex gap-6 px-[var(--pad)] pb-20 w-max"
          style={{ willChange: 'transform' }}
        >
          {menuItems.map((item, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              className="
                flex-shrink-0 w-[clamp(240px,28vw,340px)]
                bg-bg-card rounded-2xl border border-white/5
                overflow-hidden will-change-transform
                hover:border-accent/30 transition-colors duration-300
              "
              style={{ transformStyle: 'preserve-3d', perspective: '900px' }}
            >
              {/* Image */}
              <div className="menu-img-zoom relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="340px"
                />
              </div>
              {/* Body */}
              <div className="p-6">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-display text-xl-f font-normal text-text">{item.name}</h3>
                  <span className="font-display text-lg-f text-accent font-light">{item.price}</span>
                </div>
                <p className="font-body text-sm-f text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}

          {/* End spacer */}
          <div className="flex-shrink-0 w-[var(--pad)]" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

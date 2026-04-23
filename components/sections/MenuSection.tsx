'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const menuItems = [
  {
    name: 'Al Pastor',
    price: '$28',
    desc: 'Cerdo marinado en achiote y guajillo, cortado al trompo. Con piña, cebolla y cilantro.',
    src: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&q=80',
    alt: 'Taco al pastor con piña',
  },
  {
    name: 'Suadero',
    price: '$32',
    desc: 'Res confitada en su propia grasa, dorada en el comal. Suave por dentro, crujiente en los bordes.',
    src: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600&q=80',
    alt: 'Taco de suadero dorado',
  },
  {
    name: 'Tripa',
    price: '$35',
    desc: 'Tripa de res crujiente, dorada al carbón. Para valientes, con limón y sal de gusano.',
    src: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=600&q=80',
    alt: 'Taco de tripa crujiente',
  },
  {
    name: 'Asada',
    price: '$38',
    desc: 'Arrachera marinada y asada al carbón. Guacamole molcajeteado y cebolla tatemada.',
    src: 'https://images.unsplash.com/photo-1565299715199-866c917206bb?w=600&q=80',
    alt: 'Taco de carne asada',
  },
  {
    name: 'Campechano',
    price: '$42',
    desc: 'La mezcla perfecta: pastor y suadero juntos, con un toque de chicharrón.',
    src: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=600&q=80',
    alt: 'Taco campechano',
  },
  {
    name: 'Cochinita',
    price: '$45',
    desc: 'Cerdo yucateco en achiote y naranja agria, cocido en hoja de plátano. Cebolla morada en vinagre.',
    src: 'https://images.unsplash.com/photo-1618040996337-11e27f8c5d94?w=600&q=80',
    alt: 'Taco de cochinita pibil',
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
          Lo que servimos
        </span>
        <h2
          className="font-display font-light leading-[0.95] text-text"
          style={{ fontSize: 'var(--fs-3xl)' }}
        >
          <span className="block">Nuestros</span>
          <em className="block text-accent">Tacos</em>
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
                menu-card
                flex-shrink-0 w-[clamp(240px,28vw,340px)]
                bg-bg-card rounded-2xl border border-white/5
                overflow-hidden will-change-transform
                hover:border-accent/40 transition-[border-color,box-shadow] duration-500
                hover:shadow-[0_0_48px_rgba(240,122,43,0.22)]
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
                  <span className="relative font-display text-lg-f text-saffron font-light">
                    {/* Flame behind price — visible on hover via .menu-card:hover .flame-wrap */}
                    <span
                      className="flame-wrap absolute -inset-x-2 -inset-y-1 flex items-center justify-center pointer-events-none"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 32 40" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <radialGradient id={`flame-grad-${i}`} cx="50%" cy="70%" r="60%">
                            <stop offset="0%"  stopColor="#f5b841" stopOpacity="0.9" />
                            <stop offset="55%" stopColor="#f07a2b" stopOpacity="0.65" />
                            <stop offset="100%" stopColor="#c8321a" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                        <path
                          d="M16 2 C20 10 27 14 26 24 C25 33 19 38 16 38 C13 38 7 33 6 24 C5 14 12 10 16 2 Z"
                          fill={`url(#flame-grad-${i})`}
                        />
                      </svg>
                    </span>
                    <span className="relative">{item.price}</span>
                  </span>
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

'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const cards = [
  {
    num: '01',
    title: 'Nuestra',
    titleItalic: 'Historia',
    body: 'Desde 2013 en una esquina de Guadalajara. La receta del abuelo, el carbón bien prendido y la tortilla recién hecha. Nada de atajos.',
    src: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1600&q=80',
    alt: 'Historia de El Jefe Tacos',
  },
  {
    num: '02',
    title: 'Nuestros',
    titleItalic: 'Tacos',
    body: 'Trompo de pastor girando desde las 6 de la tarde. Adobo de achiote, chile guajillo y piña fresca al corte. Sin atajos, sin compromiso.',
    src: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=1600&q=80',
    alt: 'Trompo de pastor al carbón',
  },
  {
    num: '03',
    title: 'Nuestras',
    titleItalic: 'Salsas',
    body: 'Seis salsas hechas en molcajete cada mañana. De la verde cruda a la roja tatemada. Seis niveles, seis personalidades. Pruébalas todas.',
    src: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=1600&q=80',
    alt: 'Salsas en molcajete',
  },
]

export default function CardStack() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const isMobile = window.innerWidth <= 768

    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        cardRefs.current.forEach((card, i) => {
          if (!card) return
          const lines = card.querySelectorAll<HTMLElement>('.card-line')
          const body  = card.querySelector<HTMLElement>('.card-body')

          // Content reveal as card enters viewport
          gsap.fromTo(lines,
            { y: '110%' },
            {
              y: '0%', duration: 1.0, stagger: 0.1, ease: 'expo.out',
              scrollTrigger: { trigger: card, start: 'top 80%', once: true },
            }
          )
          if (body) {
            gsap.fromTo(body,
              { opacity: 0, y: 20 },
              {
                opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', delay: 0.3,
                scrollTrigger: { trigger: card, start: 'top 70%', once: true },
              }
            )
          }

          // Skiper UI: scale back when next card enters
          if (!isMobile && i < cardRefs.current.length - 1) {
            const nextCard = cardRefs.current[i + 1]
            if (nextCard) {
              gsap.to(card, {
                scale: 0.9,
                filter: 'brightness(0.5) blur(2px)',
                ease: 'none',
                scrollTrigger: {
                  trigger: nextCard,
                  start: 'top bottom',
                  end: 'top top',
                  scrub: true,
                },
              })
            }
          }

          // Subtle parallax on background image
          const bg = card.querySelector<HTMLElement>('.card-bg')
          if (bg) {
            gsap.to(bg, {
              yPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            })
          }
        })
      }, sectionRef)

      return () => ctx.revert()
    }

    const cleanup = init()
    return () => { cleanup.then(fn => fn?.()) }
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="relative">
      {cards.map((card, i) => (
        <div
          key={i}
          ref={el => { cardRefs.current[i] = el }}
          className="stack-card"
        >
          {/* Background image */}
          <div className="card-bg absolute inset-0 w-full h-[110%] -top-[5%]">
            <Image
              src={card.src}
              alt={card.alt}
              fill
              className="object-cover"
              loading="lazy"
              sizes="100vw"
            />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-bg/70 via-bg/30 to-bg/60" />

          {/* Content */}
          <div className="absolute bottom-[clamp(3rem,8vh,6rem)] left-[var(--pad)] max-w-2xl z-10">
            <span className="block font-body text-xs-f tracking-[0.3em] uppercase text-accent mb-4">
              {card.num}
            </span>
            <h2
              className="font-display font-light leading-[0.9] tracking-[-0.02em] text-text mb-6"
              style={{ fontSize: 'var(--fs-3xl)' }}
            >
              <span className="block overflow-hidden">
                <span className="card-line block" style={{ transform: 'translateY(110%)' }}>{card.title}</span>
              </span>
              <span className="block overflow-hidden">
                <span className="card-line block italic text-accent" style={{ transform: 'translateY(110%)' }}>{card.titleItalic}</span>
              </span>
            </h2>
            <p
              className="card-body font-body text-sm-f text-text-muted leading-relaxed max-w-md"
              style={{ opacity: 0 }}
            >
              {card.body}
            </p>
          </div>

          {/* Large background number */}
          <div
            className="absolute top-[var(--nav-h)] right-[var(--pad)] font-display font-light leading-none select-none pointer-events-none"
            style={{ fontSize: 'clamp(6rem, 14vw, 16rem)', color: 'rgba(240,122,43,0.08)' }}
            aria-hidden="true"
          >
            {card.num}
          </div>
        </div>
      ))}
    </section>
  )
}

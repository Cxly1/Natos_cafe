'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import MagneticButton from '@/components/ui/MagneticButton'
import { useLenis } from '@/hooks/useLenis'

const STATEMENT =
  'Creemos que un taco no es solo comida — es un ritual de barrio, una esquina llena de humo, un momento donde la ciudad se detiene a cenar.'

const stats = [
  { label: 'Reseñas',   value: 812,  decimal: false },
  { label: 'Estrellas', value: 4.8,  decimal: true  },
  { label: 'Años',      value: 12,   decimal: false, plus: true },
]

export default function About() {
  const sectionRef   = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLParagraphElement>(null)
  const imgRef       = useRef<HTMLDivElement>(null)
  const textRef      = useRef<HTMLDivElement>(null)
  const statRefs     = useRef<(HTMLSpanElement | null)[]>([])
  const lenis        = useLenis()

  function scrollToContact() {
    const el = document.getElementById('contact')
    if (!el) return
    lenis ? lenis.scrollTo(el, { offset: -80 }) : el.scrollIntoView()
  }

  useEffect(() => {
    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        // Word scrub — split statement into spans
        const el = statementRef.current
        if (el) {
          const words = el.textContent!.trim().split(/\s+/)
          el.innerHTML = words.map(w => `<span class="inline-block opacity-[0.1]">${w}</span>`).join(' ')

          gsap.to(el.querySelectorAll('span'), {
            opacity: 1,
            stagger: 0.06,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              end: 'bottom 35%',
              scrub: 0.6,
            },
          })
        }

        // Image slide from left
        if (imgRef.current) {
          gsap.fromTo(imgRef.current,
            { x: -60, opacity: 0 },
            {
              x: 0, opacity: 1, duration: 1.2, ease: 'expo.out',
              scrollTrigger: { trigger: imgRef.current, start: 'top 80%', once: true },
            }
          )
        }

        // Text col fade-up
        if (textRef.current) {
          gsap.fromTo(textRef.current,
            { y: 50, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 1.0, ease: 'expo.out',
              scrollTrigger: { trigger: textRef.current, start: 'top 80%', once: true },
            }
          )
        }

        // Stat counters
        stats.forEach((stat, i) => {
          const el = statRefs.current[i]
          if (!el) return
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.fromTo(
                { val: 0 },
                { val: stat.value },
                {
                  duration: 1.6,
                  ease: 'power2.out',
                  onUpdate: function () {
                    const v = this.targets()[0].val
                    el.textContent = stat.decimal
                      ? v.toFixed(1)
                      : Math.round(v).toString()
                  },
                }
              )
            },
          })
        })
      }, sectionRef)

      return () => ctx.revert()
    }

    const cleanup = init()
    return () => { cleanup.then(fn => fn?.()) }
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-32 bg-bg">
      <div className="max-w-[var(--container)] mx-auto px-[var(--pad)]">

        {/* Statement with word scrub */}
        <div className="border-t border-white/5 pt-20 mb-32">
          <p
            ref={statementRef}
            className="font-display font-light leading-[1.4] tracking-[-0.01em] text-text"
            style={{ fontSize: 'var(--fs-xl)' }}
          >
            {STATEMENT}
          </p>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image */}
          <div ref={imgRef} style={{ opacity: 0 }}>
            <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: '3/4' }}>
              <Image
                src="https://images.unsplash.com/photo-1562059390-a761a084768e?w=800&q=80"
                alt="El taquero trabajando en el comal"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-expo"
                loading="lazy"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Text */}
          <div ref={textRef} className="py-8 lg:py-16" style={{ opacity: 0 }}>
            <span className="block font-body text-xs-f tracking-[0.25em] uppercase text-accent mb-6">
              Taquería de barrio · 2013
            </span>
            <p className="font-body text-sm-f text-text-muted leading-relaxed mb-6">
              Desde 2013 en una esquina de Guadalajara, El Jefe Tacos nació con la receta del abuelo
              y una obsesión sencilla: honrar al taco. Carne fresca, tortilla recién hecha, salsa tatemada.
            </p>
            <p className="font-body text-sm-f text-text-muted leading-relaxed mb-10">
              Aquí todo se hace a la antigua — masa nixtamalizada, carbón real encendido desde la tarde,
              salsas de molcajete cada mañana. Doce años después, la esquina sigue llena cada noche.
            </p>

            {/* Stats */}
            <div className="flex gap-10 py-8 border-y border-white/5 mb-10">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-0.5">
                    <span
                      ref={el => { statRefs.current[i] = el }}
                      className="font-display font-light text-accent leading-none"
                      style={{ fontSize: 'var(--fs-2xl)' }}
                    >
                      0
                    </span>
                    {stat.plus && (
                      <span className="font-display font-light text-accent" style={{ fontSize: 'var(--fs-lg)' }}>+</span>
                    )}
                  </div>
                  <span className="font-body text-xs-f tracking-[0.15em] uppercase text-text-muted">{stat.label}</span>
                </div>
              ))}
            </div>

            <MagneticButton
              onClick={scrollToContact}
              className="
                inline-flex items-center gap-3 px-7 py-3.5 rounded-full
                border border-white/10 text-text font-body text-xs-f tracking-[0.12em] uppercase
                hover:border-accent hover:text-accent transition-colors duration-300
              "
            >
              Encuéntranos
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}

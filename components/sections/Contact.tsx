'use client'

import { useEffect, useRef } from 'react'

const details = [
  {
    label: 'Dirección',
    content: 'Av. Fray Antonio Alcalde 1043\nArtesanos, 44200 Guadalajara, Jal.\nEsquina con La Normal',
    isLink: false,
  },
  {
    label: 'Horario',
    content: 'Mar–Dom: 2pm – 1am\nLunes: cerrado',
    isLink: false,
  },
  {
    label: 'Teléfono',
    content: '33 1306 8655',
    href: 'tel:3313068655',
    isLink: true,
  },
  {
    label: 'Instagram',
    content: '@eljefetacos',
    href: 'https://instagram.com/eljefetacos',
    isLink: true,
    external: true,
  },
]

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const detailRefs  = useRef<(HTMLDivElement | null)[]>([])
  const mapRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        // Heading wipe
        if (headingRef.current) {
          gsap.fromTo(headingRef.current,
            { clipPath: 'inset(0 100% 0 0)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 1.1, ease: 'expo.out',
              scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
            }
          )
        }

        // Detail items stagger
        const els = detailRefs.current.filter(Boolean)
        if (els.length) {
          gsap.to(els, {
            y: 0, opacity: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: { trigger: els[0], start: 'top 80%', once: true },
          })
        }

        // Map fade-up
        if (mapRef.current) {
          gsap.fromTo(mapRef.current,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 1.0, ease: 'expo.out',
              scrollTrigger: { trigger: mapRef.current, start: 'top 80%', once: true },
            }
          )
        }
      }, sectionRef)

      return () => ctx.revert()
    }

    const cleanup = init()
    return () => { cleanup.then(fn => fn?.()) }
  }, [])

  return (
    <section ref={sectionRef} id="contact" className="py-32 border-t border-white/5 bg-bg">
      <div className="max-w-[var(--container)] mx-auto px-[var(--pad)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Info column */}
          <div>
            <h2
              ref={headingRef}
              className="font-display font-light text-text leading-[1] mb-16 overflow-hidden"
              style={{ fontSize: 'var(--fs-3xl)', clipPath: 'inset(0 100% 0 0)' }}
            >
              <span className="block">Ven a</span>
              <em className="block text-accent">Visitarnos</em>
            </h2>

            <div className="flex flex-col gap-10">
              {details.map((d, i) => (
                <div
                  key={i}
                  ref={el => { detailRefs.current[i] = el }}
                  className="flex flex-col gap-2"
                  style={{ opacity: 0, transform: 'translateY(30px)' }}
                >
                  <span className="font-body text-xs-f tracking-[0.2em] uppercase text-accent">
                    {d.label}
                  </span>
                  {d.isLink ? (
                    <a
                      href={d.href}
                      target={d.external ? '_blank' : undefined}
                      rel={d.external ? 'noopener noreferrer' : undefined}
                      className="font-body text-sm-f text-text hover:text-accent transition-colors duration-300 leading-relaxed"
                    >
                      {d.content}
                    </a>
                  ) : (
                    <p className="font-body text-sm-f text-text leading-relaxed whitespace-pre-line">
                      {d.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Map column */}
          <div ref={mapRef} style={{ opacity: 0 }}>
            <div
              className="overflow-hidden rounded-2xl border border-white/5"
              style={{ height: 'clamp(300px, 50vh, 500px)' }}
            >
              <iframe
                title="Ubicación El Jefe Tacos"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.972!2d-103.354!3d20.6832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428ae4b8ea5d37b%3A0x0!2sAv.%20Fray%20Antonio%20Alcalde%201043%2C%20Artesanos%2C%2044200%20Guadalajara%2C%20Jal.!5e0!3m2!1ses!2smx!4v1700000000000"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'invert(90%) hue-rotate(180deg) saturate(0.35) brightness(0.9)',
                  display: 'block',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="flex items-center gap-2 mt-4 font-body text-xs-f text-text-muted">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-accent shrink-0" fill="currentColor" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
              Av. Fray Antonio Alcalde 1043 · Esquina con La Normal
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

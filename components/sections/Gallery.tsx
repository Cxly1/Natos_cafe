'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const colLeft = [
  { src: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80', alt: 'Interior del café', aspect: '4/3' },
  { src: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80', alt: 'Granos de café',    aspect: '4/3' },
]
const colCenter = [
  { src: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80', alt: 'Barista trabajando', aspect: '3/4.5' },
]
const colRight = [
  { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', alt: 'Café con luz natural', aspect: '4/3' },
  { src: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80', alt: 'Taza de café',         aspect: '4/3' },
]

function GalleryImage({ src, alt, aspect }: { src: string; alt: string; aspect: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      gsap.to(wrapRef.current, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top 88%',
          once: true,
        },
      })
    }
    init()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="gallery-zoom relative overflow-hidden rounded-lg"
      style={{
        aspectRatio: aspect,
        clipPath: 'inset(100% 0 0 0)',
      }}
    >
      <Image src={src} alt={alt} fill className="object-cover" loading="lazy" sizes="(max-width:768px) 100vw, 33vw" />
    </div>
  )
}

export default function Gallery() {
  const leftRef   = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  const rightRef  = useRef<HTMLDivElement>(null)
  const gridRef   = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Heading wipe
  useEffect(() => {
    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

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

      // Parallax columns (desktop only)
      if (window.innerWidth > 768) {
        const cols = [
          { ref: leftRef,   yPercent: -12 },
          { ref: centerRef, yPercent: -22 },
          { ref: rightRef,  yPercent:   8 },
        ]
        cols.forEach(({ ref, yPercent }) => {
          if (!ref.current) return
          gsap.to(ref.current, {
            yPercent,
            ease: 'none',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        })
      }
    }
    init()
  }, [])

  return (
    <section id="gallery" className="py-32 overflow-hidden bg-bg">
      <div className="max-w-[var(--container)] mx-auto px-[var(--pad)]">
        {/* Heading */}
        <div className="mb-16">
          <h2
            ref={headingRef}
            className="font-display font-light text-text leading-[1] overflow-hidden"
            style={{ fontSize: 'var(--fs-3xl)', clipPath: 'inset(0 100% 0 0)' }}
          >
            La <em className="text-accent">Atmósfera</em>
          </h2>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div ref={leftRef} className="flex flex-col gap-6 will-change-transform">
            {colLeft.map((img, i) => <GalleryImage key={i} {...img} />)}
          </div>
          <div ref={centerRef} className="flex flex-col gap-6 md:-mt-16 will-change-transform">
            {colCenter.map((img, i) => <GalleryImage key={i} {...img} />)}
          </div>
          <div ref={rightRef} className="flex flex-col gap-6 will-change-transform">
            {colRight.map((img, i) => <GalleryImage key={i} {...img} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

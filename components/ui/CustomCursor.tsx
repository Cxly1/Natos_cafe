'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hidden on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const dot  = dotRef.current!
    const ring = ringRef.current!

    let gsapInstance: any

    async function init() {
      const { gsap } = await import('gsap')
      gsapInstance = gsap

      // Start at center so no flash
      gsap.set([dot, ring], { x: window.innerWidth / 2, y: window.innerHeight / 2 })
      dot.style.opacity  = '1'
      ring.style.opacity = '0.7'

      // Mouse tracking
      const onMove = (e: MouseEvent) => {
        gsap.set(dot, { x: e.clientX, y: e.clientY })
        gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.18, ease: 'power2.out' })
      }

      // Scale on click
      const onDown = () => gsap.to(dot, { scale: 2.5, duration: 0.15, ease: 'power2.out' })
      const onUp   = () => gsap.to(dot, { scale: 1,   duration: 0.25, ease: 'elastic.out(1, 0.5)' })

      // Hover on interactive elements — event delegation
      const onOver = (e: MouseEvent) => {
        const target = e.target as Element
        if (target.closest('a, button, [data-cursor-hover]')) {
          ring.classList.add('is-hovered')
        }
      }
      const onOut = (e: MouseEvent) => {
        const target = e.target as Element
        if (target.closest('a, button, [data-cursor-hover]')) {
          ring.classList.remove('is-hovered')
        }
      }

      document.addEventListener('mousemove',  onMove)
      document.addEventListener('mousedown',  onDown)
      document.addEventListener('mouseup',    onUp)
      document.addEventListener('mouseover',  onOver)
      document.addEventListener('mouseout',   onOut)

      return () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mousedown', onDown)
        document.removeEventListener('mouseup',   onUp)
        document.removeEventListener('mouseover', onOver)
        document.removeEventListener('mouseout',  onOut)
      }
    }

    const cleanup = init()
    return () => { cleanup.then(fn => fn?.()) }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="
          fixed top-0 left-0 z-[10000] pointer-events-none
          w-2 h-2 rounded-full bg-accent
          -translate-x-1/2 -translate-y-1/2 will-change-transform
          [transition:width_0.3s,height_0.3s]
          [@media(hover:none)]:hidden
        "
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="
          fixed top-0 left-0 z-[10000] pointer-events-none
          w-10 h-10 rounded-full border border-accent/70
          -translate-x-1/2 -translate-y-1/2 will-change-transform
          transition-[width,height,opacity,border-color] duration-300
          [&.is-hovered]:w-14 [&.is-hovered]:h-14 [&.is-hovered]:opacity-40
          [&.is-hovered]:mix-blend-difference
          [@media(hover:none)]:hidden
        "
      />
    </>
  )
}

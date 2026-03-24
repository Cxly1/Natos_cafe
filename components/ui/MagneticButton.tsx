'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  as?: 'button' | 'a'
  href?: string
  onClick?: () => void
  target?: string
  rel?: string
  'data-scroll-to'?: string
  type?: 'button' | 'submit'
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.38,
  as: Tag = 'button',
  ...props
}: MagneticButtonProps) {
  const elRef   = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const el    = elRef.current!
    const inner = innerRef.current

    let gsapInstance: any

    async function init() {
      const { gsap } = await import('gsap')
      gsapInstance = gsap

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const dx   = (e.clientX - (rect.left + rect.width  / 2)) * strength
        const dy   = (e.clientY - (rect.top  + rect.height / 2)) * strength

        gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' })
        if (inner) {
          gsap.to(inner, { x: dx * 0.55, y: dy * 0.55, duration: 0.4, ease: 'power2.out' })
        }
      }

      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
        if (inner) {
          gsap.to(inner, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
        }
      }

      el.addEventListener('mousemove',  onMove)
      el.addEventListener('mouseleave', onLeave)

      return () => {
        el.removeEventListener('mousemove',  onMove)
        el.removeEventListener('mouseleave', onLeave)
      }
    }

    const cleanup = init()
    return () => { cleanup.then(fn => fn?.()) }
  }, [strength])

  return (
    // @ts-expect-error — dynamic tag
    <Tag ref={elRef} className={`will-change-transform ${className}`} {...props}>
      <span ref={innerRef} className="inline-flex items-center gap-2 will-change-transform">
        {children}
      </span>
    </Tag>
  )
}

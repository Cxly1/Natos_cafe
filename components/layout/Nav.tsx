'use client'

import { useEffect, useRef, useState } from 'react'
import { useLenis } from '@/hooks/useLenis'

const links = [
  { label: 'Menú',      id: 'menu'    },
  { label: 'Nosotros',  id: 'about'   },
  { label: 'Visítanos', id: 'contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible,  setVisible]  = useState(false)
  const navRef      = useRef<HTMLElement>(null)
  const mobileRef   = useRef<HTMLDivElement>(null)
  const lenis       = useLenis()

  // Reveal nav after preloader (listens for body class removal)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!document.body.classList.contains('no-scroll')) {
        setVisible(true)
        observer.disconnect()
      }
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function scrollTo(id: string) {
    const target = document.getElementById(id)
    if (!target) return
    lenis ? lenis.scrollTo(target, { offset: -80 }) : target.scrollIntoView()
    closeMenu()
  }

  function closeMenu() {
    setMenuOpen(false)
    lenis?.start()
  }

  function openMenu() {
    setMenuOpen(true)
    lenis?.stop()
  }

  return (
    <>
      <header
        ref={navRef}
        className={`
          fixed top-0 left-0 right-0 z-[500]
          h-[var(--nav-h)]
          transition-all duration-500
          ${scrolled ? 'bg-bg/88 backdrop-blur-xl border-b border-white/5' : ''}
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
          transition-[opacity,transform] duration-700
        `}
      >
        <div className="max-w-[var(--container)] mx-auto px-[var(--pad)] h-full flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="font-display text-[1.8rem] font-normal text-accent tracking-wide flex items-center gap-[0.05em]"
            aria-label="Nato's Café inicio"
          >
            N<span className="text-text-muted text-[0.6em]">·</span>C
          </button>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-10" aria-label="Navegación principal">
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="nav-link-underline font-body text-xs-f font-normal tracking-[0.15em] uppercase text-text pb-0.5"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => menuOpen ? closeMenu() : openMenu()}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`md:hidden flex flex-col gap-1.5 p-1 ${menuOpen ? 'hamburger-open' : ''}`}
          >
            <span className="line-1 block w-7 h-px bg-text transition-transform duration-400 ease-expo origin-center" />
            <span className="line-2 block w-7 h-px bg-text transition-transform duration-400 ease-expo origin-center" />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        ref={mobileRef}
        aria-hidden={!menuOpen}
        className={`
          fixed inset-0 z-[400] bg-bg-2
          flex flex-col justify-center px-[var(--pad)]
          transition-opacity duration-400
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <nav className="flex flex-col gap-8" aria-label="Navegación móvil">
          {links.map((link, i) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`
                flex items-baseline gap-4
                transition-all duration-500
                ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: menuOpen ? `${i * 70}ms` : '0ms' }}
            >
              <span className="font-body text-xs-f text-accent tracking-widest">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display text-3xl-f font-light text-text leading-none">{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-10 left-[var(--pad)] right-[var(--pad)] flex justify-between text-xs-f text-text-muted tracking-widest">
          <span>@natoscafes</span>
          <span>Guadalajara, Jalisco</span>
        </div>
      </div>
    </>
  )
}

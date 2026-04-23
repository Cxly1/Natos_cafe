export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-[var(--container)] mx-auto px-[var(--pad)] flex flex-wrap items-center justify-between gap-4">
        <span className="font-display text-lg-f text-accent tracking-widest flex items-center gap-[0.1em]">
          E
          <span className="text-saffron inline-flex" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="w-[0.8em] h-[0.8em]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.5 L10.5 4.5 L13.5 4.5 Z" fill="currentColor" />
              <path d="M12 4.5 L12 6" />
              <path d="M7 7 L17 7 L14.5 19 L9.5 19 Z" fill="currentColor" opacity="0.85" />
              <path d="M8 10 L16 10" stroke="#130a05" strokeWidth="0.8" />
              <path d="M8.3 13 L15.7 13" stroke="#130a05" strokeWidth="0.8" />
              <path d="M8.7 16 L15.3 16" stroke="#130a05" strokeWidth="0.8" />
              <path d="M9 19 L15 19 L14.2 21 L9.8 21 Z" fill="currentColor" />
            </svg>
          </span>
          J
        </span>
        <span className="text-xs-f text-text-muted tracking-wide">
          © 2026 El Jefe Tacos · Guadalajara, Jalisco
        </span>
        <a
          href="https://instagram.com/eljefetacos"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs-f text-text-muted tracking-wide hover:text-accent transition-colors duration-300"
        >
          @eljefetacos
        </a>
      </div>
    </footer>
  )
}

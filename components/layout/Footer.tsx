export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-[var(--container)] mx-auto px-[var(--pad)] flex flex-wrap items-center justify-between gap-4">
        <span className="font-display text-lg-f text-accent tracking-widest">N·C</span>
        <span className="text-xs-f text-text-muted tracking-wide">
          © 2025 Nato&apos;s Café · Guadalajara, Jalisco
        </span>
        <a
          href="https://instagram.com/natoscafes"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs-f text-text-muted tracking-wide hover:text-accent transition-colors duration-300"
        >
          @natoscafes
        </a>
      </div>
    </footer>
  )
}

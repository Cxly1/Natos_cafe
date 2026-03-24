interface MarqueeRowProps {
  items: string[]
  direction?: 'right' | 'left'
}

export default function MarqueeRow({ items, direction = 'right' }: MarqueeRowProps) {
  // Duplicate items so the loop is seamless (CSS animation: translateX -50%)
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden py-3">
      <div
        className={`flex w-max whitespace-nowrap ${
          direction === 'right' ? 'animate-marquee-right' : 'animate-marquee-left'
        }`}
        aria-hidden="true"
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display italic text-lg-f text-text/90 px-6 tracking-wide">
              {item}
            </span>
            <span className="text-accent text-lg-f leading-none">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

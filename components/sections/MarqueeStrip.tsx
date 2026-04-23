import MarqueeRow from '@/components/ui/MarqueeRow'

const ROW_1 = ['Al Pastor', 'Suadero', 'Tripa', 'Asada', 'Guadalajara']
const ROW_2 = ['@eljefetacos', 'Campechano', 'Cochinita', 'Salsa de Molcajete', 'Tortilla a Mano']

export default function MarqueeStrip() {
  return (
    <div
      className="marquee-pause-group bg-bg-2 border-y border-white/5 overflow-hidden"
      aria-hidden="true"
    >
      <MarqueeRow items={ROW_1} direction="right" />
      <div className="border-t border-white/5">
        <MarqueeRow items={ROW_2} direction="left" />
      </div>
    </div>
  )
}

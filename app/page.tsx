import CustomCursor   from '@/components/ui/CustomCursor'
import Preloader      from '@/components/sections/Preloader'
import Nav            from '@/components/layout/Nav'
import Hero           from '@/components/sections/Hero'
import MarqueeStrip   from '@/components/sections/MarqueeStrip'
import CardStack      from '@/components/sections/CardStack'
import MenuSection    from '@/components/sections/MenuSection'
import Gallery        from '@/components/sections/Gallery'
import About          from '@/components/sections/About'
import Contact        from '@/components/sections/Contact'
import Footer         from '@/components/layout/Footer'

export default function Page() {
  return (
    <>
      <CustomCursor />
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <MarqueeStrip />
        <CardStack />
        <MenuSection />
        <Gallery />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

/**
 * GSAP singleton registration.
 * Import this in components instead of registering ScrollTrigger multiple times.
 * Safe to call server-side — registration is a no-op outside the browser.
 */

let registered = false

export async function registerGSAP() {
  if (registered || typeof window === 'undefined') return

  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')

  gsap.registerPlugin(ScrollTrigger)
  registered = true

  return { gsap, ScrollTrigger }
}

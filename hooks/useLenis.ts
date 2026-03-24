import { useContext } from 'react'
import { LenisContext } from '@/components/providers/SmoothScrollProvider'

/**
 * Returns the Lenis instance from context.
 * Use for programmatic scroll: `lenis?.scrollTo(target)`
 */
export function useLenis() {
  return useContext(LenisContext)
}

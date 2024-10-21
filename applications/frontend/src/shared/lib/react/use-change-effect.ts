import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

import { useLatest } from './use-latest'

export function useChangeEffect(effect: EffectCallback, deps: DependencyList) {
  const latestEffect = useLatest(effect)
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      // isMounted assignment wrapped in setTimeout because react in strict mode calls useEffect twice and this condition has no effect, however if we wrap it in setTimeout it will asynchonously assign true value to isMouted and it guarantees that callback will call only on change dependency array
      const timeoutId = setTimeout(() => {
        isMounted.current = true
      })
      return () => clearTimeout(timeoutId)
    }

    return latestEffect.current()
  }, [isMounted, latestEffect, ...deps])
}

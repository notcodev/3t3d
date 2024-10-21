import { useState } from 'react'

import { useChangeEffect } from './use-change-effect'
import { useLatest } from './use-latest'

export function useSideEffectState<T>(
  initialValue: T,
  { onChange }: { onChange: (value: T) => void | (() => void) },
) {
  const latestOnChange = useLatest(onChange)
  const [state, setState] = useState(initialValue)

  useChangeEffect(() => {
    return latestOnChange.current(state)
  }, [state, latestOnChange])

  return [state, setState] as const
}

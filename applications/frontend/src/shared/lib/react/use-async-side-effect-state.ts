import { useCallback, useEffect, useRef, useState } from 'react'

import { useLatest } from './use-latest'

export function useAsyncSideEffectState<T>(
  initialValue: T,
  {
    beforeChange,
  }: { beforeChange: (value: T) => Promise<unknown> | void | (() => void) },
) {
  const latestBeforeChange = useLatest(beforeChange)
  const cleanUpRef = useRef<(() => void) | null>(null)
  const [state, setState] = useState(initialValue)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    return () => cleanUpRef.current?.()
  }, [])

  const asyncSetState = useCallback(
    (value: T) => {
      cleanUpRef.current?.()
      const output = latestBeforeChange.current(value)

      if (output instanceof Promise) {
        setIsPending(true)
        output
          .then(() => setState(value))
          .catch()
          .finally(() => setIsPending(false))
        return
      }

      if (typeof output === 'function') {
        cleanUpRef.current = output
      }

      setState(value)
    },
    [latestBeforeChange],
  )

  return [state, asyncSetState, { isPending }] as const
}

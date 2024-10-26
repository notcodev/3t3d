import { useCallback, useEffect, useRef, useState } from 'react'

import { useLatest } from './use-latest'

export function useAsyncSideEffectState<T>(
  initialValue: T,
  {
    beforeChange,
  }: {
    beforeChange: (
      value: T,
      misc: { abort: () => void },
    ) => Promise<unknown> | void | (() => void)
  },
) {
  const latestBeforeChange = useLatest(beforeChange)
  const cleanUpRef = useRef<(() => void) | null>(null)
  const [state, setState] = useState(initialValue)
  const [isPending, setIsPending] = useState(false)
  const isAborted = useRef(false)

  useEffect(() => {
    return () => cleanUpRef.current?.()
  }, [])

  const asyncSetState = useCallback(
    (value: T) => {
      isAborted.current = false
      cleanUpRef.current?.()

      const output = latestBeforeChange.current(value, {
        abort: () => {
          isAborted.current = true
          setIsPending(false)
        },
      })

      if (output instanceof Promise) {
        setIsPending(true)
        output
          .then(() => !isAborted.current && setState(value))
          .catch()
          .finally(() => {
            isAborted.current = false
            setIsPending(false)
          })
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

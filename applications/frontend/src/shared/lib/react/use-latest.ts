import { useInsertionEffect, useRef } from 'react'

export const useLatest = <T>(value: T) => {
  const ref = useRef(value)

  useInsertionEffect(() => {
    ref.current = value
  }, [value])

  return ref
}

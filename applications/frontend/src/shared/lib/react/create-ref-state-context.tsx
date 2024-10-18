import {
  createContext,
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react'

import { useLatest } from './use-latest'

export const createRefStateContext = function <T>(initialValue: T) {
  const ContextState = createContext<[T, Dispatch<SetStateAction<T>>] | null>(
    null,
  )
  const ContextRef = createContext<MutableRefObject<T> | null>(null)

  const ContextProvider = ({ children }: PropsWithChildren) => {
    const [state, setState] = useState(initialValue)
    const ref = useLatest(state)

    return (
      <ContextState.Provider value={[state, setState]}>
        <ContextRef.Provider value={ref}>{children}</ContextRef.Provider>
      </ContextState.Provider>
    )
  }

  const useContextState = () => {
    const ctx = useContext(ContextState)

    if (ctx === null) {
      throw new Error(
        'Hook "useContextState" called outside of ContextProvider',
      )
    }

    return ctx
  }

  const useContextRef = () => {
    const ctx = useContext(ContextRef)

    if (ctx === null) {
      throw new Error('Hook "useContextRef" called outside of ContextProvider')
    }

    return ctx
  }

  return [ContextProvider, { useContextState, useContextRef }] as const
}

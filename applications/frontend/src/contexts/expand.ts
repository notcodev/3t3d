import { createRefStateContext } from '../lib/react'

export const [
  ExpandContextProvider,
  {
    useContextState: useExpandContextState,
    useContextRef: useExpandContextRef,
  },
] = createRefStateContext(false)

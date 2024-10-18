import { createRefStateContext } from '@/shared/lib/react'

export const [
  ExpandContextProvider,
  {
    useContextState: useExpandContextState,
    useContextRef: useExpandContextRef,
  },
] = createRefStateContext(false)

import { createRefStateContext } from '../lib/react'

export const [
  AutoRotateContextProvider,
  {
    useContextState: useAutoRotateContextState,
    useContextRef: useAutoRotateContextRef,
  },
] = createRefStateContext(true)

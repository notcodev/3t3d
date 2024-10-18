import { createRefStateContext } from '@/shared/lib/react'

export const [
  AutoRotateContextProvider,
  {
    useContextState: useAutoRotateContextState,
    useContextRef: useAutoRotateContextRef,
  },
] = createRefStateContext(true)

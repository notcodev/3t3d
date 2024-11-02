import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector'

import { atom } from '@/shared/fabrics/atom'

export interface CurrentDialog {
  id: string
  close: () => void
  abort: () => void
}

export const dialogRouteModel = atom(() => {
  const abortFx = createEffect<CurrentDialog['abort'], void>((abort) => abort())

  const openingBegan = createEvent<CurrentDialog>()
  const closingComplete = createEvent()
  const componentUnmounted = createEvent<Pick<CurrentDialog, 'id'>>()

  const $current = createStore<CurrentDialog | null>(null)

  sample({
    clock: openingBegan,
    source: $current,
    filter: (current, { id }) => current !== null && current.id !== id,
    fn: (current) => current!.abort,
    target: abortFx,
  })

  sample({
    clock: openingBegan,
    target: $current,
  })

  sample({
    clock: closingComplete,
    fn: () => null,
    target: $current,
  })

  sample({
    clock: componentUnmounted,
    source: $current,
    filter: (current, { id }) => current !== null && current.id === id,
    fn: () => null,
    target: $current,
  })

  return {
    componentUnmounted,
    openingBegan,
    closingComplete,
    initiateClose: attach({
      source: $current,
      effect: (current) => current?.close(),
    }),
  }
})

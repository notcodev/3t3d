import { NavigateOptions, Register } from '@tanstack/react-router'
import { attach, createEvent, createStore } from 'effector'

import { atom } from '../fabrics/atom'

export type AppRouter = Register['router']

export const routingModel = atom(() => {
  const attachRouter = createEvent<AppRouter | null>()
  const $router = createStore<AppRouter | null>(null)

  const navigateFx = attach({
    source: $router,
    effect: (router: AppRouter | null, options: NavigateOptions<AppRouter>) => {
      return router?.navigate(options)
    },
  })

  return {
    $router,
    attachRouter,
    navigateFx,
  }
})

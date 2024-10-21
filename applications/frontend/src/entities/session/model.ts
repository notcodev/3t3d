import { createEvent, createStore } from 'effector'

import { atom } from '@/shared/fabrics/atom'

export const authStatus = {
  initial: 'initial',
  pending: 'pending',
  anonymous: 'anonymous',
  authenticated: 'authenticated',
} as const

export interface User {}

export type AuthStatus = keyof typeof authStatus

export const sessionModel = atom(() => {
  const sessionCheckStarted = createEvent()

  const $status = createStore<AuthStatus>(authStatus.initial)
  const $user = createStore<User | null>(null)

  async function getIsAuthenticated() {
    // eslint-disable-next-line effector/no-getState
    const status = $status.getState()

    if (status === 'authenticated' || status === 'anonymous') {
      return status === 'authenticated'
    }

    if (status === 'initial') {
      sessionCheckStarted()
    }

    return new Promise<boolean>((res) => {
      const subscription = $status.subscribe((state) => {
        if (state === 'authenticated' || state === 'anonymous') {
          subscription.unsubscribe()
          res(state === 'authenticated')
        }
      })
    })
  }

  return { getIsAuthenticated, $user }
})

import { t } from '../trpc'
import { authRouter } from './auth.router'
import { usersRouter } from './users.router'

export const appRouter = t.router({
  users: usersRouter,
  auth: authRouter,
})

export type AppRouter = typeof appRouter

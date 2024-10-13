import { t } from '../trpc'
import { authRouter } from './auth.router'
import { multiplayerGamesRouter } from './multiplayer-games.router'
import { usersRouter } from './users.router'

export const appRouter = t.router({
  users: usersRouter,
  auth: authRouter,
  multiplayerGames: multiplayerGamesRouter,
})

export type AppRouter = typeof appRouter

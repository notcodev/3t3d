import { usersService } from '@/services'

import { authorizedProcedure, t } from '../trpc'

export const usersRouter = t.router({
  getMe: authorizedProcedure.query(async ({ ctx: { session } }) => {
    return usersService.getUserById({ id: session.userId })
  }),
})

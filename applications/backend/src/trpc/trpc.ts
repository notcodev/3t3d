import { initTRPC, TRPCError } from '@trpc/server'

import { createContext } from './context'

export const t = initTRPC.context<typeof createContext>().create()

export const authorizedProcedure = t.procedure.use(
  async ({ ctx: { session }, next }) => {
    if (!session.userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return next({ ctx: { session } })
  },
)

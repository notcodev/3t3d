import { db } from '@drizzle/connection'
import { users } from '@drizzle/schema'
import { eq } from 'drizzle-orm'

import { authorizedProcedure, t } from '@/trpc'

export const usersRouter = t.router({
  getMe: authorizedProcedure.query(async ({ ctx: { session } }) => {
    const selectedRows = await db
      .select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.userId))

    return selectedRows[0]
  }),
})

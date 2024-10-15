import { db } from '@drizzle/connection'
import { users } from '@drizzle/schema'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'

import { atom } from '@/fabrics/atom'

export const usersSerivce = atom(() => {
  async function getUserById({ id }: { id: number }) {
    const selectedRows = await db
      .select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))

    if (selectedRows.length === 0) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }

    return selectedRows[0]
  }

  return { getUserById }
})

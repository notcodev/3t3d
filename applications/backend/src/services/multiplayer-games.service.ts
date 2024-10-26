import { db } from '@drizzle/connection'
import { games } from '@drizzle/schema'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'

import { atom } from '@/fabrics/atom'

export const multiplayerGamesService = atom(() => {
  async function getGameById({ id }: { id: number }) {
    const selectedRows = await db.select().from(games).where(eq(games.id, id))

    if (selectedRows.length === 0) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }

    return selectedRows[0]
  }

  return { getGameById }
})

import { db } from '@drizzle/connection'
import { games } from '@drizzle/schema'
import { GameState } from '@tic-tac-toe-3d/core'
import { createEffect, createEvent, fork, sample, Scope } from 'effector'
import { EventEmitter } from 'stream'

import { atom } from '@/fabrics/atom'

import { searchModel } from './search.model'

export const gamesManagerModel = atom(() => {
  const eventEmitter = new EventEmitter()
  const gamesMap = new Map<
    number,
    {
      scope: Scope
      participants: Record<`player${1 | 2}`, { id: number }>
    }
  >()

  const createGameFx = createEffect(
    async (participants: Record<`player${1 | 2}`, { id: number }>) => {
      const insertedRows = await db
        .insert(games)
        .values({
          player1Id: participants.player1.id,
          player2Id: participants.player2.id,
        })
        .returning({ id: games.id })
      const createdGame = insertedRows[0]

      gamesMap.set(createdGame.id, {
        scope: fork(),
        participants,
      })

      eventEmitter.emit(
        getGameCreatedEventName({ userId: participants.player1.id }),
        { gameId: createdGame.id, opponentId: participants.player2.id },
      )
      eventEmitter.emit(
        getGameCreatedEventName({ userId: participants.player2.id }),
        { gameId: createdGame.id, opponentId: participants.player1.id },
      )
    },
  )

  const finishGameFx = createEffect(
    async ({
      gameId,
      exodus,
    }: {
      gameId: number
      exodus: Exclude<GameState, 'processing'>
    }) => {
      gamesMap.delete(gameId)
      await db.update(games).set({ status: exodus, finishedAt: new Date() })
    },
  )

  const gameEnded = createEvent<{
    gameId: number
    exodus: Exclude<GameState, 'processing'>
  }>()

  sample({
    clock: searchModel.participantsFound,
    target: createGameFx,
  })

  sample({
    clock: gameEnded,
    target: finishGameFx,
  })

  function onGameCreated(
    { userId }: { userId: number },
    callback: (data: { gameId: number; opponentId: number }) => unknown,
  ) {
    const eventName = getGameCreatedEventName({ userId })
    eventEmitter.on(eventName, callback)
    return {
      unsubscribe() {
        eventEmitter.off(eventName, callback)
      },
    }
  }

  return {
    getGame: (gameId: number) => gamesMap.get(gameId),
    onGameCreated,
    gameEnded,
  }
})

function getGameCreatedEventName({ userId }: { userId: number }) {
  return `game-created:${userId}`
}

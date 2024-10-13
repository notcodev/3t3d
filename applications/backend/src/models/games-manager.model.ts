import { GameState } from '@tic-tac-toe-3d/core'
import { createEffect, createEvent, fork, sample, Scope } from 'effector'
import { EventEmitter } from 'stream'

import { atom } from '@/fabrics/atom'

import { searchModel } from './search.model'

export const gamesManagerModel = atom(() => {
  const eventEmitter = new EventEmitter()
  const games = new Map<
    number,
    {
      scope: Scope
      participants: Record<`player${1 | 2}`, { id: number }>
    }
  >()

  const createGameFx = createEffect(
    async (participants: Record<`player${1 | 2}`, { id: number }>) => {
      const scope = fork()
      const gameId = 1
      games.set(gameId, { scope, participants })

      eventEmitter.emit(
        getGameCreatedEventName({ userId: participants.player1.id }),
        { gameId, opponentId: participants.player2.id },
      )
      eventEmitter.emit(
        getGameCreatedEventName({ userId: participants.player2.id }),
        { gameId, opponentId: participants.player1.id },
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
      games.delete(gameId)
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
    return () => eventEmitter.off(eventName, callback)
  }

  return {
    getGame: (gameId: number) => games.get(gameId),
    onGameCreated,
    gameEnded,
  }
})

function getGameCreatedEventName({ userId }: { userId: number }) {
  return `game-created:${userId}`
}

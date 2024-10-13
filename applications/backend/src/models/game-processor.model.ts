import {
  gameModel,
  PossiblePosition,
  selectCell,
  Shape,
} from '@tic-tac-toe-3d/core'
import { allSettled } from 'effector'
import { EventEmitter } from 'node:stream'

import { atom } from '@/fabrics/atom'

import { gamesManagerModel } from './games-manager.model'

export const gameProcessorModel = atom(() => {
  const eventEmitter = new EventEmitter()

  async function move({
    gameId,
    userId,
    shape,
    coordinates,
  }: {
    coordinates: Record<'x' | 'y' | 'z', PossiblePosition>
    shape: Shape
    userId: number
    gameId: number
  }) {
    const game = gamesManagerModel.getGame(gameId)

    if (!game) {
      return
    }

    const currentPlayer = game.scope.getState(gameModel.$currentPlayer)

    if (game.participants[currentPlayer].id !== userId) {
      return
    }

    const cell =
      gameModel.field[selectCell([coordinates.x, coordinates.y, coordinates.z])]

    await allSettled<Shape>(cell.cellClicked, {
      scope: game.scope,
      params: shape,
    })

    const opponentId = {
      player1: game.participants.player2.id,
      player2: game.participants.player1.id,
    }[currentPlayer]

    eventEmitter.emit(
      getOpponentMoveEventName({ playerId: opponentId, gameId }),
      { coordinates, shape },
    )

    const gameState = game.scope.getState(gameModel.$gameState)
    if (gameState !== 'processing') {
      gamesManagerModel.gameEnded({ gameId, exodus: gameState })
    }
  }

  function onOpponentMove(
    { userId, gameId }: { userId: number; gameId: number },
    callback: (data: {
      coordinates: Record<'x' | 'y' | 'z', PossiblePosition>
      shape: Shape
    }) => unknown,
  ) {
    const eventName = getOpponentMoveEventName({ playerId: userId, gameId })
    eventEmitter.on(eventName, callback)
    return () => eventEmitter.off(eventName, callback)
  }

  return {
    move,
    onOpponentMove,
  }
})

export function getOpponentMoveEventName({
  playerId,
  gameId,
}: {
  playerId: number
  gameId: number
}) {
  return `opponent-move:${gameId}:${playerId}`
}

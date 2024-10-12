import { createEvent, createStore, sample, StoreWritable } from 'effector'
import { and, equals } from 'patronum'

import { possiblePositions } from './constants'
import { atom } from './fabrics/atom'
import { GameState, Shape, StringifiedCellCoordinate } from './types'
import { forEachValue } from './utils/for-each-value'
import { getGameState } from './utils/get-game-state'
import { reshapeRecordValues } from './utils/reshape-record-values'
import { selectCell } from './utils/select-cell'

export type Player1Shape = Extract<Shape, 'cross' | 'cylinder'>
export type Player2Shape = Extract<Shape, 'ring' | 'plus'>

export const gameModel = atom(() => {
  const shapeOwners = {
    cross: 'player1',
    cylinder: 'player1',
    ring: 'player2',
    plus: 'player2',
  } as const

  const $gameState = createStore<GameState>('processing')

  const $currentPlayer = createStore<'player1' | 'player2'>('player1')

  const createCell = () => {
    const cellClicked = createEvent<Shape>()
    const $shape = createStore<Shape | null>(null)

    const cellClickedSafely = sample({
      clock: cellClicked,
      source: { player: $currentPlayer },
      filter: ({ player }, shape) => {
        return shapeOwners[shape] === player
      },
      fn: (_, shape) => shape,
    })

    const moveDone = sample({
      clock: cellClickedSafely,
      source: { player: $currentPlayer },
      filter: and(equals($gameState, 'processing'), equals($shape, null)),
      fn: ({ player }, shape) => ({
        player,
        shape,
      }),
    })

    sample({
      clock: moveDone,
      fn: ({ shape }) => shape,
      target: $shape,
    })

    sample({
      clock: moveDone,
      fn: ({ player }) => (player === 'player1' ? 'player2' : 'player1'),
      target: $currentPlayer,
    })

    return {
      $shape,
      cellClicked,
      moveDone,
    }
  }

  type Field = Record<StringifiedCellCoordinate, ReturnType<typeof createCell>>

  const field = possiblePositions.reduce<Field>((acc, x) => {
    possiblePositions.forEach((y) =>
      possiblePositions.forEach(
        (z) => (acc[selectCell([x, y, z])] = createCell()),
      ),
    )
    return acc
  }, {} as Field)

  const reshapedField = reshapeRecordValues(field, (cell) => cell.$shape)

  forEachValue(field, ({ moveDone }) => {
    sample({
      clock: moveDone,
      source: reshapedField,
      filter: equals($gameState, 'processing'),
      fn: (field) => getGameState(field, shapeOwners),
      target: $gameState,
    })
  })

  return {
    field,
    $gameState,
    $currentPlayer,
    shapeOwners,
  }
})

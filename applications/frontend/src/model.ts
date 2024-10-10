import { combine, createEvent, createStore, sample } from 'effector'
import { and, equals } from 'patronum'
import { possiblePositions } from './constants/game'
import { atom } from './fabrics/atom'
import { Shape } from './types/game'
import { getGameState } from './utils/get-game-state'
import { selectCell } from './utils/select-cell'

type Player1Shape = Extract<Shape, 'cross' | 'cylinder'>
type Player2Shape = Extract<Shape, 'ring' | 'plus'>

const shapeOwners = {
  cross: 'player1',
  cylinder: 'player1',
  ring: 'player2',
  plus: 'player2',
} as const

export const model = atom(() => {
  const shapeChanged = createEvent<Shape>()
  const $gameState = createStore<'draw' | 'player1' | 'player2' | 'processing'>(
    'processing',
  )

  const $player1Shape = createStore<Player1Shape>('cross')
  const $player2Shape = createStore<Player2Shape>('ring')
  const $currentPlayer = createStore<'player1' | 'player2'>('player1')

  const $currentShape = combine(
    $currentPlayer,
    $player1Shape,
    $player2Shape,
    (currentPlayer, player1Shape, player2Shape) =>
      currentPlayer === 'player1' ? player1Shape : player2Shape,
  )

  const shapeChangedSafely = sample({
    clock: shapeChanged,
    source: { player: $currentPlayer },
    filter: ({ player }, shape) => shapeOwners[shape] === player,
    fn: ({ player }, newShape) => ({ player, newShape }),
  })

  sample({
    clock: shapeChangedSafely,
    filter: ({ player }) => player === 'player1',
    fn: ({ newShape }) => newShape as Player1Shape,
    target: $player1Shape,
  })

  sample({
    clock: shapeChangedSafely,
    filter: ({ player }) => player === 'player2',
    fn: ({ newShape }) => newShape as Player2Shape,
    target: $player2Shape,
  })

  const createCell = () => {
    const cellClicked = createEvent()
    const $shape = createStore<Shape | null>(null)

    const moveDone = sample({
      clock: cellClicked,
      source: {
        player: $currentPlayer,
        player1Shape: $player1Shape,
        player2Shape: $player2Shape,
      },
      filter: and(equals($gameState, 'processing'), equals($shape, null)),
      fn: ({ player, player1Shape, player2Shape }) => ({
        player,
        shape: player === 'player1' ? player1Shape : player2Shape,
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
    }
  }

  const field = possiblePositions.reduce<
    Record<string, ReturnType<typeof createCell>>
  >((acc, _, x) => {
    possiblePositions.forEach((_, y) =>
      possiblePositions.forEach(
        (_, z) => (acc[selectCell([x, y, z])] = createCell()),
      ),
    )
    return acc
  }, {})

  Object.values(field).forEach(({ cellClicked }) => {
    sample({
      clock: cellClicked,
      source: Object.fromEntries(
        Object.entries(field).map(([key, cell]) => [key, cell.$shape]),
      ),
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
    $currentShape,
    shapeChanged,
  }
})

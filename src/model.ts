import { createStore, createEvent, sample } from 'effector'
import { atom } from './fabrics/atom'
import { possiblePositions } from './constants/game'
import { selectCell } from './utils/select-cell'
import { getGameState } from './utils/get-game-state'

export const model = atom(() => {
  const $gameState = createStore<'draw' | 'circle' | 'cross' | 'processing'>(
    'processing',
  )
  const $gameProcessing = $gameState.map((state) => state === 'processing')
  const $currentShape = createStore<'circle' | 'cross'>('circle')

  const createCell = () => {
    const cellClicked = createEvent()
    const $shape = createStore<'circle' | 'cross' | null>(null)

    sample({
      clock: cellClicked,
      source: $currentShape,
      filter: $gameProcessing,
      target: $shape,
    })

    sample({
      clock: cellClicked,
      source: $currentShape,
      fn: (currentShape) => (currentShape === 'circle' ? 'cross' : 'circle'),
      filter: $gameProcessing,
      target: $currentShape,
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
      fn: (field) => getGameState(field),
      filter: $gameProcessing,
      target: $gameState,
    })
  })

  return {
    field,
    $gameState,
    $currentShape,
  }
})

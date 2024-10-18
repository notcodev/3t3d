import { possiblePositions } from '../constants/game'
import { Shape } from '../types/game'
import { selectCell } from './select-cell'

export const getGameState = (
  field: Record<string, Shape | null>,
  shapeOwners: Record<Shape, 'player1' | 'player2'>,
): 'draw' | 'player1' | 'player2' | 'processing' => {
  function checkDiagonals(
    getPositions: (
      pos1: number,
      pos2: number,
    ) => readonly [number, number, number],
  ) {
    const getCell = (...args: Parameters<typeof getPositions>) =>
      field[selectCell(getPositions(...args))]

    if (
      getCell(0, 0) &&
      possiblePositions.every((pos) => getCell(pos, pos) === getCell(0, 0))
    ) {
      return getCell(0, 0)
    }

    if (
      getCell(0, 2) &&
      possiblePositions.every((pos) => getCell(pos, 2 - pos) === getCell(0, 2))
    ) {
      return getCell(0, 2)
    }

    return null
  }

  // Проверка строк и столбцов
  for (const z of possiblePositions) {
    for (const x of possiblePositions) {
      const currentCell = field[selectCell([x, 0, z])]

      if (
        currentCell &&
        possiblePositions.every(
          (pos) => field[selectCell([x, pos, z])] === currentCell,
        )
      ) {
        return shapeOwners[currentCell]
      }
    }

    for (const y of possiblePositions) {
      const currentCell = field[selectCell([0, y, z])]

      if (
        currentCell &&
        possiblePositions.every(
          (pos) => field[selectCell([pos, y, z])] === currentCell,
        )
      ) {
        return shapeOwners[currentCell]
      }
    }
  }

  // Проверка строк в глубину
  for (const x of possiblePositions) {
    for (const y of possiblePositions) {
      const currentCell = field[selectCell([x, y, 0])]

      if (
        currentCell &&
        possiblePositions.every(
          (pos) => field[selectCell([x, y, pos])] === currentCell,
        )
      ) {
        return shapeOwners[currentCell]
      }
    }
  }

  // Проверка диагоналей с каждой стороны
  for (const x of possiblePositions) {
    const result = checkDiagonals((pos1, pos2) => [x, pos1, pos2])

    if (result) return shapeOwners[result]
  }

  for (const y of possiblePositions) {
    const result = checkDiagonals((pos1, pos2) => [pos1, y, pos2])

    if (result) return shapeOwners[result]
  }

  for (const z of possiblePositions) {
    const result = checkDiagonals((pos1, pos2) => [pos1, pos2, z])

    if (result) return shapeOwners[result]
  }

  // Проверка главных диагоналей
  const mainDiagonalsPositions = [
    [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
    ],
    [
      [0, 0, 2],
      [1, 1, 1],
      [2, 2, 0],
    ],
    [
      [2, 0, 2],
      [1, 1, 1],
      [0, 2, 0],
    ],
    [
      [0, 2, 2],
      [1, 1, 1],
      [2, 0, 0],
    ],
  ] as const

  for (const [pos1, pos2, pos3] of mainDiagonalsPositions) {
    if (
      field[selectCell(pos1)] &&
      field[selectCell(pos1)] === field[selectCell(pos2)] &&
      field[selectCell(pos2)] === field[selectCell(pos3)]
    ) {
      return shapeOwners[field[selectCell(pos1)]!]
    }
  }

  for (const x of possiblePositions) {
    for (const y of possiblePositions) {
      for (const z of possiblePositions) {
        if (field[selectCell([x, y, z])] === null) {
          return 'processing'
        }
      }
    }
  }

  return 'draw'
}

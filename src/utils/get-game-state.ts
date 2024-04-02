import { possiblePositions } from '../constants/game'
import { selectCell } from './select-cell'

export const getGameState = (
  field: Record<string, 'circle' | 'cross' | null>,
): 'draw' | 'circle' | 'cross' | 'processing' => {
  function checkDiagonals(
    getPositions: (
      pos1: number,
      pos2: number,
    ) => readonly [number, number, number],
  ) {
    const currentCell = field[selectCell(getPositions(0, 0))]
    if (
      currentCell &&
      (possiblePositions.every(
        (pos) => field[selectCell(getPositions(pos, pos))] === currentCell,
      ) ||
        possiblePositions.every(
          (pos) =>
            field[
              selectCell(getPositions(pos, possiblePositions.length - 1 - pos))
            ] === currentCell,
        ))
    ) {
      return currentCell
    }

    return null
  }

  // Проверка строк и столбцов
  for (let z of possiblePositions) {
    for (let x of possiblePositions) {
      const currentCell = field[selectCell([x, 0, z])]

      if (
        currentCell &&
        possiblePositions.every(
          (pos) => field[selectCell([x, pos, z])] === currentCell,
        )
      ) {
        return currentCell!
      }
    }

    for (let y of possiblePositions) {
      const currentCell = field[selectCell([0, y, z])]

      if (
        currentCell &&
        possiblePositions.every(
          (pos) => field[selectCell([pos, y, z])] === currentCell,
        )
      ) {
        return currentCell!
      }
    }
  }

  // Проверка строк в глубину
  for (let x of possiblePositions) {
    for (let y of possiblePositions) {
      const currentCell = field[selectCell([x, y, 0])]

      if (
        currentCell &&
        possiblePositions.every(
          (pos) => field[selectCell([x, y, pos])] === currentCell,
        )
      ) {
        return currentCell!
      }
    }
  }

  // Проверка диагоналей с каждой стороны
  for (let z of possiblePositions) {
    const result = checkDiagonals((pos1, pos2) => [pos1, pos2, z])

    if (result) return result
  }

  for (let x of possiblePositions) {
    const result = checkDiagonals((pos1, pos2) => [x, pos1, pos2])

    if (result) return result
  }

  for (let y of possiblePositions) {
    const result = checkDiagonals((pos1, pos2) => [pos1, y, pos2])

    if (result) return result
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
      return field[selectCell(pos1)]!
    }
  }

  return 'processing'
}

import { possiblePositions } from '../constants/game'
import { selectCell } from './select-cell'

export const getGameState = (
  field: Record<string, 'circle' | 'cross' | null>,
): 'draw' | 'circle' | 'cross' | 'processing' => {
  for (let z of possiblePositions) {
    for (let x of possiblePositions) {
      const currentCell = field[selectCell([x, 0, z])]

      if (
        currentCell &&
        currentCell === field[selectCell([x, 1, z])] &&
        currentCell === field[selectCell([x, 2, z])]
      ) {
        return currentCell
      }
    }

    // Проверка столбцов
    for (let y of possiblePositions) {
      const currentCell = field[selectCell([0, y, z])]

      if (
        currentCell &&
        currentCell === field[selectCell([1, y, z])] &&
        currentCell === field[selectCell([2, y, z])]
      ) {
        return currentCell
      }
    }

    // Проверка диагоналей
    {
      const currentCell = field[selectCell([0, 0, z])]
      if (
        currentCell &&
        currentCell === field[selectCell([1, 1, z])] &&
        field[selectCell([1, 1, z])] === field[selectCell([2, 2, z])]
      ) {
        return currentCell
      }
    }
    {
      const currentCell = field[selectCell([0, 2, z])]
      if (
        currentCell &&
        currentCell === field[selectCell([1, 1, z])] &&
        field[selectCell([1, 1, z])] === field[selectCell([2, 0, z])]
      ) {
        return currentCell
      }
    }
  }

  for (let x of possiblePositions) {
    for (let y of possiblePositions) {
      const currentCell = field[selectCell([x, y, 0])]

      if (
        currentCell &&
        currentCell === field[selectCell([x, y, 1])] &&
        currentCell === field[selectCell([x, y, 2])]
      ) {
        return currentCell
      }
    }
  }

  return 'processing'
}

import { PossiblePosition, StringifiedCellCoordinate } from '../types'

export const selectCell = ([x, y, z]: readonly [
  PossiblePosition,
  PossiblePosition,
  PossiblePosition,
]): StringifiedCellCoordinate => {
  return `${x}:${y}:${z}`
}

export type Shape = 'cross' | 'ring' | 'plus' | 'cylinder'
export type PossiblePosition = 0 | 1 | 2
export type StringifiedCellCoordinate =
  `${PossiblePosition}:${PossiblePosition}:${PossiblePosition}`
export type GameState = 'draw' | 'player1_won' | 'player2_won' | 'processing'

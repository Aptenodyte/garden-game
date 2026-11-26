export type Direction = 'up' | 'down' | 'left' | 'right'

export type TileKind =
  | 'ground'
  | 'hedge'
  | 'exit'
  | 'switch'
  | 'gate'
  | 'portal'
  | 'stone'
  | 'current'

export interface Level {
  id: number
  name: string
  subtitle: string
  lesson: string
  par: number
  width: number
  height: number
  tiles: TileKind[]
  flowers: number[]
  flowerBits: number[]
  start: number
  exit: number
  switches: number[]
  gates: number[]
  portals: [number, number][]
  oneWays: (Direction | null)[]
}

export interface GameState {
  position: number
  bloomed: number
  opened: number
  sunk: number[]
  moves: number
  won: boolean
}

export type MoveEvent =
  | 'step'
  | 'bloom'
  | 'switch'
  | 'portal'
  | 'sink'
  | 'win'
  | 'blocked'

export interface MoveResult {
  state: GameState
  changed: boolean
  events: MoveEvent[]
  message?: string
}

export interface LevelRecord {
  completed: boolean
  bestMoves: number | null
  parEarned: boolean
}

export interface SaveData {
  version: 1
  unlocked: number
  records: Record<string, LevelRecord>
  muted: boolean
}

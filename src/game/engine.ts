import type { Direction, GameState, Level, MoveEvent, MoveResult } from './types.ts'

export const directions: Record<Direction, { row: number; column: number; label: string }> = {
  up: { row: -1, column: 0, label: 'up' },
  down: { row: 1, column: 0, label: 'down' },
  left: { row: 0, column: -1, label: 'left' },
  right: { row: 0, column: 1, label: 'right' },
}

export const directionOrder: Direction[] = ['up', 'right', 'down', 'left']

export function allFlowersMask(level: Level): number {
  return (1 << level.flowers.length) - 1
}

export function flowerCount(state: GameState, level: Level): number {
  let remaining = state.bloomed & allFlowersMask(level)
  let count = 0
  while (remaining > 0) {
    count += remaining & 1
    remaining >>>= 1
  }
  return count
}

export function createInitialState(level: Level): GameState {
  return {
    position: level.start,
    bloomed: 0,
    opened: 0,
    sunk: [],
    moves: 0,
    won: false,
  }
}

export function stateKey(state: GameState): string {
  return `${state.position}|${state.bloomed}|${state.opened}|${state.sunk.join(',')}`
}

export function portalDestination(level: Level, position: number): number | null {
  for (const [first, second] of level.portals) {
    if (position === first) return second
    if (position === second) return first
  }
  return null
}

function blockedResult(state: GameState, message?: string): MoveResult {
  return { state, changed: false, events: ['blocked'], message }
}

export function move(state: GameState, level: Level, direction: Direction): MoveResult {
  if (state.won) return blockedResult(state, 'This garden is already in full bloom.')

  const currentDirection = level.oneWays[state.position]
  if (currentDirection && currentDirection !== direction) {
    return blockedResult(state, `This fern path only lets you leave ${directions[currentDirection].label}.`)
  }

  const row = Math.floor(state.position / level.width)
  const column = state.position % level.width
  const delta = directions[direction]
  const nextRow = row + delta.row
  const nextColumn = column + delta.column

  if (nextRow < 0 || nextRow >= level.height || nextColumn < 0 || nextColumn >= level.width) {
    return blockedResult(state, 'The garden edge is that way.')
  }

  const target = nextRow * level.width + nextColumn
  const tile = level.tiles[target]

  if (tile === 'hedge') return blockedResult(state, 'A hedge blocks that path.')
  if (tile === 'stone' && state.sunk.includes(target)) {
    return blockedResult(state, 'That stepping-stone has sunk. Undo or try another path.')
  }

  const gateIndex = level.gates.indexOf(target)
  if (tile === 'gate' && (state.opened & (1 << gateIndex)) === 0) {
    return blockedResult(state, 'This gate is closed. Look for its round switch.')
  }

  if (target === level.exit && state.bloomed !== allFlowersMask(level)) {
    const remaining = level.flowers.length - flowerCount(state, level)
    return blockedResult(state, `The gate needs ${remaining} more ${remaining === 1 ? 'flower' : 'flowers'} to bloom.`)
  }

  const events: MoveEvent[] = ['step']
  let sunk = state.sunk

  if (level.tiles[state.position] === 'stone' && !sunk.includes(state.position)) {
    sunk = [...sunk, state.position].sort((a, b) => a - b)
    events.push('sink')
  }

  let position = target
  const portal = portalDestination(level, target)
  if (portal !== null) {
    position = portal
    events.push('portal')
  }

  let bloomed = state.bloomed
  const flowerIndex = level.flowerBits[position]
  if (flowerIndex >= 0 && (bloomed & (1 << flowerIndex)) === 0) {
    bloomed |= 1 << flowerIndex
    events.push('bloom')
  }

  let opened = state.opened
  const switchIndex = level.switches.indexOf(position)
  if (switchIndex >= 0 && (opened & (1 << switchIndex)) === 0) {
    opened |= 1 << switchIndex
    events.push('switch')
  }

  const won = position === level.exit && bloomed === allFlowersMask(level)
  if (won) events.push('win')

  return {
    state: {
      position,
      bloomed,
      opened,
      sunk,
      moves: state.moves + 1,
      won,
    },
    changed: true,
    events,
  }
}

export function directionTo(state: GameState, level: Level, target: number): Direction | null {
  const row = Math.floor(state.position / level.width)
  const column = state.position % level.width
  const targetRow = Math.floor(target / level.width)
  const targetColumn = target % level.width

  if (targetRow === row && targetColumn === column - 1) return 'left'
  if (targetRow === row && targetColumn === column + 1) return 'right'
  if (targetColumn === column && targetRow === row - 1) return 'up'
  if (targetColumn === column && targetRow === row + 1) return 'down'
  return null
}

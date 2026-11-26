import { createInitialState, directionOrder, move, stateKey } from './engine.ts'
import type { Direction, GameState, Level } from './types.ts'

interface SearchNode {
  state: GameState
  path: Direction[]
}

export function solveLevel(
  level: Level,
  initialState: GameState = createInitialState(level),
  maxStates = 500_000,
): Direction[] | null {
  if (initialState.won) return []

  const queue: SearchNode[] = [{ state: initialState, path: [] }]
  const visited = new Set([stateKey(initialState)])
  let cursor = 0

  while (cursor < queue.length && visited.size < maxStates) {
    const node = queue[cursor]
    cursor += 1

    for (const direction of directionOrder) {
      const result = move(node.state, level, direction)
      if (!result.changed) continue

      const key = stateKey(result.state)
      if (visited.has(key)) continue

      const path = [...node.path, direction]
      if (result.state.won) return path

      visited.add(key)
      queue.push({ state: result.state, path })
    }
  }

  return null
}

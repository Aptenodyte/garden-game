import { gift } from '../content.ts'
import { createInitialState, directionOrder, move } from './engine.ts'
import { levels } from './levels.ts'
import { solveLevel } from './solver.ts'

const incorrectPars: string[] = []

for (const level of levels) {
  const solution = solveLevel(level)
  if (solution === null) {
    throw new Error(`Level ${level.id}, ${level.name}, is not solvable within the search limit.`)
  }

  let state = createInitialState(level)
  const usedPortals = new Set<number>()
  let currentChecks = 0

  for (const direction of solution) {
    const current = level.oneWays[state.position]
    if (current) {
      const wrongDirection = directionOrder.find((candidate) => candidate !== current)
      if (wrongDirection && move(state, level, wrongDirection).changed) {
        throw new Error(`Level ${level.id} allows a move against its fern path.`)
      }
      currentChecks += 1
    }

    const result = move(state, level, direction)
    if (!result.changed) throw new Error(`Level ${level.id} solution contains a blocked move.`)
    if (result.events.includes('portal')) {
      level.portals.forEach((pair, index) => {
        if (pair.includes(result.state.position)) usedPortals.add(index)
      })
    }
    state = result.state
  }

  if ((level.id === 8 || level.id === 10) && state.opened !== 3) {
    throw new Error(`Level ${level.id} can be completed without both switches.`)
  }
  if ((level.id === 9 || level.id === 10) && usedPortals.size !== 2) {
    throw new Error(`Level ${level.id} can be completed without both portal pairs.`)
  }
  if (level.id === 7 && currentChecks === 0) {
    throw new Error('Level 7 does not exercise its fern paths.')
  }

  console.log(`Level ${level.id}: ${level.name} — shortest solution ${solution.length} moves (${solution.join(', ')})`)
  if (level.par !== solution.length) {
    incorrectPars.push(`Level ${level.id}: par ${level.par}, expected ${solution.length}`)
  }
}

if (gift.notes.length !== levels.length) {
  throw new Error(`Expected ${levels.length} keepsake notes, found ${gift.notes.length}.`)
}

if (incorrectPars.length > 0) {
  throw new Error(`Update the optimal move targets:\n${incorrectPars.join('\n')}`)
}

console.log(`Validated ${levels.length} solvable levels and their optimal move targets.`)

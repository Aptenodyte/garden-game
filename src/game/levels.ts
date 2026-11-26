import type { Direction, Level, TileKind } from './types.ts'

interface LevelBlueprint {
  name: string
  subtitle: string
  lesson: string
  par: number
  rows: string[]
}

function defineLevel(id: number, blueprint: LevelBlueprint): Level {
  const { rows } = blueprint
  const width = rows[0]?.length ?? 0

  if (width === 0 || rows.some((row) => row.length !== width)) {
    throw new Error(`Level ${id} has inconsistent row widths.`)
  }

  const tiles: TileKind[] = []
  const flowers: number[] = []
  const flowerBits: number[] = []
  const switches: number[] = []
  const gates: number[] = []
  const portalPositions = new Map<string, number[]>()
  const oneWays: (Direction | null)[] = []
  let start = -1
  let exit = -1

  rows.forEach((row, rowIndex) => {
    ;[...row].forEach((symbol, columnIndex) => {
      const index = rowIndex * width + columnIndex
      let tile: TileKind = 'ground'

      if (symbol === '#') tile = 'hedge'
      if (symbol === 'E') {
        tile = 'exit'
        exit = index
      }
      if (symbol === 'S') start = index
      if (symbol === '~' || symbol === 'f') tile = 'stone'
      if (symbol === 'F' || symbol === 'f') {
        flowerBits[index] = flowers.length
        flowers.push(index)
      }
      if (symbol === 'a' || symbol === 'b') {
        tile = 'switch'
        switches[symbol === 'a' ? 0 : 1] = index
      }
      if (symbol === 'A' || symbol === 'B') {
        tile = 'gate'
        gates[symbol === 'A' ? 0 : 1] = index
      }
      if (symbol === '1' || symbol === '2') {
        tile = 'portal'
        const positions = portalPositions.get(symbol) ?? []
        positions.push(index)
        portalPositions.set(symbol, positions)
      }
      const currentDirections: Partial<Record<string, Direction>> = { '^': 'up', '>': 'right', 'v': 'down', '<': 'left' }
      if (currentDirections[symbol]) {
        tile = 'current'
        oneWays[index] = currentDirections[symbol]
      }

      tiles.push(tile)
      flowerBits[index] ??= -1
      oneWays[index] ??= null
    })
  })

  const portals = [...portalPositions.values()].map((positions) => {
    if (positions.length !== 2) {
      throw new Error(`Level ${id} needs exactly two endpoints per portal.`)
    }
    return positions as [number, number]
  })

  if (start < 0 || exit < 0 || flowers.length === 0 || flowers.length > 30) {
    throw new Error(`Level ${id} has invalid start, exit, or flower data.`)
  }

  return {
    id,
    ...blueprint,
    width,
    height: rows.length,
    tiles,
    flowers,
    flowerBits,
    start,
    exit,
    switches,
    gates,
    portals,
    oneWays,
  }
}

const blueprints: LevelBlueprint[] = [
  {
    name: 'First Light',
    subtitle: 'Wake the sleeping flowers',
    lesson: 'Visit every flower, then make your way to the glowing gate.',
    par: 12,
    rows: [
      'S....',
      '.F.F.',
      '.....',
      '.F.F.',
      '....E',
    ],
  },
  {
    name: 'The Scenic Route',
    subtitle: 'Every hedge hides a possibility',
    lesson: 'There is no time limit. A little planning can save a lot of steps.',
    par: 12,
    rows: [
      'S.#.E',
      '..#..',
      'F...F',
      '.###.',
      'F...F',
    ],
  },
  {
    name: 'Open, Sesame',
    subtitle: 'Small things can open the way',
    lesson: 'Step on the round switch to open its matching gate forever.',
    par: 19,
    rows: [
      'S...AE',
      '.###.#',
      'F..#F.',
      '.a.#..',
      '.##.#.',
      'F....F',
    ],
  },
  {
    name: 'A Little Leap',
    subtitle: 'The shortest path is not always straight',
    lesson: 'Step onto a moon ring to leap instantly to its paired ring.',
    par: 16,
    rows: [
      'S..#.E',
      '.F.#.F',
      '..1#..',
      '.###..',
      'F..1.F',
      '..#...',
    ],
  },
  {
    name: 'Soft Footsteps',
    subtitle: 'Some paths ask for a little courage',
    lesson: 'Cracked stepping-stones sink after you leave them. Undo can always bring them back.',
    par: 21,
    rows: [
      'S~~f.E',
      '.###.#',
      'F.f~F.',
      '.##.#.',
      'F....F',
      '......',
    ],
  },
  {
    name: 'The Birthday Garden',
    subtitle: 'Everything you learned, in full bloom',
    lesson: 'Open the way, take a leap, and choose your footsteps with care.',
    par: 23,
    rows: [
      'S.f#.E',
      '##~#.#',
      'F.1#F.',
      '.a.A..',
      'F~1##F',
      '..f#..',
    ],
  },
  {
    name: 'Following the Ferns',
    subtitle: 'The leaves know which way to go',
    lesson: 'Expert garden: a fern path only lets you leave in the direction of its arrow.',
    par: 23,
    rows: [
      'S.>..E',
      '.##.#.',
      'F>>v.F',
      '#....#',
      'F.^<.F',
      'F....F',
    ],
  },
  {
    name: 'Two Keys, One Heart',
    subtitle: 'The shortest route needs both',
    lesson: 'Expert garden: open both gates and plan the order of your crossings.',
    par: 37,
    rows: [
      'S...AE',
      '.#####',
      'F.a#.F',
      '.###B#',
      'F.b#.F',
      'F....F',
    ],
  },
  {
    name: 'The Moonlit Knot',
    subtitle: 'Two pairs of rings, one untangled path',
    lesson: 'Expert garden: each numbered ring has its own pair. Stones and ferns make your route matter.',
    par: 19,
    rows: [
      'S..#.E',
      '.##.#F',
      'FF1#2F',
      '####~^',
      'FF2#1F',
      'FF.#.F',
    ],
  },
  {
    name: 'The Ever After Garden',
    subtitle: 'A postscript for the brilliant gardener',
    lesson: 'Expert garden: two keys, two portal pairs, and no need to hurry. Untangle it one step at a time.',
    par: 24,
    rows: [
      'Saf#E.',
      '##~#B.',
      'F.1#2F',
      '##A###',
      '2~F#1F',
      'F<b#>F',
    ],
  },
]

export const MAIN_LEVEL_COUNT = 6
export const levels = blueprints.map((blueprint, index) => defineLevel(index + 1, blueprint))

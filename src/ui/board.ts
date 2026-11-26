import { allFlowersMask, flowerCount } from '../game/engine.ts'
import type { GameState, Level } from '../game/types.ts'
import { currentArt, flowerArt, playerArt, tileArt } from './art.ts'

interface BoardOptions {
  level: Level
  state: GameState
  hintedPosition: number | null
  freshBloom: number | null
  playerArrived: boolean
}

function tileLabel(level: Level, state: GameState, index: number, hinted: boolean): string {
  const row = Math.floor(index / level.width) + 1
  const column = (index % level.width) + 1
  const tile = level.tiles[index]
  const details: string[] = []

  if (tile === 'hedge') details.push('hedge')
  if (tile === 'stone') details.push(state.sunk.includes(index) ? 'sunken stepping-stone' : 'cracked stepping-stone')
  if (tile === 'portal') details.push('moon portal')
  if (tile === 'current') details.push(`one-way fern path, points ${level.oneWays[index] ?? 'right'}`)
  if (tile === 'switch') {
    const switchIndex = level.switches.indexOf(index)
    details.push((state.opened & (1 << switchIndex)) !== 0 ? 'activated switch' : 'unactivated switch')
  }
  if (tile === 'gate') {
    const gateIndex = level.gates.indexOf(index)
    details.push((state.opened & (1 << gateIndex)) !== 0 ? 'open gate' : 'closed gate')
  }
  if (tile === 'exit') details.push(state.bloomed === allFlowersMask(level) ? 'open exit' : 'sleeping exit')

  const flowerIndex = level.flowerBits[index]
  if (flowerIndex >= 0) {
    details.push((state.bloomed & (1 << flowerIndex)) !== 0 ? 'blooming flower' : 'sleeping flower')
  }
  if (state.position === index) details.push('firefly is here')
  if (hinted) details.push('suggested next step')
  if (details.length === 0) details.push('garden path')

  return `Row ${row}, column ${column}: ${details.join(', ')}`
}

export function renderBoard({ level, state, hintedPosition, freshBloom, playerArrived }: BoardOptions): string {
  const cells = level.tiles.map((tile, index) => {
    const flowerIndex = level.flowerBits[index]
    const isBloomed = flowerIndex >= 0 && (state.bloomed & (1 << flowerIndex)) !== 0
    const isSunk = tile === 'stone' && state.sunk.includes(index)
    const gateIndex = tile === 'gate' ? level.gates.indexOf(index) : -1
    const switchIndex = tile === 'switch' ? level.switches.indexOf(index) : -1
    const isActive =
      (tile === 'gate' && (state.opened & (1 << gateIndex)) !== 0) ||
      (tile === 'switch' && (state.opened & (1 << switchIndex)) !== 0) ||
      (tile === 'exit' && state.bloomed === allFlowersMask(level))
    const hinted = hintedPosition === index
    const classes = [
      'tile',
      `tile--${tile}`,
      isBloomed ? 'tile--bloomed' : '',
      isSunk ? 'tile--sunk' : '',
      isActive ? 'tile--active' : '',
      hinted ? 'tile--hinted' : '',
      state.position === index ? 'tile--player' : '',
    ].filter(Boolean).join(' ')

    return `<button type="button" class="${classes}" data-position="${index}" tabindex="-1"
      aria-label="${tileLabel(level, state, index, hinted)}">
      <span class="tile-texture" aria-hidden="true"></span>
      ${tile === 'current' ? currentArt(level.oneWays[index] ?? 'right') : tileArt(tile, tile === 'stone' ? isSunk : isActive)}
      ${flowerIndex >= 0 ? flowerArt(isBloomed, freshBloom === index) : ''}
      ${state.position === index ? playerArt(playerArrived) : ''}
      ${hinted ? '<span class="hint-ring" aria-hidden="true"></span>' : ''}
    </button>`
  }).join('')

  const bloomed = flowerCount(state, level)
  return `<div class="board-frame">
    <span class="frame-leaf frame-leaf--one" aria-hidden="true"></span>
    <span class="frame-leaf frame-leaf--two" aria-hidden="true"></span>
    <div class="board" data-board tabindex="0" role="group"
      aria-label="${level.name} puzzle board"
      aria-describedby="board-instructions board-status"
      style="--board-columns:${level.width};--board-rows:${level.height}">${cells}</div>
    <p class="visually-hidden" id="board-position">The firefly is at row ${Math.floor(state.position / level.width) + 1}, column ${(state.position % level.width) + 1}. ${bloomed} of ${level.flowers.length} flowers are blooming.</p>
  </div>`
}

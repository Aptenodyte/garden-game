
import { flowerCount } from '../game/engine.ts'
import { levels } from '../game/levels.ts'
import type { GameState, Level, SaveData } from '../game/types.ts'
import { icon } from './art.ts'
import { renderBoard } from './board.ts'
import { header } from './title-map.ts'

interface GameViewOptions {
  level: Level
  state: GameState
  save: SaveData
  canUndo: boolean
  message: string
  hintedPosition: number | null
  freshBloom: number | null
  playerArrived: boolean
}

export function renderGame(options: GameViewOptions): string {
  const { level, state, save, message, canUndo } = options
  const blooms = flowerCount(state, level)
  const moveNote = state.moves <= level.par ? 'Golden-path pace' : 'Enjoying the scenic route'

  return `${header(save)}
    <main class="game-screen screen" id="main-content">
      <section class="game-heading">
        <div>
          <p class="eyebrow">Garden ${String(level.id).padStart(2, '0')} <span aria-hidden="true">/</span> ${String(levels.length).padStart(2, '0')}</p>
          <h1 id="level-title" data-heading tabindex="-1">${level.name}</h1>
          <p>${level.subtitle}</p>
        </div>
        <button type="button" class="button button--quiet" data-action="map">${icon('map')} Garden map</button>
      </section>
      <div class="game-layout">
        <section class="puzzle-area" aria-label="Puzzle">
          ${renderBoard(options)}
          <p class="board-instructions" id="board-instructions">Use <kbd>Arrow keys</kbd> or <kbd>WASD</kbd> to move. You can also select a neighboring tile.</p>
        </section>
        <aside class="game-panel" aria-label="Game information and controls">
          <div class="level-lesson"><span class="lesson-icon">${icon('sparkles')}</span><p>${level.lesson}</p></div>
          <dl class="game-stats">
            <div><dt>Flowers</dt><dd><span class="stat-flower" aria-hidden="true">✿</span> ${blooms}<span class="stat-total"> / ${level.flowers.length}</span></dd></div>
            <div><dt>Moves</dt><dd>${state.moves}<span class="stat-total"> / par ${level.par}</span></dd><dd class="stat-note">${moveNote}</dd></div>
          </dl>
          <div class="game-controls" aria-label="Puzzle controls">
            <button type="button" class="control-button" data-action="undo" ${canUndo ? '' : 'disabled'} aria-keyshortcuts="U">${icon('undo')}<span>Undo</span></button>
            <button type="button" class="control-button" data-action="restart" aria-keyshortcuts="R">${icon('restart')}<span>Restart</span></button>
            <button type="button" class="control-button control-button--hint" data-action="hint" aria-keyshortcuts="H">${icon('hint')}<span>Hint</span></button>
          </div>
          <p class="game-message" id="board-status" role="status" aria-live="polite" aria-atomic="true">${message}</p>
          <details class="help-details">
            <summary>A little help</summary>
            <div><p>Bloom every flower to open the gate. There is no move limit and no wrong way to finish.</p><p>Keyboard shortcuts: <kbd>U</kbd> undo, <kbd>R</kbd> restart, <kbd>H</kbd> hint.</p></div>
          </details>
        </aside>
      </div>
    </main>`
}

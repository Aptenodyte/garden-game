
import { GardenAudio } from '../game/audio.ts'
import { createInitialState, directionTo, directions, flowerCount, move } from '../game/engine.ts'
import { levels, MAIN_LEVEL_COUNT } from '../game/levels.ts'
import { solveLevel } from '../game/solver.ts'
import { loadSave, recordCompletion, storeSave } from '../game/storage.ts'
import type { Direction, GameState, Level, SaveData } from '../game/types.ts'
import { KeepsakeDialog } from './dialogs.ts'
import { renderGame } from './screens.ts'
import { renderMap, renderTitle } from './title-map.ts'

type Screen = 'title' | 'map' | 'game'
type FocusTarget = 'heading' | 'board' | 'sound' | undefined

export class GardenApp {
  private root: HTMLElement
  private save: SaveData
  private audio: GardenAudio
  private dialog: KeepsakeDialog
  private screen: Screen = 'title'
  private level: Level | null = null
  private state: GameState | null = null
  private history: GameState[] = []
  private message = 'The garden is ready when you are.'
  private hintedPosition: number | null = null
  private freshBloom: number | null = null
  private playerArrived = false

  constructor(root: HTMLElement) {
    this.root = root
    this.save = loadSave(levels.length)
    this.audio = new GardenAudio(this.save.muted)
    this.dialog = new KeepsakeDialog((action, levelId) => this.handleDialogAction(action, levelId))
    this.root.addEventListener('click', (event) => this.handleClick(event))
    this.root.addEventListener('keydown', (event) => this.handleKeydown(event))
    this.render()
  }

  private render(focus: FocusTarget = undefined): void {
    if (this.screen === 'title') {
      this.root.innerHTML = renderTitle(this.save)
      document.title = 'A Little Garden for You'
    } else if (this.screen === 'map') {
      this.root.innerHTML = renderMap(this.save)
      document.title = 'Your Garden Path · A Little Garden for You'
    } else if (this.level && this.state) {
      this.root.innerHTML = renderGame({
        level: this.level,
        state: this.state,
        save: this.save,
        canUndo: this.history.length > 0,
        message: this.message,
        hintedPosition: this.hintedPosition,
        freshBloom: this.freshBloom,
        playerArrived: this.playerArrived,
      })
      document.title = `${this.level.name} · A Little Garden for You`
      this.freshBloom = null
      this.playerArrived = false
    }

    if (focus) {
      const selector = focus === 'board' ? '[data-board]' : focus === 'sound' ? '[data-action="toggle-sound"]' : '[data-heading]'
      this.root.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true })
    }
  }

  private showTitle(): void {
    this.dialog.close()
    window.scrollTo(0, 0)
    this.screen = 'title'
    this.render('heading')
  }

  private showMap(): void {
    this.dialog.close()
    window.scrollTo(0, 0)
    this.screen = 'map'
    this.render('heading')
  }

  private startLevel(levelId: number): void {
    const level = levels[levelId - 1]
    if (!level || levelId > this.save.unlocked) return

    this.dialog.close()
    window.scrollTo(0, 0)
    this.screen = 'game'
    this.level = level
    this.state = createInitialState(level)
    this.history = []
    this.hintedPosition = null
    this.freshBloom = null
    this.message = 'The garden is ready when you are.'
    this.render('board')
    this.audio.play('open')
  }

  private continueGame(): void {
    const next = levels.find((level) => level.id <= this.save.unlocked && !this.save.records[String(level.id)]?.completed)
    if (next) this.startLevel(next.id)
    else this.showMap()
  }

  private toggleSound(): void {
    this.save = { ...this.save, muted: !this.save.muted }
    this.audio.setMuted(this.save.muted)
    storeSave(this.save)
    this.render('sound')
    if (!this.save.muted) this.audio.play('open')
  }

  private handleDialogAction(action: string, levelId?: number): void {
    if (action === 'close-dialog') this.dialog.close()
    if (action === 'next-level' && levelId) this.startLevel(levelId)
    if (action === 'open-letter') this.dialog.showLetter()
    if (action === 'map') this.showMap()
    if (action === 'replay-finale') this.startLevel(MAIN_LEVEL_COUNT)
  }

  private performMove(direction: Direction): void {
    if (!this.level || !this.state) return
    const result = move(this.state, this.level, direction)

    if (!result.changed) {
      this.message = result.message ?? 'Try another path.'
      this.render('board')
      return
    }

    this.history.push(this.state)
    this.state = result.state
    this.hintedPosition = null
    this.playerArrived = true
    this.freshBloom = result.events.includes('bloom') ? result.state.position : null

    if (result.events.includes('win')) this.message = 'Every flower is awake. This garden is yours.'
    else if (result.events.includes('bloom')) this.message = 'A flower just woke up. Beautiful work.'
    else if (result.events.includes('switch')) this.message = 'Click. A gate has opened somewhere in the garden.'
    else if (result.events.includes('portal')) this.message = 'A little moon magic carried you across the garden.'
    else if (result.events.includes('sink')) this.message = 'The stone slipped into the water. Undo can bring it back.'
    else this.message = `${flowerCount(result.state, this.level)} of ${this.level.flowers.length} flowers blooming.`

    if (result.state.won) {
      this.save = recordCompletion(this.save, this.level.id, result.state.moves, this.level.par, levels.length)
      storeSave(this.save)
    }

    this.render('board')
    if (result.events.includes('win')) this.audio.play('win')
    else {
      if (result.events.includes('step')) this.audio.play('step')
      if (result.events.includes('sink')) this.audio.play('sink')
      if (result.events.includes('portal')) this.audio.play('portal')
      if (result.events.includes('switch')) this.audio.play('switch')
      if (result.events.includes('bloom')) this.audio.play('bloom')
    }

    if (result.state.won) this.dialog.showNote(this.level.id, true, result.state.moves)
  }

  private selectTile(target: number): void {
    if (!this.level || !this.state) return
    const direction = directionTo(this.state, this.level, target)
    if (direction) {
      this.performMove(direction)
      return
    }

    this.message = 'Choose a tile directly beside the firefly, or use the arrow keys.'
    this.render('board')
  }

  private undo(): void {
    if (!this.level || !this.state) return
    const previous = this.history.pop()
    if (!previous) {
      this.message = 'You are right at the beginning. No steps to undo yet.'
      this.render('board')
      return
    }

    this.state = previous
    this.hintedPosition = null
    this.freshBloom = null
    this.message = 'One step back, and endless possibilities ahead.'
    this.render('board')
    this.audio.play('open')
  }

  private restart(): void {
    if (!this.level || !this.state) return
    this.history.push(this.state)
    this.state = createInitialState(this.level)
    this.hintedPosition = null
    this.freshBloom = null
    this.message = 'A fresh path. Your previous attempt is still one Undo away.'
    this.render('board')
    this.audio.play('open')
  }

  private showHint(): void {
    if (!this.level || !this.state) return
    const path = solveLevel(this.level, this.state)

    if (!path || path.length === 0) {
      this.message = 'No route remains from this position. Undo a step or restart, and I will find the way.'
      this.hintedPosition = null
    } else {
      const direction = path[0]
      const delta = directions[direction]
      const row = Math.floor(this.state.position / this.level.width)
      const column = this.state.position % this.level.width
      this.hintedPosition = (row + delta.row) * this.level.width + column + delta.column
      this.message = `Try stepping ${delta.label}. The glowing tile is the next step on a shortest route.`
    }

    this.render('board')
    this.audio.play('open')
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    const tile = target.closest<HTMLElement>('[data-position]')
    if (tile && this.screen === 'game') {
      this.selectTile(Number(tile.dataset.position))
      return
    }

    const button = target.closest<HTMLButtonElement>('[data-action]')
    if (!button || button.disabled) return
    const action = button.dataset.action

    if (action === 'title') this.showTitle()
    if (action === 'map') this.showMap()
    if (action === 'start-first') this.startLevel(1)
    if (action === 'continue') this.continueGame()
    if (action === 'play-level') this.startLevel(Number(button.dataset.level))
    if (action === 'read-note') this.dialog.showNote(Number(button.dataset.level), false)
    if (action === 'open-letter') this.dialog.showLetter()
    if (action === 'toggle-sound') this.toggleSound()
    if (action === 'undo') this.undo()
    if (action === 'restart') this.restart()
    if (action === 'hint') this.showHint()
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (this.screen !== 'game' || this.dialog.open || !this.state) return
    const target = event.target as HTMLElement
    const key = event.key.toLowerCase()
    const directionByKey: Record<string, Direction | undefined> = {
      arrowup: 'up', w: 'up',
      arrowdown: 'down', s: 'down',
      arrowleft: 'left', a: 'left',
      arrowright: 'right', d: 'right',
    }
    const direction = directionByKey[key]

    if (direction && target.closest('[data-board]')) {
      event.preventDefault()
      this.performMove(direction)
      return
    }

    if (key === 'u') {
      event.preventDefault()
      this.undo()
    }
    if (key === 'r') {
      event.preventDefault()
      this.restart()
    }
    if (key === 'h') {
      event.preventDefault()
      this.showHint()
    }
  }
}

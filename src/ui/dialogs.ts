import { gift } from '../content.ts'
import { levels, MAIN_LEVEL_COUNT } from '../game/levels.ts'
import { brandArt, icon, petals } from './art.ts'

type DialogAction = (action: string, levelId?: number) => void

export class KeepsakeDialog {
  private element: HTMLDialogElement
  private onAction: DialogAction

  constructor(onAction: DialogAction) {
    this.onAction = onAction
    this.element = document.createElement('dialog')
    this.element.className = 'gift-dialog'
    this.element.setAttribute('aria-labelledby', 'dialog-title')
    document.body.append(this.element)
    this.element.addEventListener('click', (event) => this.handleClick(event))
  }

  get open(): boolean {
    return this.element.open
  }

  close(): void {
    this.element.close()
  }

  showNote(levelId: number, completedNow: boolean, moves?: number): void {
    const level = levels[levelId - 1]
    const note = gift.notes[levelId - 1]
    const isFinale = levelId === MAIN_LEVEL_COUNT
    const isLast = levelId === levels.length
    const primaryAction = completedNow ? (isFinale ? 'open-letter' : isLast ? 'map' : 'next-level') : 'close-dialog'
    const primaryLabel = completedNow
      ? isFinale ? 'Open your birthday letter' : isLast ? 'Back to the garden map' : 'Visit the next garden'
      : 'Back to the garden'

    this.element.classList.toggle('gift-dialog--letter', false)
    this.present(`<article class="keepsake-card">
      <button type="button" class="dialog-close icon-button" data-dialog-action="close-dialog" aria-label="Close keepsake">${icon('close')}</button>
      <div class="keepsake-flower">${brandArt()}</div>
      <p class="eyebrow">Keepsake ${String(levelId).padStart(2, '0')} · ${level.name}</p>
      <h2 id="dialog-title" tabindex="-1">${note.title}</h2>
      <p class="keepsake-text">${note.text}</p>
      ${moves === undefined ? '' : `<p class="completion-stats">${icon(moves <= level.par ? 'sparkles' : 'check')} Garden complete in <strong>${moves} moves</strong>${moves <= level.par ? ' · Golden path earned' : ''}</p>`}
      <div class="dialog-actions">
        <button type="button" class="button button--primary" data-dialog-action="${primaryAction}" data-level="${isFinale ? levelId : levelId + 1}">
          ${primaryLabel}${icon(isFinale ? 'heart' : 'arrow')}
        </button>
        ${completedNow ? `<button type="button" class="text-button" data-dialog-action="map">Return to the garden map</button>` : ''}
      </div>
    </article>`)
  }

  showLetter(): void {
    this.element.classList.add('gift-dialog--letter')
    this.present(`${petals()}
      <article class="letter-card">
        <button type="button" class="dialog-close icon-button" data-dialog-action="close-dialog" aria-label="Close birthday letter">${icon('close')}</button>
        <div class="letter-seal">${icon('heart')}</div>
        <p class="eyebrow">A letter for the birthday gardener</p>
        <h2 id="dialog-title" tabindex="-1">${gift.letter.title}</h2>
        <div class="letter-body">${gift.letter.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}</div>
        <p class="letter-signature">${gift.letter.signature}</p>
        <div class="dialog-actions">
          <button type="button" class="button button--primary" data-dialog-action="map">Keep this garden${icon('heart')}</button>
          <button type="button" class="text-button" data-dialog-action="replay-finale">Replay the final garden</button>
        </div>
      </article>`)
  }

  private present(content: string): void {
    this.element.innerHTML = content
    if (!this.element.open) this.element.showModal()
    this.element.querySelector<HTMLElement>('#dialog-title')?.focus({ preventScroll: true })
    this.element.scrollTop = 0
  }

  private handleClick(event: MouseEvent): void {
    if (event.target === this.element) {
      this.close()
      return
    }

    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-dialog-action]')
    if (!button) return
    const levelId = Number(button.dataset.level) || undefined
    this.onAction(button.dataset.dialogAction ?? '', levelId)
  }
}

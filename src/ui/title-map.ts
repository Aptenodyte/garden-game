
import { gift } from '../content.ts'
import { levels, MAIN_LEVEL_COUNT } from '../game/levels.ts'
import type { SaveData } from '../game/types.ts'
import { brandArt, heroArt, icon } from './art.ts'

function soundButton(muted: boolean): string {
  return `<button type="button" class="icon-button" data-action="toggle-sound"
    aria-label="${muted ? 'Turn sound on' : 'Turn sound off'}" aria-pressed="${muted}">
    ${icon(muted ? 'muted' : 'sound')}<span class="sound-label">${muted ? 'Sound off' : 'Sound on'}</span>
  </button>`
}

export function header(save: SaveData, showHome = true): string {
  return `<header class="site-header">
    ${showHome
      ? `<button type="button" class="brand-button" data-action="title" aria-label="Return to title">${brandArt()}<span>${gift.title}</span></button>`
      : `<div class="brand-button brand-button--static">${brandArt()}<span>${gift.title}</span></div>`}
    ${soundButton(save.muted)}
  </header>`
}

export function renderTitle(save: SaveData): string {
  const hasProgress = Object.values(save.records).some((record) => record.completed)
  const birthdayUnlocked = levels.slice(0, MAIN_LEVEL_COUNT).every((level) => save.records[String(level.id)]?.completed)
  const primaryAction = birthdayUnlocked ? 'open-letter' : hasProgress ? 'continue' : 'start-first'
  const primaryLabel = birthdayUnlocked ? 'Read your birthday letter' : hasProgress ? 'Continue your adventure' : 'Begin the adventure'

  return `${header(save, false)}
    <main class="title-screen screen" id="main-content">
      <section class="title-copy">
        <p class="eyebrow">${gift.eyebrow}</p>
        <h1 data-heading tabindex="-1">${gift.title}</h1>
        <p class="title-dedication">For ${gift.recipient}, with a whole heart</p>
        <p class="title-intro">${gift.intro}</p>
        <div class="title-actions">
          <button type="button" class="button button--primary" data-action="${primaryAction}">
            <span>${primaryLabel}</span>${icon(birthdayUnlocked ? 'heart' : 'arrow')}
          </button>
          ${birthdayUnlocked ? '<button type="button" class="button button--quiet" data-action="continue">Play the expert postscript</button>' : ''}
          ${hasProgress && !birthdayUnlocked ? '<button type="button" class="button button--quiet" data-action="start-first">Play from the beginning</button>' : ''}
          ${hasProgress ? '<button type="button" class="text-button" data-action="map">Visit the garden map</button>' : ''}
        </div>
      </section>
      <div class="title-visual">${heroArt()}<p class="hero-caption">A little world waiting for you to help it bloom.</p></div>
    </main>`
}

export function renderMap(save: SaveData): string {
  const storyCompleted = levels.slice(0, MAIN_LEVEL_COUNT).filter((level) => save.records[String(level.id)]?.completed).length
  const expertCompleted = levels.slice(MAIN_LEVEL_COUNT).filter((level) => save.records[String(level.id)]?.completed).length
  const birthdayUnlocked = storyCompleted === MAIN_LEVEL_COUNT
  const cards = levels.map((level, index) => {
    const record = save.records[String(level.id)]
    const locked = level.id > save.unlocked
    const state = locked ? 'locked' : record?.completed ? 'complete' : 'available'
    const status = locked ? 'Sleeping' : record?.completed ? `${record.bestMoves} best moves` : 'Ready to bloom'

    const chapter = level.id === MAIN_LEVEL_COUNT + 1
      ? `<li class="postscript-heading">
          <p class="eyebrow">Optional postscript · ${expertCompleted} of ${levels.length - MAIN_LEVEL_COUNT} complete</p>
          <h2>Extra levels for fun!</h2>
        </li>`
      : ''

    return `${chapter}<li class="path-stop path-stop--${state} ${level.id > MAIN_LEVEL_COUNT ? 'path-stop--expert' : ''}" style="--stop:${index}">
      <article class="level-card">
        <div class="level-number" aria-hidden="true">${locked ? icon('lock') : record?.parEarned ? icon('sparkles') : String(level.id).padStart(2, '0')}</div>
        <div class="level-card-copy">
          <p class="level-status">${status}</p>
          <h2>${level.name}</h2>
          <p>${level.subtitle}</p>
          ${record?.completed ? `<span class="par-badge">${record.parEarned ? `${icon('sparkles')} Golden path` : `Par ${level.par}`}</span>` : ''}
        </div>
        <div class="level-card-actions">
          <button type="button" class="button ${state === 'available' ? 'button--primary' : 'button--small'}"
            data-action="play-level" data-level="${level.id}" ${locked ? 'disabled' : ''}
            aria-label="${record?.completed ? 'Replay' : locked ? 'Locked' : 'Play'} ${level.name}">
            ${locked ? icon('lock') : icon('play')}<span>${record?.completed ? 'Replay' : locked ? 'Locked' : 'Play'}</span>
          </button>
          ${record?.completed ? `<button type="button" class="text-button" data-action="read-note" data-level="${level.id}">${icon('book')} Read note</button>` : ''}
        </div>
      </article>
    </li>`
  }).join('')

  return `${header(save)}
    <main class="map-screen screen" id="main-content">
      <section class="map-heading">
        <p class="eyebrow">Your keepsake collection</p>
        <h1 data-heading tabindex="-1">The garden path</h1>
        <p>${storyCompleted} of ${MAIN_LEVEL_COUNT} birthday gardens blooming. Every bloom brings a little note.</p>
        <div class="map-progress" role="progressbar" aria-label="Birthday gardens completed" aria-valuemin="0" aria-valuemax="${MAIN_LEVEL_COUNT}" aria-valuenow="${storyCompleted}">
          <span style="--progress:${(storyCompleted / MAIN_LEVEL_COUNT) * 100}%"></span>
        </div>
      </section>
      ${birthdayUnlocked ? `<section class="letter-banner"><div><p class="eyebrow">Your final keepsake</p><h2>A birthday letter, just for you</h2></div><button type="button" class="button button--primary" data-action="open-letter">${icon('heart')} Read your letter</button></section>` : ''}
      <ol class="level-path">${cards}</ol>
    </main>`
}

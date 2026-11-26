const iconPaths = {
  map: '<path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3Z"/><path d="M8 3v15M16 6v15"/>',
  sound: '<path d="M11 5 6 9H3v6h3l5 4Z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
  muted: '<path d="M11 5 6 9H3v6h3l5 4Z"/><path d="m16 10 5 5m0-5-5 5"/>',
  undo: '<path d="m9 7-5 5 5 5"/><path d="M4 12h9a7 7 0 0 1 7 7"/>',
  restart: '<path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 0-1.2 5"/>',
  hint: '<path d="M9 18h6M10 22h4"/><path d="M8.4 14.5A6 6 0 1 1 15.6 14.5C14.6 15.2 14 16 14 18h-4c0-2-.6-2.8-1.6-3.5Z"/><path d="M12 5v3"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  book: '<path d="M4 5a3 3 0 0 1 3-2h5v17H7a3 3 0 0 0-3 2Zm16 0a3 3 0 0 0-3-2h-5v17h5a3 3 0 0 1 3 2Z"/>',
  play: '<path d="m8 5 11 7-11 7Z"/>',
  heart: '<path d="M20.8 5.7a5.5 5.5 0 0 0-7.8 0L12 6.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  sparkles: '<path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8ZM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8Z"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
} as const

export type IconName = keyof typeof iconPaths

export function icon(name: IconName, className = ''): string {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`
}

export function brandArt(): string {
  return `<svg class="brand-art" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M24 41V22" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M24 34c-8 0-12-4-12-9 8 0 12 4 12 9Zm0-5c8 0 12-4 12-9-8 0-12 4-12 9Z" fill="currentColor" opacity=".7"/>
    <ellipse cx="24" cy="12" rx="5" ry="9" fill="currentColor"/>
    <ellipse cx="24" cy="12" rx="5" ry="9" fill="currentColor" transform="rotate(72 24 20)"/>
    <ellipse cx="24" cy="12" rx="5" ry="9" fill="currentColor" transform="rotate(144 24 20)"/>
    <ellipse cx="24" cy="12" rx="5" ry="9" fill="currentColor" transform="rotate(216 24 20)"/>
    <ellipse cx="24" cy="12" rx="5" ry="9" fill="currentColor" transform="rotate(288 24 20)"/>
    <circle cx="24" cy="20" r="4" fill="#f8d68a"/>
  </svg>`
}

export function flowerArt(bloomed: boolean, fresh = false): string {
  if (!bloomed) {
    return `<svg class="flower-art flower-art--sleeping" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 53V31M32 44c-8 0-12-4-12-9 8 0 12 4 12 9Zm0 3c8 0 12-4 12-9-8 0-12 4-12 9Z" class="flower-stem"/>
      <path d="M24 27c0-8 3-15 8-19 5 4 8 11 8 19-2 4-5 6-8 6s-6-2-8-6Z" class="flower-bud"/>
      <path d="M32 9v20" class="bud-fold"/>
    </svg>`
  }

  return `<svg class="flower-art flower-art--bloomed ${fresh ? 'flower-art--fresh' : ''}" viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 56V33M32 46c-8 0-13-4-13-10 9 0 13 4 13 10Zm0 3c8 0 13-4 13-10-9 0-13 4-13 10Z" class="flower-stem"/>
    <g class="flower-petals">
      <ellipse cx="32" cy="17" rx="7" ry="13"/>
      <ellipse cx="32" cy="17" rx="7" ry="13" transform="rotate(60 32 29)"/>
      <ellipse cx="32" cy="17" rx="7" ry="13" transform="rotate(120 32 29)"/>
      <ellipse cx="32" cy="17" rx="7" ry="13" transform="rotate(180 32 29)"/>
      <ellipse cx="32" cy="17" rx="7" ry="13" transform="rotate(240 32 29)"/>
      <ellipse cx="32" cy="17" rx="7" ry="13" transform="rotate(300 32 29)"/>
    </g>
    <circle cx="32" cy="29" r="7" class="flower-heart"/>
    <circle cx="30" cy="27" r="2" class="flower-heart-light"/>
  </svg>`
}

export function playerArt(arrived = false): string {
  return `<svg class="player-art ${arrived ? 'player-art--arrived' : ''}" viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="24" class="player-glow"/>
    <ellipse cx="23" cy="27" rx="9" ry="13" class="player-wing" transform="rotate(-35 23 27)"/>
    <ellipse cx="41" cy="27" rx="9" ry="13" class="player-wing" transform="rotate(35 41 27)"/>
    <path d="M27 22c-2-5-5-6-7-7m17 7c2-5 5-6 7-7" class="player-antenna"/>
    <ellipse cx="32" cy="35" rx="9" ry="14" class="player-body"/>
    <circle cx="32" cy="24" r="8" class="player-head"/>
    <circle cx="29" cy="23" r="1.2" class="player-eye"/>
    <circle cx="35" cy="23" r="1.2" class="player-eye"/>
    <path d="M29 28c2 2 4 2 6 0" class="player-smile"/>
  </svg>`
}

export function tileArt(kind: string, active = false): string {
  if (kind === 'hedge') {
    return `<svg class="tile-art hedge-art" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 54V29m40 25V29M32 54V18" class="hedge-branches"/>
      <circle cx="18" cy="35" r="13"/><circle cx="31" cy="23" r="16"/><circle cx="46" cy="36" r="14"/><circle cx="32" cy="43" r="17"/>
      <path d="M20 24c5 3 8 7 10 12m15 2c-5 1-9 4-12 8" class="hedge-veins"/>
    </svg>`
  }
  if (kind === 'switch') {
    return `<svg class="tile-art switch-art ${active ? 'is-active' : ''}" viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="43" rx="20" ry="8" class="switch-base"/>
      <ellipse cx="32" cy="37" rx="15" ry="9" class="switch-top"/>
      <path d="m27 37 5-8 5 8-5 4Z" class="switch-gem"/>
    </svg>`
  }
  if (kind === 'gate') {
    return `<svg class="tile-art gate-art ${active ? 'is-open' : ''}" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M14 55V28a18 18 0 0 1 36 0v27" class="gate-arch"/>
      <g class="gate-bars"><path d="M21 54V25m7 29V17m8 29V17m7 37V25"/><path d="M16 38h32M15 48h34"/></g>
      <path d="M12 55h40" class="gate-step"/>
    </svg>`
  }
  if (kind === 'exit') {
    return `<svg class="tile-art exit-art ${active ? 'is-open' : ''}" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M14 56V29a18 18 0 0 1 36 0v27" class="exit-arch"/>
      <path d="M21 56V30a11 11 0 0 1 22 0v26" class="exit-door"/>
      <path d="m32 19 2.2 5.8L40 27l-5.8 2.2L32 35l-2.2-5.8L24 27l5.8-2.2Z" class="exit-star"/>
      <circle cx="38" cy="42" r="1.5" class="exit-handle"/>
    </svg>`
  }
  if (kind === 'portal') {
    return `<svg class="tile-art portal-art" viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="39" rx="23" ry="14" class="portal-outer"/>
      <ellipse cx="32" cy="39" rx="15" ry="8" class="portal-inner"/>
      <path d="M20 18h2m20 2h2M32 11v3" class="portal-stars"/>
    </svg>`
  }
  if (kind === 'stone') {
    return `<svg class="tile-art stone-art ${active ? 'is-sunk' : ''}" viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="46" rx="23" ry="8" class="stone-ripple"/>
      <path d="m13 37 7-17 19-5 13 12-5 17-21 5Z" class="stone-rock"/>
      <path d="m32 18-4 11 8 5-6 13m-2-18-8 3m16-3 9-3" class="stone-cracks"/>
    </svg>`
  }
  return ''
}

export function currentArt(direction: 'up' | 'down' | 'left' | 'right'): string {
  const rotation = { up: -90, down: 90, left: 180, right: 0 }[direction]
  return `<svg class="tile-art current-art" viewBox="0 0 64 64" style="--current-rotation:${rotation}deg" aria-hidden="true">
    <path d="M12 46c11-23 24-28 40-28M20 46c8-14 17-20 28-22" class="current-stem"/>
    <path d="m34 9 17 10-17 10M14 23l10 7-10 7" class="current-arrow"/>
    <path d="M24 31c-9-1-13-6-13-12 8 1 13 5 13 12Zm13-7c-2-8 1-14 7-17 2 8 0 14-7 17Z" class="current-leaf"/>
  </svg>`
}

export function heroArt(): string {
  return `<svg class="hero-art" viewBox="0 0 640 400" aria-hidden="true">
    <defs>
      <linearGradient id="hero-moon" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff5cf"/><stop offset="1" stop-color="#eebf82"/></linearGradient>
      <linearGradient id="hero-leaves" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#527e6c"/><stop offset="1" stop-color="#233f3c"/></linearGradient>
    </defs>
    <circle cx="320" cy="132" r="94" fill="url(#hero-moon)" class="hero-moon"/>
    <circle cx="355" cy="106" r="86" fill="#211b35"/>
    <g class="hero-stars" fill="#f8d68a"><circle cx="152" cy="90" r="2"/><circle cx="488" cy="73" r="2"/><circle cx="516" cy="152" r="1.5"/><circle cx="123" cy="161" r="1.5"/><path d="m451 110 3 8 8 3-8 3-3 8-3-8-8-3 8-3ZM189 129l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"/></g>
    <path d="M157 336V185a163 163 0 0 1 326 0v151" fill="none" stroke="#9a755f" stroke-width="14" stroke-linecap="round"/>
    <path d="M172 337V190a148 148 0 0 1 296 0v147" fill="none" stroke="#d0a17c" stroke-width="3"/>
    <g fill="none" stroke="#527e6c" stroke-width="5" stroke-linecap="round"><path d="M155 275c-38-93 15-184 93-220m237 221c38-93-15-184-93-220"/><path d="M163 207c-35-12-44-37-39-59m357 59c35-12 44-37 39-59"/></g>
    <g fill="url(#hero-leaves)">
      <ellipse cx="159" cy="248" rx="15" ry="31" transform="rotate(-35 159 248)"/><ellipse cx="181" cy="190" rx="15" ry="31" transform="rotate(45 181 190)"/><ellipse cx="199" cy="138" rx="15" ry="31" transform="rotate(-35 199 138)"/><ellipse cx="241" cy="83" rx="15" ry="31" transform="rotate(48 241 83)"/>
      <ellipse cx="481" cy="248" rx="15" ry="31" transform="rotate(35 481 248)"/><ellipse cx="459" cy="190" rx="15" ry="31" transform="rotate(-45 459 190)"/><ellipse cx="441" cy="138" rx="15" ry="31" transform="rotate(35 441 138)"/><ellipse cx="399" cy="83" rx="15" ry="31" transform="rotate(-48 399 83)"/>
    </g>
    <path d="M220 342c33-45 56-65 100-65s67 20 100 65" fill="#272842"/>
    <path d="M275 342c11-32 23-46 45-46s34 14 45 46" fill="#e9c3a0" opacity=".8"/>
    <g class="hero-firefly"><circle cx="320" cy="245" r="31" fill="#f8d68a" opacity=".08"/><circle cx="320" cy="245" r="15" fill="#f8d68a" opacity=".15"/><ellipse cx="310" cy="240" rx="8" ry="12" fill="#e9f2d9" opacity=".8" transform="rotate(-35 310 240)"/><ellipse cx="330" cy="240" rx="8" ry="12" fill="#e9f2d9" opacity=".8" transform="rotate(35 330 240)"/><ellipse cx="320" cy="249" rx="7" ry="12" fill="#efb65f"/><circle cx="320" cy="239" r="6" fill="#48353b"/></g>
    <path d="M71 353c70-31 123-24 177 5m321-5c-70-31-123-24-177 5" fill="none" stroke="#395b50" stroke-width="7" stroke-linecap="round"/>
    <g class="hero-flowers"><g transform="translate(130 317)"><path d="M0 40V8" stroke="#75a184" stroke-width="4"/><g fill="#d98e9f"><circle cx="0" cy="0" r="11"/><circle cx="13" cy="8" r="11"/><circle cx="8" cy="22" r="11"/><circle cx="-8" cy="22" r="11"/><circle cx="-13" cy="8" r="11"/></g><circle cx="0" cy="11" r="7" fill="#f8d68a"/></g><g transform="translate(502 321) scale(.85)"><path d="M0 40V8" stroke="#75a184" stroke-width="4"/><g fill="#b6a0d8"><circle cx="0" cy="0" r="11"/><circle cx="13" cy="8" r="11"/><circle cx="8" cy="22" r="11"/><circle cx="-8" cy="22" r="11"/><circle cx="-13" cy="8" r="11"/></g><circle cx="0" cy="11" r="7" fill="#f8d68a"/></g></g>
    <path d="M42 369h556" stroke="#517463" stroke-width="2" stroke-linecap="round" opacity=".5"/>
  </svg>`
}

export function petals(count = 18): string {
  return `<div class="petals" aria-hidden="true">${Array.from({ length: count }, (_, index) => {
    const x = (index * 37) % 100
    const delay = (index % 7) * 0.16
    const drift = ((index * 19) % 80) - 40
    return `<span class="petal" style="--petal-x:${x}%;--petal-delay:${delay}s;--petal-drift:${drift}px"></span>`
  }).join('')}</div>`
}

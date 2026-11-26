export type SoundCue = 'step' | 'bloom' | 'switch' | 'portal' | 'sink' | 'win' | 'open'

export class GardenAudio {
  private context: AudioContext | null = null
  muted: boolean

  constructor(muted: boolean) {
    this.muted = muted
  }

  setMuted(muted: boolean): void {
    this.muted = muted
    if (muted) void this.context?.suspend()
  }

  play(cue: SoundCue): void {
    if (this.muted || typeof AudioContext === 'undefined') return

    this.context ??= new AudioContext()
    if (this.context.state === 'suspended') void this.context.resume()

    const now = this.context.currentTime + 0.01
    if (cue === 'step') this.tone(240, now, 0.07, 0.018, 'sine', 280)
    if (cue === 'sink') this.tone(150, now, 0.16, 0.025, 'sine', 90)
    if (cue === 'switch') {
      this.tone(196, now, 0.18, 0.035, 'triangle', 220)
      this.tone(392, now + 0.08, 0.22, 0.025, 'sine', 440)
    }
    if (cue === 'portal') {
      this.tone(260, now, 0.32, 0.025, 'sine', 880)
      this.tone(520, now + 0.08, 0.25, 0.015, 'sine', 1040)
    }
    if (cue === 'bloom' || cue === 'open') {
      const notes = cue === 'open' ? [392, 523.25, 659.25] : [523.25, 659.25, 783.99]
      notes.forEach((note, index) => this.tone(note, now + index * 0.07, 0.3, 0.025, 'sine'))
    }
    if (cue === 'win') {
      ;[392, 493.88, 587.33, 783.99, 987.77].forEach((note, index) => {
        this.tone(note, now + index * 0.1, 0.55, 0.035, index % 2 === 0 ? 'sine' : 'triangle')
      })
    }
  }

  private tone(
    frequency: number,
    start: number,
    duration: number,
    volume: number,
    type: OscillatorType,
    endFrequency?: number,
  ): void {
    if (!this.context) return

    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, start)
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration)

    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.025)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(gain)
    gain.connect(this.context.destination)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.02)
  }
}

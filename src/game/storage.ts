import { MAIN_LEVEL_COUNT } from './levels.ts'
import type { LevelRecord, SaveData } from './types.ts'

const storageKey = 'little-garden-save-v1'

export function emptySave(): SaveData {
  return { version: 1, unlocked: 1, records: {}, muted: false }
}

function validRecord(value: unknown): value is LevelRecord {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Partial<LevelRecord>
  return (
    typeof record.completed === 'boolean' &&
    typeof record.parEarned === 'boolean' &&
    (record.bestMoves === null || (typeof record.bestMoves === 'number' && record.bestMoves >= 0))
  )
}

export function loadSave(levelCount: number): SaveData {
  const fallback = emptySave()

  try {
    const raw = localStorage.getItem(storageKey)
    if (raw === null) return fallback

    const parsed = JSON.parse(raw) as Partial<SaveData>
    if (parsed.version !== 1 || typeof parsed.records !== 'object' || parsed.records === null) {
      return fallback
    }

    const records: Record<string, LevelRecord> = {}
    for (const [id, record] of Object.entries(parsed.records)) {
      if (validRecord(record)) records[id] = record
    }

    const savedUnlocked = Math.max(1, Math.min(levelCount, Math.floor(Number(parsed.unlocked) || 1)))
    const postscriptUnlocked = records[String(MAIN_LEVEL_COUNT)]?.completed ? MAIN_LEVEL_COUNT + 1 : 1

    return {
      version: 1,
      unlocked: Math.min(levelCount, Math.max(savedUnlocked, postscriptUnlocked)),
      records,
      muted: parsed.muted === true,
    }
  } catch {
    return fallback
  }
}

export function storeSave(save: SaveData): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(save))
  } catch {
    return
  }
}

export function recordCompletion(save: SaveData, levelId: number, moves: number, par: number, levelCount: number): SaveData {
  const previous = save.records[String(levelId)]
  const bestMoves = previous?.bestMoves == null ? moves : Math.min(previous.bestMoves, moves)

  return {
    ...save,
    unlocked: Math.max(save.unlocked, Math.min(levelCount, levelId + 1)),
    records: {
      ...save.records,
      [String(levelId)]: {
        completed: true,
        bestMoves,
        parEarned: Boolean(previous?.parEarned) || moves <= par,
      },
    },
  }
}

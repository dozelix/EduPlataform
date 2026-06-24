import { describe, it, expect } from 'vitest'
import { STATS, HERO_STATS } from './stats.js'

describe('STATS', () => {
  it('expone una lista no vacía', () => {
    expect(Array.isArray(STATS)).toBe(true)
    expect(STATS.length).toBeGreaterThan(0)
  })

  it('cada métrica tiene value, label y un badgeType válido', () => {
    for (const s of STATS) {
      expect(typeof s.value).toBe('string')
      expect(typeof s.label).toBe('string')
      expect(s.label.length).toBeGreaterThan(0)
      expect(['success', 'primary', 'accent']).toContain(s.badgeType)
    }
  })
})

describe('HERO_STATS', () => {
  it('cada hero stat tiene value y label', () => {
    for (const s of HERO_STATS) {
      expect(typeof s.value).toBe('string')
      expect(typeof s.label).toBe('string')
    }
  })

  it('los hero stats son un subconjunto coherente de STATS', () => {
    const statLabels = new Set(STATS.map((s) => s.label))
    for (const s of HERO_STATS) {
      expect(statLabels.has(s.label)).toBe(true)
    }
  })
})

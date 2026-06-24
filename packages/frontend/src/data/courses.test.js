import { describe, it, expect } from 'vitest'
import { COURSES, FEATURED_COURSES } from './courses.js'

describe('COURSES', () => {
  it('expone una lista no vacía', () => {
    expect(Array.isArray(COURSES)).toBe(true)
    expect(COURSES.length).toBeGreaterThan(0)
  })

  it('cada curso tiene los campos requeridos y tipos correctos', () => {
    for (const c of COURSES) {
      expect(typeof c.title).toBe('string')
      expect(c.title.length).toBeGreaterThan(0)
      expect(typeof c.instructor).toBe('string')
      expect(typeof c.students).toBe('number')
      expect(typeof c.rating).toBe('number')
      expect(['active', 'review', 'draft']).toContain(c.status)
    }
  })

  it('rating está entre 0 y 5 y progress entre 0 y 100', () => {
    for (const c of COURSES) {
      expect(c.rating).toBeGreaterThanOrEqual(0)
      expect(c.rating).toBeLessThanOrEqual(5)
      expect(c.progress).toBeGreaterThanOrEqual(0)
      expect(c.progress).toBeLessThanOrEqual(100)
    }
  })

  it('no hay títulos duplicados', () => {
    const titles = COURSES.map((c) => c.title)
    expect(new Set(titles).size).toBe(titles.length)
  })
})

describe('FEATURED_COURSES', () => {
  it('selecciona exactamente los 3 cursos destacados', () => {
    expect(FEATURED_COURSES).toHaveLength(3)
    expect(FEATURED_COURSES.map((c) => c.title)).toEqual([
      'Introducción a JavaScript',
      'Node.js y Express',
      'MongoDB para desarrolladores',
    ])
  })

  it('asigna category y level a cada curso destacado (arrays paralelos alineados)', () => {
    expect(FEATURED_COURSES.map((c) => c.category)).toEqual([
      'Desarrollo Web',
      'Backend',
      'Base de datos',
    ])
    expect(FEATURED_COURSES.map((c) => c.level)).toEqual([
      'Principiante',
      'Intermedio',
      'Intermedio',
    ])
  })

  it('conserva los datos originales del curso', () => {
    const js = FEATURED_COURSES.find((c) => c.title === 'Introducción a JavaScript')
    expect(js.instructor).toBe('Ana García')
    expect(js.students).toBe(1242)
  })
})

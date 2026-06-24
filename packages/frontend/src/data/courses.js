export const COURSES = [
  {
    title: 'Introducción a JavaScript',
    instructor: 'Ana García',
    students: 1242,
    rating: 4.8,
    duration: '12h 30m',
    status: 'active',
    progress: 78,
    accent: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
  },
  {
    title: 'React desde cero',
    instructor: 'Carlos López',
    students: 890,
    rating: 4.6,
    duration: '8h 15m',
    status: 'active',
    progress: 45,
    accent: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)',
  },
  {
    title: 'Node.js y Express',
    instructor: 'María Rodríguez',
    students: 670,
    rating: 4.9,
    duration: '10h 00m',
    status: 'review',
    progress: 92,
    accent: 'linear-gradient(135deg, #10b981 0%, #6ee7b7 100%)',
  },
  {
    title: 'MongoDB para desarrolladores',
    instructor: 'Pedro Martínez',
    students: 530,
    rating: 4.5,
    duration: '6h 45m',
    status: 'active',
    progress: 31,
    accent: 'linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)',
  },
  {
    title: 'TypeScript avanzado',
    instructor: 'Sofía Herrera',
    students: 380,
    rating: 4.7,
    duration: '9h 20m',
    status: 'draft',
    progress: 15,
    accent: 'linear-gradient(135deg, #ef4444 0%, #fca5a5 100%)',
  },
  {
    title: 'CSS y diseño responsive',
    instructor: 'Luis Castro',
    students: 2010,
    rating: 4.4,
    duration: '7h 10m',
    status: 'active',
    progress: 60,
    accent: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
  },
]

export const FEATURED_COURSES = COURSES.filter((c) =>
  ['Introducción a JavaScript', 'Node.js y Express', 'MongoDB para desarrolladores'].includes(
    c.title
  )
).map((c, i) => ({
  ...c,
  category: ['Desarrollo Web', 'Backend', 'Base de datos'][i],
  level: ['Principiante', 'Intermedio', 'Intermedio'][i],
}))

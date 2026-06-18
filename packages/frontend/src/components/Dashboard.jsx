import React, { useState } from 'react'
import './Dashboard.css'

const IconGraduationCap = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
)
const IconGrid = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)
const IconUsers = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconBook = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
)
const IconBarChart = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)
const IconSettings = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)
const IconBell = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const IconLogOut = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const IconPlus = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const IconMenu = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)
const IconClose = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const IconStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
)
const IconClock = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const MOCK_USER = { name: 'Jean', initials: 'JE' }

const NAV_ITEMS = [
  { id: 'dashboard', icon: <IconGrid />, label: 'Dashboard' },
  { id: 'users', icon: <IconUsers />, label: 'Usuarios' },
  { id: 'courses', icon: <IconBook />, label: 'Cursos' },
  { id: 'grades', icon: <IconBarChart />, label: 'Calificaciones' },
  { id: 'settings', icon: <IconSettings />, label: 'Configuración' },
]

const STATS = [
  {
    value: '1,248',
    label: 'Estudiantes activos',
    badge: '+12 este mes',
    badgeType: 'success',
    color: '#7c3aed',
  },
  {
    value: '24',
    label: 'Cursos publicados',
    badge: '3 nuevos',
    badgeType: 'primary',
    color: '#06b6d4',
  },
  {
    value: '156',
    label: 'Lecciones totales',
    badge: 'publicadas',
    badgeType: 'accent',
    color: '#f59e0b',
  },
  {
    value: '89%',
    label: 'Tasa de completación',
    badge: '↑ 4% vs antes',
    badgeType: 'success',
    color: '#10b981',
  },
]

const COURSES = [
  {
    title: 'Introducción a JavaScript',
    instructor: 'Ana García',
    students: 142,
    rating: 4.8,
    duration: '12h 30m',
    status: 'active',
    progress: 78,
    accent: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
  },
  {
    title: 'React desde cero',
    instructor: 'Carlos López',
    students: 89,
    rating: 4.6,
    duration: '8h 15m',
    status: 'active',
    progress: 45,
    accent: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)',
  },
  {
    title: 'Node.js y Express',
    instructor: 'María Rodríguez',
    students: 67,
    rating: 4.9,
    duration: '10h 00m',
    status: 'review',
    progress: 92,
    accent: 'linear-gradient(135deg, #10b981 0%, #6ee7b7 100%)',
  },
  {
    title: 'MongoDB para desarrolladores',
    instructor: 'Pedro Martínez',
    students: 53,
    rating: 4.5,
    duration: '6h 45m',
    status: 'active',
    progress: 31,
    accent: 'linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)',
  },
  {
    title: 'TypeScript avanzado',
    instructor: 'Sofía Herrera',
    students: 38,
    rating: 4.7,
    duration: '9h 20m',
    status: 'draft',
    progress: 15,
    accent: 'linear-gradient(135deg, #ef4444 0%, #fca5a5 100%)',
  },
  {
    title: 'CSS y diseño responsive',
    instructor: 'Luis Castro',
    students: 201,
    rating: 4.4,
    duration: '7h 10m',
    status: 'active',
    progress: 60,
    accent: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
  },
]

const STATUS_LABELS = {
  active: 'Activo',
  review: 'En revisión',
  draft: 'Borrador',
}

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  const handleNav = (id) => {
    setActiveNav(id)
    setSidebarOpen(false)
  }

  return (
    <div className="db-layout">
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      <aside
        className={`db-sidebar${sidebarOpen ? ' open' : ''}`}
        role="navigation"
        aria-label="Menú principal"
      >
        <div className="db-sidebar__brand">
          <div className="db-sidebar__brand-icon" aria-hidden="true">
            <IconGraduationCap />
          </div>
          <div className="db-sidebar__brand-text">
            <div className="db-sidebar__brand-name">EduPlatform</div>
            <div className="db-sidebar__brand-sub">Panel de control</div>
          </div>
          <button
            className="db-sidebar__close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <IconClose />
          </button>
        </div>

        <nav className="db-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`db-sidebar__nav-item${activeNav === item.id ? ' active' : ''}`}
              onClick={() => handleNav(item.id)}
              aria-current={activeNav === item.id ? 'page' : undefined}
            >
              <span className="db-sidebar__nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="db-sidebar__footer">
          <button className="db-sidebar__logout">
            <IconLogOut />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="db-main">
        <header className="db-topbar">
          <div className="db-topbar__left">
            <button
              className="db-topbar__hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <IconMenu />
            </button>
            <div className="db-topbar__greeting">
              <span className="db-topbar__sub">{greeting},</span>
              <span className="db-topbar__name">{MOCK_USER.name}!</span>
            </div>
          </div>

          <div className="db-topbar__actions">
            <button className="db-topbar__icon-btn" aria-label="Notificaciones">
              <IconBell />
              <span className="db-topbar__badge" aria-hidden="true">
                3
              </span>
            </button>
            <div className="db-topbar__avatar" title={`Perfil de ${MOCK_USER.name}`}>
              {MOCK_USER.initials}
            </div>
          </div>
        </header>

        <main className="db-content" id="main">
          <div className="db-page-header">
            <div>
              <h1 className="db-page-header__title">Dashboard</h1>
              <p className="db-page-header__sub">Resumen general de la plataforma</p>
            </div>
            <button className="db-cta">
              <IconPlus />
              Nuevo curso
            </button>
          </div>

          <section className="db-stats" aria-label="Estadísticas principales">
            {STATS.map((s, i) => (
              <article key={s.label} className="db-stat" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="db-stat__bar" style={{ background: s.color }} />
                <div className="db-stat__value">{s.value}</div>
                <div className="db-stat__label">{s.label}</div>
                <span className={`db-stat__badge ${s.badgeType}`}>{s.badge}</span>
              </article>
            ))}
          </section>

          <div className="db-section-header">
            <h2 className="db-section-header__title">Cursos recientes</h2>
            <button className="db-link-btn">Ver todos →</button>
          </div>

          <section className="db-courses" aria-label="Cursos recientes">
            {COURSES.map((course, i) => (
              <article
                key={course.title}
                className="db-course-card"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div
                  className="db-course-card__thumb"
                  style={{ background: course.accent }}
                  aria-hidden="true"
                >
                  <span className={`db-course-card__status ${course.status}`}>
                    {STATUS_LABELS[course.status]}
                  </span>
                </div>

                <div className="db-course-card__body">
                  <h3 className="db-course-card__title">{course.title}</h3>
                  <p className="db-course-card__instructor">{course.instructor}</p>

                  <div className="db-course-card__meta">
                    <span className="db-course-card__rating">
                      <IconStar />
                      {course.rating}
                    </span>
                    <span className="db-course-card__duration">
                      <IconClock />
                      {course.duration}
                    </span>
                    <span className="db-course-card__students">
                      {course.students.toLocaleString('es-CL')} alumnos
                    </span>
                  </div>

                  <div className="db-course-card__progress">
                    <div className="db-progress__track">
                      <div className="db-progress__fill" style={{ width: `${course.progress}%` }} />
                    </div>
                    <span className="db-progress__pct">{course.progress}%</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}
import React, { useState } from 'react'
import { IconSearch, IconStar, IconClock, IconArrowRight } from '../../components/icons/Icons'
import { COURSES } from '../../data/courses'

const STATUS_LABELS = {
  active: 'Activo',
  review: 'En revisión',
  draft: 'Borrador',
}

const STATUS_FILTERS = ['Todos', 'Activo', 'En revisión', 'Borrador']

export default function AllCourses() {
  const [search, setSearch] = useState('')
  const [activeStatus, setActiveStatus] = useState('Todos')

  const filtered = COURSES.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase())
    const matchStatus =
      activeStatus === 'Todos' || STATUS_LABELS[c.status] === activeStatus
    return matchSearch && matchStatus
  })

  return (
    <section className="lp-section" id="todos-los-cursos">
      <div className="lp-container">

        <div className="lp-section__header">
          <div className="lp-section__header-text">
            <p className="lp-section__label">✦ Catálogo Completo</p>
            <h2 className="lp-section__title">Explora todos los cursos</h2>
            <p className="lp-section__desc">
              {COURSES.length} cursos disponibles para comenzar hoy.
            </p>
          </div>
        </div>

        <div className="lp-courses__toolbar">
          <div className="lp-search-wrap">
            <span className="lp-search-wrap__icon">
              <IconSearch size={16} />
            </span>
            <input
              className="lp-search-input"
              type="search"
              placeholder="Buscar por nombre o instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="lp-courses__filter-group">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                className={`lp-filter-chip${activeStatus === f ? ' active' : ''}`}
                onClick={() => setActiveStatus(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="lp-courses__grid">
            {filtered.map((course) => (
              <article className="lp-course-card" key={course.title}>

                <div
                  className="lp-course-card__thumb"
                  style={{ background: course.accent }}
                >
                  <span className={`lp-course-card__status ${course.status}`}>
                    {STATUS_LABELS[course.status]}
                  </span>
                </div>

                <div className="lp-course-card__body">
                  <h3 className="lp-course-card__title">{course.title}</h3>
                  <p className="lp-course-card__instructor">{course.instructor}</p>

                  <div className="lp-course-card__meta">
                    <span className="lp-meta-rating">
                      <IconStar /> {course.rating}
                    </span>
                    <span className="lp-meta-item">
                      <IconClock /> {course.duration}
                    </span>
                    <span className="lp-meta-item">
                      {course.students.toLocaleString('es-CL')} alumnos
                    </span>
                  </div>

                  <div className="lp-course-card__progress">
                    <div className="lp-prog-track">
                      <div
                        className="lp-prog-fill"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="lp-prog-pct">{course.progress}%</span>
                  </div>
                </div>

              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--lp-text-muted)' }}>
            No se encontraron cursos para "{search}".
          </div>
        )}

        <div className="lp-courses__footer">
          <button className="lp-btn-ghost">
            Ver catálogo completo <IconArrowRight />
          </button>
        </div>

      </div>
    </section>
  )
}

import React, { useState } from 'react'
import { IconStar, IconClock, IconArrowRight } from '../../components/icons/Icons'
import { FEATURED_COURSES as FEATURED } from '../../data/courses'

const CATEGORIES = ['Todos', 'Desarrollo', 'Diseño', 'Datos', 'Negocios']

export default function FeaturedCourses() {
  const [activeFilter, setActiveFilter] = useState('Todos')

  return (
    <section className="lp-section lp-section--alt" id="cursos-destacados">
      <div className="lp-container">

        <div className="lp-section__header">
          <div className="lp-section__header-text">
            <p className="lp-section__label">✦ Cursos Destacados</p>
            <h2 className="lp-section__title">Los más populares<br />esta semana</h2>
            <p className="lp-section__desc">
              Seleccionados por nuestro equipo editorial basándonos en
              valoraciones, tasa de completación y relevancia del contenido.
            </p>
          </div>
          <button className="lp-link-btn">
            Ver todos los cursos <IconArrowRight />
          </button>
        </div>

        <div className="lp-featured__filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`lp-filter-chip${activeFilter === cat ? ' active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="lp-featured__grid">
          {FEATURED.map((course) => (
            <article className="lp-feat-card" key={course.title}>

              <div
                className="lp-feat-card__thumb"
                style={{ background: course.thumb }}
              >
                <span className="lp-feat-card__cat-badge">{course.category}</span>
              </div>

              <div className="lp-feat-card__body">
                <span className="lp-feat-card__level">{course.level}</span>
                <h3 className="lp-feat-card__title">{course.title}</h3>
                <p className="lp-feat-card__instructor">por {course.instructor}</p>

                <div className="lp-feat-card__meta">
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
              </div>

              <div className="lp-feat-card__footer">
                <div className="lp-feat-card__progress-wrap">
                  <span className="lp-feat-card__progress-label">
                    Progreso del grupo: {course.progress}%
                  </span>
                  <div className="lp-feat-card__progress-track">
                    <div
                      className="lp-feat-card__progress-fill"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <button className="lp-feat-card__cta">Comenzar</button>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

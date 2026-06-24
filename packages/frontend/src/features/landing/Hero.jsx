import React from 'react'
import { IconArrowRight, IconPlayCircle, IconStar } from '../../components/icons/Icons'

const HERO_CARDS = [
  {
    thumb: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    cat: 'Desarrollo Web',
    title: 'JavaScript Moderno ES2024',
    rating: '4.8',
    students: '1.2k',
  },
  {
    thumb: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
    cat: 'Frontend',
    title: 'React & TypeScript desde cero',
    rating: '4.9',
    students: '890',
  },
  {
    thumb: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    cat: 'Backend',
    title: 'Node.js y Express completo',
    rating: '4.7',
    students: '670',
  },
]

export default function Hero({ onExploreClick = () => {} }) {
  return (
    <section className="lp-hero" id="inicio">
      <div className="lp-hero__bg">
        <div className="lp-hero__blob-1" />
        <div className="lp-hero__blob-2" />
        <div className="lp-hero__blob-3" />
      </div>

      <div className="lp-hero__inner">
        <div className="lp-hero__content">

          <span className="lp-hero__badge">
            🎓 Plataforma Educativa
          </span>

          <h1 className="lp-hero__title">
            Aprende. Crece.<br />
            <span className="lp-gradient-text">Transforma tu futuro.</span>
          </h1>

          <p className="lp-hero__desc">
            Accede a cientos de cursos diseñados por expertos en desarrollo,
            diseño y tecnología. A tu ritmo, desde cualquier lugar.
          </p>

          <div className="lp-hero__ctas">
            <button className="lp-btn-primary" onClick={onExploreClick}>
              Explorar cursos <IconArrowRight />
            </button>
            <button className="lp-btn-ghost">
              <IconPlayCircle /> Ver cómo funciona
            </button>
          </div>

          <div className="lp-hero__stats">
            <div className="lp-hero__stat">
              <span className="lp-hero__stat-value">1,248</span>
              <span className="lp-hero__stat-label">Estudiantes activos</span>
            </div>
            <div className="lp-hero__stat-sep" />
            <div className="lp-hero__stat">
              <span className="lp-hero__stat-value">24</span>
              <span className="lp-hero__stat-label">Cursos publicados</span>
            </div>
            <div className="lp-hero__stat-sep" />
            <div className="lp-hero__stat">
              <span className="lp-hero__stat-value">89%</span>
              <span className="lp-hero__stat-label">Tasa de completación</span>
            </div>
          </div>

        </div>

        <div className="lp-hero__visual" aria-hidden="true">
          {HERO_CARDS.map((card) => (
            <div className="lp-hero__card" key={card.title}>
              <div
                className="lp-hero__card-thumb"
                style={{ background: card.thumb }}
              />
              <div className="lp-hero__card-cat">{card.cat}</div>
              <div className="lp-hero__card-title">{card.title}</div>
              <div className="lp-hero__card-footer">
                <span className="lp-hero__card-rating">
                  <IconStar /> {card.rating}
                </span>
                <span className="lp-hero__card-students">{card.students} alumnos</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

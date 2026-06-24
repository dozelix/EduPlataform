import React from 'react'
import StatsGrid from '../../components/StatsGrid'
import CourseCard from '../../components/CourseCard'
import { IconPlus } from '../../components/icons/Icons'
import { COURSES } from '../../data/courses'

export default function Dashboard() {
  return (
    <>
      <div className="db-page-header">
        <div>
          <h1 className="db-page-header__title">Dashboard</h1>
          <p className="db-page-header__sub">Resumen general de la plataforma</p>
        </div>
        <button className="db-cta">
          <IconPlus /> Nuevo curso
        </button>
      </div>

      <StatsGrid />

      <div className="db-section-header">
        <h2 className="db-section-header__title">Cursos recientes</h2>
        <button className="db-link-btn">Ver todos →</button>
      </div>

      <section className="db-courses" aria-label="Cursos recientes">
        {COURSES.map((course, i) => (
          <CourseCard key={course.title} course={course} index={i} />
        ))}
      </section>
    </>
  )
}

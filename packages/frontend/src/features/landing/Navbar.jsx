import React, { useState, useEffect } from 'react'
import { IconGraduationCap, IconSearch, IconUser, IconBook } from '../../components/icons/Icons'

const NAV_LINKS = [
  { label: 'Inicio',        href: '#inicio' },
  { label: 'Cursos',        href: '#cursos-destacados' },
  { label: 'Catálogo',      href: '#todos-los-cursos' },
  { label: 'Sobre Nosotros', href: '#footer' },
]

export default function Navbar({ onLoginClick, onCoursesClick }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`lp-navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="lp-navbar__inner">

        <a className="lp-navbar__brand" href="#inicio">
          <div className="lp-navbar__logo">
            <IconGraduationCap />
          </div>
          <span className="lp-navbar__brand-name">EduPlatform</span>
        </a>

        <ul className="lp-navbar__nav">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a className="lp-navbar__nav-link" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="lp-navbar__actions">
          <button className="lp-navbar__icon-btn" aria-label="Buscar cursos">
            <IconSearch size={18} />
          </button>

          <button className="lp-navbar__btn-login" onClick={onLoginClick}>
            <IconUser size={16} />
            <span>Iniciar sesión</span>
          </button>

          <button className="lp-navbar__btn-courses" onClick={onCoursesClick}>
            <IconBook />
            <span>Cursos</span>
          </button>
        </div>

      </div>
    </nav>
  )
}

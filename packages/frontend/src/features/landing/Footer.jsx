import React from 'react'
import { IconGraduationCap } from '../../components/icons/Icons'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="lp-footer" id="footer">
      <div className="lp-footer__inner">

        <a className="lp-footer__brand" href="#inicio">
          <div className="lp-footer__logo">
            <IconGraduationCap />
          </div>
          <span className="lp-footer__name">EduPlatform</span>
        </a>

        <nav className="lp-footer__links" aria-label="Enlaces del pie de página">
          <a className="lp-footer__link" href="#">Términos de uso</a>
          <a className="lp-footer__link" href="#">Privacidad</a>
          <a className="lp-footer__link" href="#">Contacto</a>
        </nav>

        <span className="lp-footer__copy">© {year} EduPlatform</span>

      </div>
    </footer>
  )
}

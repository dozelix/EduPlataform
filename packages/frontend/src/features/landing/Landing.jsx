import React, { useState } from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import FeaturedCourses from './FeaturedCourses'
import AllCourses from './AllCourses'
import Footer from './Footer'
import { LoginRegister } from '../../components/LoginRegister'
import { IconClose } from '../../components/icons/Icons'

export default function Landing({ onLoginSuccess }) {
  const [showAuth, setShowAuth] = useState(false)

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="lp">
      <Navbar
        onLoginClick={() => setShowAuth(true)}
        onCoursesClick={() => scrollToSection('cursos-destacados')}
      />

      <main>
        <Hero onExploreClick={() => scrollToSection('cursos-destacados')} />
        <FeaturedCourses />
        <AllCourses />
      </main>

      <Footer />

      {showAuth && (
        <div
          className="lp-auth-modal"
          onClick={() => setShowAuth(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Iniciar sesión"
        >
          <div
            className="lp-auth-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lp-auth-modal__close"
              onClick={() => setShowAuth(false)}
              aria-label="Cerrar"
            >
              <IconClose />
            </button>
            <LoginRegister onSuccess={(user) => {
              setShowAuth(false)
              onLoginSuccess?.(user)
            }} />
          </div>
        </div>
      )}
    </div>
  )
}

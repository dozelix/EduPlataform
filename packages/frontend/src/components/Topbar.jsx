import React from 'react'
import { IconMenu, IconBell } from './icons/Icons'

export default function Topbar({ user, isAuthenticated, onLogin, setSidebarOpen }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
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
          {isAuthenticated ? (
            <>
              <span className="db-topbar__sub">{greeting},</span>
              <span className="db-topbar__name">{user.name}!</span>
            </>
          ) : (
            <>
              <span className="db-topbar__sub">Bienvenido a EduPlatform</span>
              <span className="db-topbar__name">Explora el catálogo</span>
            </>
          )}
        </div>
      </div>

      <div className="db-topbar__actions">
        {isAuthenticated ? (
          <>
            <button className="db-topbar__icon-btn" aria-label="Notificaciones">
              <IconBell />
              <span className="db-topbar__badge" aria-hidden="true">
                3
              </span>
            </button>
            <div className="db-topbar__avatar" title={`Perfil de ${user.name}`}>
              {user.initials}
            </div>
          </>
        ) : (
          <button className="db-topbar__login" onClick={onLogin}>
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  )
}

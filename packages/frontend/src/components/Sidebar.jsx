import React from 'react'
import {
  IconGraduationCap,
  IconClose,
  IconLogOut,
  IconBook,
  IconBarChart,
} from './icons/Icons'

const NAV_ITEMS = [
  { id: 'courses', icon: <IconBook />, label: 'Catálogo' },
  { id: 'learning', icon: <IconBarChart />, label: 'Mi Aprendizaje' },
]

export default function Sidebar({
  activeNav,
  sidebarOpen,
  setSidebarOpen,
  handleNav,
  isAuthenticated,
  onLogout,
  dbStatus,
}) {
  return (
    <>
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
          {dbStatus && (
            <div
              className="sidebar__status"
              style={{
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                background: 'var(--color-surface-2)',
                fontSize: '12px',
                color: 'var(--color-text-muted)',
              }}
            >
              <span
                className={`sidebar__status-dot ${dbStatus}`}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background:
                    dbStatus === 'connected'
                      ? 'var(--color-success)'
                      : dbStatus === 'error'
                        ? 'var(--color-danger)'
                        : 'var(--color-text-muted)',
                }}
              />
              <span>DB: {dbStatus.toUpperCase()}</span>
            </div>
          )}
          {isAuthenticated && (
            <button className="db-sidebar__logout" onClick={onLogout}>
              <IconLogOut />
              Cerrar sesión
            </button>
          )}
        </div>
      </aside>
    </>
  )
}

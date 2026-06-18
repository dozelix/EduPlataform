import React from 'react'

export default function Sidebar({ navItems, activeNav, onNavChange, dbStatus }) {
  const statusLabel = {
    idle: 'Sin conectar',
    loading: 'Conectando...',
    connected: 'MongoDB conectado',
    error: 'Error de conexión',
  }[dbStatus] || 'Sin conectar'

  const statusDotClass = {
    idle: '',
    loading: '',
    connected: 'connected',
    error: 'error',
  }[dbStatus] || ''

  return (
    <aside className="sidebar" role="navigation" aria-label="Menú principal">
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon" aria-hidden="true">🎓</div>
        <div>
          <div className="sidebar__brand-name">EduPlatform</div>
          <div className="sidebar__brand-sub">v1.0.0 • Dev Mode</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(item => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`sidebar__nav-item${activeNav === item.id ? ' active' : ''}`}
            onClick={() => onNavChange(item.id)}
            aria-current={activeNav === item.id ? 'page' : undefined}
          >
            <span className="icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__status" role="status" aria-live="polite">
          <div className={`sidebar__status-dot ${statusDotClass}`} />
          <span>{statusLabel}</span>
        </div>
      </div>
    </aside>
  )
}
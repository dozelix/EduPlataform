import React from 'react'

export default function StatsGrid() {
  const stats = [
    { icon: '📦', value: '3', label: 'Paquetes (workspaces)', badge: 'main • frontend • shared' },
    { icon: '🔌', value: '5', label: 'IPC Handlers (user)', badge: 'CRUD completo' },
    { icon: '🍃', value: '1', label: 'Modelos Mongoose', badge: 'User model' },
    { icon: '🔒', value: '✓', label: 'contextIsolation', badge: 'Seguro' },
  ]

  return (
    <section className="stats-grid" aria-label="Estado del proyecto">
      {stats.map((s, i) => (
        <article
          className="stat-card"
          key={i}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="stat-card__icon" aria-hidden="true">{s.icon}</div>
          <div className="stat-card__value">{s.value}</div>
          <div className="stat-card__label">{s.label}</div>
          <span className="stat-card__badge">{s.badge}</span>
        </article>
      ))}
    </section>
  )
}
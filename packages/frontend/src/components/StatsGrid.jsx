import React from 'react'
import { STATS } from '../data/stats'

export default function StatsGrid() {
  return (
    <section className="db-stats" aria-label="Estadísticas principales">
      {STATS.map((s, i) => (
        <article key={s.label} className="db-stat" style={{ animationDelay: `${i * 0.06}s` }}>
          <div className="db-stat__bar" style={{ background: s.color }} />
          <div className="db-stat__value">{s.value}</div>
          <div className="db-stat__label">{s.label}</div>
          <span className={`db-stat__badge ${s.badgeType}`}>{s.badge}</span>
        </article>
      ))}
    </section>
  )
}

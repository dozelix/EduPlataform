import React from 'react'

export default function Checklist() {
  const checklistItems = [
    { label: 'React 18 + Vite 5', done: true, icon: '⚛️' },
    { label: 'Electron 27', done: true, icon: '⚡' },
    { label: 'Mongoose 8 (MongoDB)', done: true, icon: '🍃' },
    { label: 'JavaScript ES6+', done: true, icon: '💛' },
    { label: 'Monorepo (npm workspaces)', done: true, icon: '📦' },
    { label: 'IPC Bridge seguro', done: true, icon: '🔒' },
    { label: 'Shared items package', done: true, icon: '🤝' },
    { label: 'ESLint + Prettier', done: true, icon: '✨' },
  ]

  return (
    <section className="setup-card" aria-labelledby="checklist-title">
      <h2 className="setup-card__title" id="checklist-title">
        <span aria-hidden="true">✅</span> Checklist de Setup
      </h2>
      <ul className="setup-card__checklist">
        {checklistItems.map((item, i) => (
          <li key={i} className={`checklist-item${item.done ? ' done' : ''}`}>
            <span className="checklist-item__icon" aria-hidden="true">
              {item.done ? '✅' : '⏳'}
            </span>
            <span>{item.icon} {item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
import React, { useState, useEffect } from 'react'
import Dashboard from './features/dashboard/Dashboard'
import { LoginRegister } from './features/auth/LoginRegister'

// ======================================================
// App.jsx — Dashboard de bienvenida / pantalla inicial
// Prueba la conexión IPC → Mongoose → MongoDB
// ======================================================

function App() {
  const [dbStatus, setDbStatus] = useState('idle')
  const [result, setResult] = useState('')
  const [activeNav, setActiveNav] = useState('dashboard')
  const [isElectron] = useState(() => typeof window !== 'undefined' && !!window.api)

  // Detectar si estamos en Electron al montar
  useEffect(() => {
    if (isElectron) {
      setDbStatus('connected')
    }
  }, [isElectron])

  const testGetUsers = async () => {
    if (!window.api) {
      setResult('⚠️ window.api no disponible. ¿Estás corriendo fuera de Electron?')
      return
    }
    setDbStatus('loading')
    try {
      const response = await window.api.invoke('user:get-all')
      if (response.success) {
        setDbStatus('connected')
        setResult(
          `✅ Usuarios en DB:\n${JSON.stringify(response.data, null, 2)}`
        )
      } else {
        setDbStatus('error')
        setResult(`❌ Error: ${response.error}`)
      }
    } catch (err) {
      setDbStatus('error')
      setResult(`❌ IPC Error: ${err.message}`)
    }
  }

  const testCreateUser = async () => {
    if (!window.api) {
      setResult('⚠️ window.api no disponible.')
      return
    }
    setDbStatus('loading')
    try {
      const testUser = {
        name: `Test User ${Date.now()}`,
        email: `test.${Date.now()}@eduplatform.com`,
        role: 'student',
      }
      const response = await window.api.invoke('user:create', testUser)
      if (response.success) {
        setDbStatus('connected')
        setResult(
          `✅ Usuario creado:\n${JSON.stringify(response.data, null, 2)}`
        )
      } else {
        setDbStatus('error')
        setResult(`❌ Error: ${response.error}`)
      }
    } catch (err) {
      setDbStatus('error')
      setResult(`❌ IPC Error: ${err.message}`)
    }
  }

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'Usuarios' },
    { id: 'courses', icon: '📚', label: 'Cursos' },
    { id: 'grades', icon: '📊', label: 'Calificaciones' },
    { id: 'settings', icon: '⚙️', label: 'Configuración' },
  ]

  const statusLabel = {
    idle: 'Sin conectar',
    loading: 'Conectando...',
    connected: 'MongoDB conectado',
    error: 'Error de conexión',
  }[dbStatus]

  const statusDotClass = {
    idle: '',
    loading: '',
    connected: 'connected',
    error: 'error',
  }[dbStatus]

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
    <div className="app-layout">
      {/* ── Sidebar ── */}
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
              onClick={() => setActiveNav(item.id)}
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

      {/* ── Main Content ── */}
      <main className="main-content" id="main">
        <div className="dashboard">
          {/* Header */}
          <header className="dashboard__header">
            <p className="dashboard__greeting">Bienvenido al entorno de desarrollo</p>
            <h1 className="dashboard__title">EduPlatform — Setup Inicial</h1>
          </header>

          {/* Stack pills */}
          <div className="stack-grid" aria-label="Stack tecnológico">
            <span className="stack-pill react">⚛️ React 18</span>
            <span className="stack-pill vite">⚡ Vite 5</span>
            <span className="stack-pill electron">🔵 Electron 27</span>
            <span className="stack-pill mongo">🍃 Mongoose + MongoDB</span>
            <span className="stack-pill js">💛 JavaScript ES6+</span>
          </div>

          <br />

          {/* Stats */}
          <section className="stats-grid" aria-label="Estado del proyecto">
            {[
              { icon: '📦', value: '3', label: 'Paquetes (workspaces)', badge: 'main • frontend • shared' },
              { icon: '🔌', value: '5', label: 'IPC Handlers (user)', badge: 'CRUD completo' },
              { icon: '🍃', value: '1', label: 'Modelos Mongoose', badge: 'User model' },
              { icon: '🔒', value: '✓', label: 'contextIsolation', badge: 'Seguro' },
            ].map((s, i) => (
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

          {/* Setup checklist */}
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

          {/* DB Test */}
          <section className="db-test" aria-labelledby="dbtest-title">
            <h2 className="db-test__title" id="dbtest-title">
              <span aria-hidden="true">🧪</span> Prueba de Conexión IPC → MongoDB
            </h2>

            {!isElectron && (
              <p style={{ color: 'var(--color-accent-2)', marginBottom: 16, fontSize: 13 }}>
                ⚠️ Corriendo en browser. Ejecuta con <code>npm run electron:dev</code> para probar IPC.
              </p>
            )}

            <div className="db-test__actions">
              <button
                id="btn-get-users"
                className="btn btn-primary"
                onClick={testGetUsers}
                disabled={dbStatus === 'loading'}
                aria-label="Obtener todos los usuarios de la base de datos"
              >
                {dbStatus === 'loading'
                  ? <><span className="spinner" aria-hidden="true" /> Consultando...</>
                  : '👥 GET todos los usuarios'
                }
              </button>

              <button
                id="btn-create-user"
                className="btn btn-secondary"
                onClick={testCreateUser}
                disabled={dbStatus === 'loading'}
                aria-label="Crear un usuario de prueba en la base de datos"
              >
                ➕ Crear usuario de prueba
              </button>

              <button
                id="btn-clear"
                className="btn btn-danger"
                onClick={() => { setResult(''); setDbStatus(isElectron ? 'connected' : 'idle') }}
                disabled={!result}
                aria-label="Limpiar resultado"
              >
                🗑️ Limpiar
              </button>
            </div>

            <div
              className={`result-output ${dbStatus === 'connected' && result ? 'success' : dbStatus === 'error' ? 'error' : ''}`}
              role="log"
              aria-label="Resultado de la prueba"
              aria-live="polite"
            >
              {result || 'Los resultados aparecerán aquí...'}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
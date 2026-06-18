import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TechStack from './components/TechStack'
import StatsGrid from './components/StatsGrid'
import Checklist from './components/Checklist'
import DbTester from './components/DbTester'

function App() {
  const [dbStatus, setDbStatus] = useState('idle')
  const [result, setResult] = useState('')
  const [activeNav, setActiveNav] = useState('dashboard')
  const [isElectron] = useState(() => typeof window !== 'undefined' && !!window.api)

  // Sincronizar estado inicial si está en entorno Electron
  useEffect(() => {
    if (isElectron) {
      setDbStatus('connected')
    }
  }, [isElectron])

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'Usuarios / Auth' },
    { id: 'courses', icon: '📚', label: 'Cursos' },
    { id: 'grades', icon: '📊', label: 'Calificaciones' },
    { id: 'settings', icon: '⚙️', label: 'Configuración' },
  ]

  // Renderizado condicional según el módulo activo de navegación
  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <Dashboard />
      case 'users':
        return <LoginRegister />
      default:
        return (
          <div className="dashboard">
            <header className="dashboard__header">
              <p className="dashboard__greeting">EduPlatform Dev Panel</p>
              <h1 className="dashboard__title">Sección: {activeNav.toUpperCase()}</h1>
            </header>
            
            <TechStack />
            <br />
            <StatsGrid />
            <Checklist />
            
            <DbTester 
              isElectron={isElectron}
              dbStatus={dbStatus}
              setDbStatus={setDbStatus}
              result={result}
              setResult={setResult}
            />
          </div>
        )
    }
  }

  return (
    <div className="app-layout">
      <Sidebar 
        navItems={navItems} 
        activeNav={activeNav} 
        onNavChange={setActiveNav} 
        dbStatus={dbStatus} 
      />
      <main className="main-content" id="main">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
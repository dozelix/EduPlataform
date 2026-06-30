import React, { useState, useEffect } from 'react'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Catalog from './features/courses/Catalog'
import MyLearning from './features/learning/MyLearning'
import Lesson from './features/lesson/Lesson'
import { LoginRegister } from './components/LoginRegister'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const [dbStatus, setDbStatus] = useState('idle')
  const [activeNav, setActiveNav] = useState('courses')
  const [activeLeccionId, setActiveLeccionId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isElectron] = useState(
    () => typeof globalThis.window !== 'undefined' && !!globalThis.window.api
  )

  useEffect(() => {
    if (isElectron) setDbStatus('connected')
  }, [isElectron])

  // ── Login (unauthenticated) ─────────────────────────
  if (!isAuthenticated) {
    return (
      <LoginRegister
        onSuccess={(user) => {
          setCurrentUser(user)
          setIsAuthenticated(true)
        }}
      />
    )
  }

  // ── Authenticated app ───────────────────────────────
  const appUser = currentUser
    ? {
        name: currentUser.nombre,
        initials: currentUser.nombre
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      }
    : { name: 'Usuario', initials: 'US' }

  const handleNav = (id) => {
    setActiveNav(id)
    setSidebarOpen(false)
  }

  const renderContent = () => {
    switch (activeNav) {
      case 'courses':
        return <Catalog user={currentUser} />
      case 'learning':
        return (
          <MyLearning
            user={currentUser}
            onContinue={(leccionId) => {
              setActiveLeccionId(leccionId)
              setActiveNav('lesson')
            }}
          />
        )
      case 'lesson':
        return (
          <Lesson
            leccionId={activeLeccionId}
            user={currentUser}
            onNavigate={(leccionId) => setActiveLeccionId(leccionId)}
            onBack={() => setActiveNav('learning')}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="db-layout">
      <Sidebar
        activeNav={activeNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleNav={handleNav}
        dbStatus={dbStatus}
      />
      <div className="db-main">
        <Topbar user={appUser} setSidebarOpen={setSidebarOpen} />
        <main className="db-content" id="main">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App

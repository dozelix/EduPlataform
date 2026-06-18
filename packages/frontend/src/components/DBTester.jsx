import React from 'react'

export default function DbTester({ isElectron, dbStatus, setDbStatus, result, setResult }) {
  
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
        setResult(`✅ Usuarios en DB:\n${JSON.stringify(response.data, null, 2)}`)
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
        setResult(`✅ Usuario creado:\n${JSON.stringify(response.data, null, 2)}`)
      } else {
        setDbStatus('error')
        setResult(`❌ Error: ${response.error}`)
      }
    } catch (err) {
      setDbStatus('error')
      setResult(`❌ IPC Error: ${err.message}`)
    }
  }

  const handleClear = () => {
    setResult('')
    setDbStatus(isElectron ? 'connected' : 'idle')
  }

  return (
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
          {dbStatus === 'loading' ? (
            <><span className="spinner" aria-hidden="true" /> Consultando...</>
          ) : (
            '👥 GET todos los usuarios'
          )}
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
          onClick={handleClear}
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
  )
}
import React, { useEffect, useState } from 'react'

// Vista 3 del Caso 3: Mi Aprendizaje.
// Muestra los cursos en los que está inscrito el usuario en sesión, con su
// progreso y la última lección. El handler resuelve curso/instructor de forma
// null-safe, así que una inscripción a un curso inexistente aparece como
// "Curso no disponible" en vez de romper la tabla.

export default function MyLearning({ user, onContinue }) {
  const [filas, setFilas] = useState([])
  const [estado, setEstado] = useState('loading') // loading | ready | error | no-api | no-user
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargar() {
      if (!window.api) {
        setEstado('no-api')
        return
      }
      if (!user?.id) {
        setEstado('no-user')
        return
      }
      try {
        const res = await window.api.invoke('aprendizaje:listar', user.id)
        if (!activo) return
        if (res.success) {
          setFilas(res.data)
          setEstado('ready')
        } else {
          setError(res.error)
          setEstado('error')
        }
      } catch (err) {
        if (!activo) return
        setError(err.message)
        setEstado('error')
      }
    }

    cargar()
    return () => {
      activo = false
    }
  }, [user])

  return (
    <>
      <div className="db-page-header">
        <div>
          <h1 className="db-page-header__title">Mi Aprendizaje</h1>
          <p className="db-page-header__sub">Tus cursos y tu progreso</p>
        </div>
      </div>

      {estado === 'loading' && <p className="lrn-msg">Cargando...</p>}
      {estado === 'no-api' && (
        <p className="lrn-msg">
          Esta vista necesita Electron (window.api). Ejecuta la app con <code>npm run dev</code>.
        </p>
      )}
      {estado === 'no-user' && <p className="lrn-msg">Inicia sesión para ver tu aprendizaje.</p>}
      {estado === 'error' && <p className="lrn-msg lrn-msg--error">Error: {error}</p>}

      {estado === 'ready' &&
        (filas.length === 0 ? (
          <p className="lrn-msg">Aún no estás inscrito en ningún curso.</p>
        ) : (
          <table className="lrn-table">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Instructor</th>
                <th>Progreso</th>
                <th>Última lección</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.inscripcionId} className={f.disponible ? '' : 'lrn-row--unavailable'}>
                  <td>{f.curso}</td>
                  <td>{f.instructor}</td>
                  <td>
                    <div className="lrn-progress">
                      <div className="lrn-progress__track">
                        <div className="lrn-progress__fill" style={{ width: `${f.progreso}%` }} />
                      </div>
                      <span className="lrn-progress__pct">{f.progreso}%</span>
                    </div>
                  </td>
                  <td>{f.ultimaLeccion}</td>
                  <td>
                    <button
                      className="lrn-continue"
                      onClick={() => onContinue?.(f.primeraLeccionId)}
                      disabled={!f.disponible || !f.primeraLeccionId}
                      title={
                        f.disponible
                          ? f.primeraLeccionId
                            ? ''
                            : 'El curso no tiene lecciones'
                          : 'Curso no disponible'
                      }
                    >
                      Continuar aprendiendo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
    </>
  )
}

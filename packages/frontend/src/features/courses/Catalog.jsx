import React, { useEffect, useMemo, useState } from 'react'
import { Search, Star } from 'lucide-react'

// Vista 2 del Caso 3: Catalogo de Cursos.
// Lee los cursos reales desde Mongo via IPC (curso:listar), permite buscar por
// nombre y filtrar por instructor. El handler resuelve el instructor null-safe.
// Incluye inscripcion (inscripcion:crear) y conversion de precio a varias monedas
// usando una API publica de tipos de cambio. Diseno tipo Udemy, marcado semantico.

const MONEDAS = ['USD', 'EUR', 'CLP', 'MXN', 'GBP', 'BRL']

// Convierte el precio en USD a la moneda elegida con las tasas de la API publica.
function formatearPrecio(precioUSD, moneda, tasas) {
  if (precioUSD == null) return 'Sin precio'
  const tasa = moneda === 'USD' ? 1 : tasas[moneda]
  if (!tasa) return `${precioUSD.toFixed(2)} USD`
  const convertido = precioUSD * tasa
  return convertido.toLocaleString('es-CL', { style: 'currency', currency: moneda })
}

// Estrellas de calificacion (0-5) con lucide; las llenas se pintan, el resto en gris.
function Estrellas({ valor }) {
  const llenas = Math.round(valor)
  return (
    <span className="cat-card__stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={i <= llenas ? 'is-on' : 'is-off'}
          fill={i <= llenas ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  )
}

export default function Catalog({ user, onRequireLogin }) {
  const [cursos, setCursos] = useState([])
  const [estado, setEstado] = useState('loading') // loading | ready | error | no-api
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [instructor, setInstructor] = useState('Todos')
  const [moneda, setMoneda] = useState('USD')
  const [tasas, setTasas] = useState({})
  const [inscribiendo, setInscribiendo] = useState(null)

  async function cargar() {
    if (!window.api) {
      setEstado('no-api')
      return
    }
    try {
      const res = await window.api.invoke('curso:listar', user?.id)
      if (res.success) {
        setCursos(res.data)
        setEstado('ready')
      } else {
        setError(res.error)
        setEstado('error')
      }
    } catch (err) {
      setError(err.message)
      setEstado('error')
    }
  }

  useEffect(() => {
    cargar()
  }, [user])

  useEffect(() => {
    let activo = true
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((r) => r.json())
      .then((d) => {
        if (activo && d && d.rates) setTasas(d.rates)
      })
      .catch(() => {})
    return () => {
      activo = false
    }
  }, [])

  const instructores = useMemo(
    () => ['Todos', ...Array.from(new Set(cursos.map((c) => c.instructor)))],
    [cursos]
  )

  const filtrados = cursos.filter((c) => {
    const coincideNombre = c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideInstructor = instructor === 'Todos' || c.instructor === instructor
    return coincideNombre && coincideInstructor
  })

  const inscribir = async (cursoId) => {
    if (!window.api || !user?.id) return
    setInscribiendo(cursoId)
    setError('')
    try {
      const res = await window.api.invoke('inscripcion:crear', { usuarioId: user.id, cursoId })
      if (res.success) {
        await cargar()
      } else {
        setError(res.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setInscribiendo(null)
    }
  }

  return (
    <>
      <header className="cat-header">
        <h1 className="cat-header__title">Catalogo de Cursos</h1>
        <p className="cat-header__sub">Explora los cursos disponibles y avanza a tu ritmo</p>
      </header>

      <search className="cat-toolbar">
        <label className="cat-search">
          <Search size={16} className="cat-search__icon" aria-hidden="true" />
          <span className="sr-only">Buscar curso por nombre</span>
          <input
            type="search"
            placeholder="Busca por nombre del curso"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>

        <label className="cat-filter">
          <span className="sr-only">Filtrar por instructor</span>
          <select value={instructor} onChange={(e) => setInstructor(e.target.value)}>
            {instructores.map((nom) => (
              <option key={nom} value={nom}>
                {nom === 'Todos' ? 'Todos los instructores' : nom}
              </option>
            ))}
          </select>
        </label>

        <label className="cat-filter">
          <span className="sr-only">Moneda</span>
          <select value={moneda} onChange={(e) => setMoneda(e.target.value)}>
            {MONEDAS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </search>

      {estado === 'loading' && <p className="cat-msg">Cargando cursos...</p>}
      {estado === 'no-api' && (
        <p className="cat-msg">
          Esta vista necesita Electron (window.api). Ejecuta la app con <code>npm run dev</code>.
        </p>
      )}
      {estado === 'error' && <p className="cat-msg cat-msg--error">Error: {error}</p>}

      {estado === 'ready' &&
        (filtrados.length === 0 ? (
          <p className="cat-msg">No se encontraron cursos.</p>
        ) : (
          <ul className="cat-grid" aria-label="Cursos">
            {filtrados.map((c) => (
              <li className="cat-card-item" key={c.id}>
                <article className="cat-card">
                  <figure className="cat-card__thumb" aria-hidden="true">
                    {c.nombre.charAt(0)}
                  </figure>
                  <section className="cat-card__body">
                    <h3 className="cat-card__title">{c.nombre}</h3>
                    <p className="cat-card__instructor">{c.instructor}</p>
                    <p className="cat-card__rating">
                      {c.calificacion != null ? (
                        <>
                          <strong>{c.calificacion.toFixed(1)}</strong>
                          <Estrellas valor={c.calificacion} />
                        </>
                      ) : (
                        <span className="cat-card__rating--none">Sin calificacion</span>
                      )}
                    </p>
                    <p className="cat-card__price">{formatearPrecio(c.precio, moneda, tasas)}</p>
                    {c.inscrito ? (
                      <button className="cat-card__enroll cat-card__enroll--done" disabled>
                        Inscrito
                      </button>
                    ) : (
                      <button
                        className="cat-card__enroll"
                        onClick={() => (user?.id ? inscribir(c.id) : onRequireLogin?.(c.id))}
                        disabled={inscribiendo === c.id}
                      >
                        {inscribiendo === c.id ? 'Inscribiendo...' : 'Inscribirse'}
                      </button>
                    )}
                  </section>
                </article>
              </li>
            ))}
          </ul>
        ))}
    </>
  )
}

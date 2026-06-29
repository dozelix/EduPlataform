import { useState } from 'react'
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  ArrowRight,
  User,
  Star,
} from 'lucide-react'

// ======================================================
// LoginRegister — Vista 1 (Caso 3), diseno tipo Udemy con Tailwind.
// Reproduce Login.tsx / Register.tsx del diseno de referencia, cableado a la
// coleccion `usuarios` via auth:login / auth:register (nombre, tipo).
// ======================================================

const FIELD_WRAP =
  'flex items-center gap-2 border bg-white px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-[#3b1c8c] border-[#d1d7dc] focus-within:border-[#3b1c8c]'
const FIELD = 'flex-1 text-sm text-[#1c1d1f] outline-none bg-transparent placeholder:text-[#9ba0a6]'
const FIELD_LABEL = 'text-sm font-semibold text-[#1c1d1f]'

export function LoginRegister({ onSuccess }) {
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  // Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register
  const [regNombre, setRegNombre] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regTipo, setRegTipo] = useState('estudiante')

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setSuccess('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (!window.api) {
        setError('API no disponible')
        return
      }
      const res = await window.api.invoke('auth:login', {
        email: loginEmail,
        password: loginPassword,
      })
      if (res.success) {
        setCurrentUser(res.data)
        setSuccess(`Bienvenido ${res.data.nombre}`)
        setTimeout(() => onSuccess?.(res.data), 1000)
      } else {
        setError(res.error)
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (!window.api) {
        setError('API no disponible')
        return
      }
      const res = await window.api.invoke('auth:register', {
        nombre: regNombre,
        email: regEmail,
        password: regPassword,
        confirmPassword: regConfirm,
        tipo: regTipo,
      })
      if (res.success) {
        setSuccess(`Cuenta creada: ${res.data.nombre} (${res.data.tipo})`)
        setRegNombre('')
        setRegEmail('')
        setRegPassword('')
        setRegConfirm('')
        setTimeout(() => {
          setMode('login')
          setSuccess('')
        }, 1800)
      } else {
        setError(res.error)
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Confirmacion breve antes de entrar
  if (currentUser) {
    return (
      <div className="min-h-screen bg-[#f7f9fa] flex items-center justify-center px-4">
        <div className="bg-white border border-[#d1d7dc] shadow-lg p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#3b1c8c] flex items-center justify-center mx-auto mb-5">
            <Check size={30} className="text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1c1d1f] mb-2">Bienvenido de vuelta</h2>
          <p className="text-sm text-[#6a6f73]">
            Sesion iniciada como{' '}
            <strong className="text-[#1c1d1f]">{currentUser.nombre}</strong> ({currentUser.tipo}).
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#d1d7dc] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={22} className="text-[#3b1c8c]" />
          <span className="text-xl font-extrabold text-[#3b1c8c]">EduPlatform</span>
        </div>
        <p className="text-sm text-[#6a6f73]">
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button onClick={switchMode} className="text-[#3b1c8c] font-semibold hover:underline">
            {mode === 'login' ? 'Registrate gratis' : 'Inicia sesion'}
          </button>
        </p>
      </header>

      <div className="flex flex-1">
        {/* Panel lateral */}
        {mode === 'login' ? (
          <aside className="hidden lg:flex flex-col justify-between bg-[#1c1d1f] text-white p-10 w-[420px] flex-shrink-0">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#c4aff5] uppercase mb-4">
                Continua aprendiendo
              </p>
              <h2 className="text-3xl font-extrabold leading-tight mb-4 text-white">
                Tu proxima
                <br />
                habilidad te
                <br />
                <span className="text-[#c4aff5]">esta esperando.</span>
              </h2>
              <p className="text-[#9ba0a6] text-sm leading-relaxed">
                Inicia sesion para retomar donde lo dejaste, ver tu progreso y acceder a tus cursos.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 flex flex-col gap-4">
              <p className="text-xs font-semibold text-[#9ba0a6] uppercase tracking-widest">
                Ultimo curso visto
              </p>
              <div className="flex items-start gap-3">
                <div className="w-16 h-12 flex-shrink-0 bg-gradient-to-br from-[#3b1c8c] to-[#a435f0] flex items-center justify-center text-white font-bold">
                  PY
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white leading-snug">Python Avanzado</p>
                  <p className="text-xs text-[#9ba0a6] mt-1">Prof. Daniela Soto</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#9ba0a6] mb-1.5">
                  <span>Progreso</span>
                  <span className="text-[#c4aff5] font-semibold">50%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#3b1c8c] rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className="text-[#e59819]" fill="#e59819" />
                ))}
              </div>
              <p className="text-sm text-[#9ba0a6] leading-relaxed italic">
                "La calidad del contenido y los instructores son de otro nivel."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#3b1c8c] flex items-center justify-center text-xs font-bold text-white">
                  CR
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Carlos Ramirez</p>
                  <p className="text-[10px] text-[#9ba0a6]">Estudiante</p>
                </div>
              </div>
            </div>
          </aside>
        ) : (
          <aside className="hidden lg:flex flex-col justify-between bg-[#3b1c8c] text-white p-10 w-[420px] flex-shrink-0">
            <div>
              <h2 className="text-3xl font-extrabold leading-tight mb-4 text-white">
                Unete a<br />
                <span className="text-[#c4aff5]">EduPlatform</span>
              </h2>
              <p className="text-[#c4aff5] text-sm leading-relaxed">
                Accede a los cursos, sigue tu progreso y aprende a tu propio ritmo, desde cualquier
                dispositivo.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { stat: 'Catalogo', label: 'cursos con instructores' },
                { stat: 'Progreso', label: 'siempre a la vista' },
                { stat: 'Comenta', label: 'leccion a leccion' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Check size={18} className="text-[#c4aff5]" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-white">{item.stat}</div>
                    <div className="text-[#c4aff5] text-xs">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div />
          </aside>
        )}

        {/* Formulario */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white border border-[#d1d7dc] shadow-sm p-8 flex flex-col gap-5">
              <div>
                <h1 className="text-2xl font-extrabold text-[#1c1d1f]">
                  {mode === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}
                </h1>
                <p className="text-sm text-[#6a6f73] mt-1">
                  {mode === 'login'
                    ? 'Bienvenido de vuelta. Accede a tu cuenta.'
                    : 'Registrate como estudiante o instructor.'}
                </p>
              </div>

              {/* Botones sociales (decorativos) */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Google', letter: 'G' },
                  { name: 'Facebook', letter: 'f' },
                ].map(({ name, letter }) => (
                  <button
                    key={name}
                    type="button"
                    className="flex items-center justify-center gap-2 border border-[#d1d7dc] py-2.5 text-sm font-semibold text-[#1c1d1f] hover:bg-[#f7f9fa] transition-colors"
                  >
                    <span className="font-bold text-base leading-none">{letter}</span>
                    {name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#d1d7dc]" />
                <span className="text-xs text-[#6a6f73]">o con tu correo</span>
                <div className="flex-1 h-px bg-[#d1d7dc]" />
              </div>

              {error && (
                <div className="flex items-start gap-2.5 bg-[#fff3f3] border border-[#fca5a5] px-4 py-3 text-sm text-[#c0392b]">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-start gap-2.5 bg-[#eafaf1] border border-[#86e3b4] px-4 py-3 text-sm text-[#1d7a4d]">
                  <Check size={15} className="flex-shrink-0 mt-0.5" />
                  {success}
                </div>
              )}

              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="login-email" className={FIELD_LABEL}>
                      Correo electronico
                    </label>
                    <div className={FIELD_WRAP}>
                      <Mail size={16} className="text-[#6a6f73] flex-shrink-0" />
                      <input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className={FIELD}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="login-password" className={FIELD_LABEL}>
                        Contrasena
                      </label>
                      <button
                        type="button"
                        className="text-xs text-[#3b1c8c] hover:underline font-medium"
                      >
                        ¿Olvidaste tu contrasena?
                      </button>
                    </div>
                    <div className={FIELD_WRAP}>
                      <Lock size={16} className="text-[#6a6f73] flex-shrink-0" />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Tu contrasena"
                        className={FIELD}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-[#6a6f73] hover:text-[#3b1c8c]"
                        aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => setRemember((v) => !v)}
                      className={`w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-colors ${
                        remember ? 'bg-[#3b1c8c] border-[#3b1c8c]' : 'border-[#d1d7dc] bg-white'
                      }`}
                      aria-pressed={remember}
                    >
                      {remember && <Check size={10} className="text-white" />}
                    </button>
                    <span className="text-sm text-[#6a6f73]">Mantener sesion iniciada</span>
                  </label>

                  <SubmitButton loading={loading} label="Iniciar sesion" />
                </form>
              ) : (
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-nombre" className={FIELD_LABEL}>
                      Nombre completo
                    </label>
                    <div className={FIELD_WRAP}>
                      <User size={16} className="text-[#6a6f73] flex-shrink-0" />
                      <input
                        id="reg-nombre"
                        type="text"
                        value={regNombre}
                        onChange={(e) => setRegNombre(e.target.value)}
                        placeholder="Tu nombre"
                        className={FIELD}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-email" className={FIELD_LABEL}>
                      Correo electronico
                    </label>
                    <div className={FIELD_WRAP}>
                      <Mail size={16} className="text-[#6a6f73] flex-shrink-0" />
                      <input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className={FIELD}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="reg-pass" className={FIELD_LABEL}>
                        Contrasena
                      </label>
                      <div className={FIELD_WRAP}>
                        <Lock size={16} className="text-[#6a6f73] flex-shrink-0" />
                        <input
                          id="reg-pass"
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min. 6"
                          className={FIELD}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="reg-confirm" className={FIELD_LABEL}>
                        Confirmar
                      </label>
                      <div className={FIELD_WRAP}>
                        <Lock size={16} className="text-[#6a6f73] flex-shrink-0" />
                        <input
                          id="reg-confirm"
                          type="password"
                          value={regConfirm}
                          onChange={(e) => setRegConfirm(e.target.value)}
                          placeholder="Repite"
                          className={FIELD}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-tipo" className={FIELD_LABEL}>
                      Tipo de cuenta
                    </label>
                    <select
                      id="reg-tipo"
                      value={regTipo}
                      onChange={(e) => setRegTipo(e.target.value)}
                      disabled={loading}
                      className="border border-[#d1d7dc] bg-white px-3 py-2.5 text-sm text-[#1c1d1f] outline-none focus:border-[#3b1c8c] focus:ring-2 focus:ring-[#3b1c8c]"
                    >
                      <option value="estudiante">Estudiante</option>
                      <option value="instructor">Instructor</option>
                    </select>
                  </div>

                  <SubmitButton loading={loading} label="Crear cuenta" />
                </form>
              )}
            </div>

            <p className="text-center text-xs text-[#9ba0a6] mt-5">
              EduPlatform · Plataforma Educativa
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

function SubmitButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-[#3b1c8c] hover:bg-[#2d1470] disabled:opacity-60 text-white font-bold py-3 text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          {label}
          <ArrowRight size={16} />
        </>
      )}
    </button>
  )
}

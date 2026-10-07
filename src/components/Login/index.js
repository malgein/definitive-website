// Importa el estado local para controlar los campos y la respuesta del acceso.
import { useState } from 'react'
// Importa el cliente HTTP que envía las credenciales a la API.
import { api } from '../../services/api'

// Renderiza el formulario de inicio de sesión del administrador.
const Login = ({ onLogin }) => {
  // Guarda el correo escrito en el formulario.
  const [email, setEmail] = useState('')
  // Guarda la contraseña escrita en el formulario.
  const [password, setPassword] = useState('')
  // Conserva el mensaje de error de la autenticación.
  const [error, setError] = useState('')
  // Indica que la petición de acceso está en curso.
  const [submitting, setSubmitting] = useState(false)

  // Envía las credenciales al backend cuando se presenta el formulario.
  const handleSubmit = async (event) => {
    // Evita que el navegador recargue la página.
    event.preventDefault()
    // Limpia errores anteriores antes de intentar iniciar sesión.
    setError('')
    // Desactiva temporalmente el botón de acceso.
    setSubmitting(true)

    // Realiza el login y comunica la sesión al componente padre.
    try {
      // Envía el correo y la contraseña a la ruta de autenticación.
      const session = await api.login({ email, password })
      // Informa a Dashboard para guardar el token y mostrar el panel.
      onLogin(session)
    // Captura errores de red o credenciales rechazadas.
    } catch (requestError) {
      // Muestra el mensaje recibido del backend.
      setError(requestError.message)
    // Se ejecuta al terminar tanto el login exitoso como el fallido.
    } finally {
      // Reactiva el botón una vez terminada la solicitud.
      setSubmitting(false)
    }
  }

  // Construye el formulario de acceso administrativo.
  return (
    // Centra el bloque de inicio de sesión.
    <section className="dashboard">
      {/* Indica que se solicitan credenciales administrativas. */}
      <h1>Admin sign in</h1>
      {/* Vincula el envío del formulario con la petición de login. */}
      <form onSubmit={handleSubmit}>
        {/* Agrupa la etiqueta y el campo de correo. */}
        <p>
          {/* Asocia el texto descriptivo con el input de correo. */}
          <label htmlFor="admin-email">Email</label>
          {/* Recoge una dirección de correo y habilita el autocompletado de usuario. */}
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        {/* Cierra el grupo del correo. */}
        </p>
        {/* Agrupa la etiqueta y el campo de contraseña. */}
        <p>
          {/* Asocia el texto descriptivo con el input de contraseña. */}
          <label htmlFor="admin-password">Password</label>
          {/* Recoge la contraseña, la sincroniza con el estado y la marca obligatoria. */}
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        {/* Cierra el grupo de contraseña. */}
        </p>
        {/* Presenta el error con semántica accesible de alerta. */}
        {error && <p role="alert">{error}</p>}
        {/* Envía las credenciales y bloquea el botón durante la solicitud. */}
        <button type="submit" disabled={submitting}>
          {/* Informa del estado o de la acción disponible. */}
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      {/* Cierra el formulario de acceso. */}
      </form>
    {/* Cierra la sección de login. */}
    </section>
  )
}

// Exporta Login para mostrarlo en el Dashboard si no hay sesión válida.
export default Login

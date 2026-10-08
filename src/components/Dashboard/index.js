// Importa el efecto de ciclo de vida y el estado local de React.
import { useEffect, useState } from 'react'
// Importa el panel que administra proyectos tras autenticarse.
import Home from './home'
// Importa el formulario de acceso del administrador.
import Login from '../Login'
// Importa los métodos de comunicación con el backend.
import { api } from '../../services/api'
// Carga los estilos del área de administración.
import './index.scss'

// Define la clave usada para guardar el token de autenticación.
const TOKEN_KEY = 'portfolio_admin_token'

// Controla la sesión y selecciona la vista de login o gestión.
const Dashboard = () => {
  // Conserva el token JWT y el perfil del administrador autenticado.
  const [session, setSession] = useState(null)
  // Indica si se está validando una sesión guardada previamente.
  const [checkingSession, setCheckingSession] = useState(true)

  // Valida el token local cuando se monta el panel.
  useEffect(() => {
    // Evita actualizar el estado después de desmontar el componente.
    let active = true
    // Lee el token guardado en el navegador.
    const token = window.localStorage.getItem(TOKEN_KEY)

    // Si no existe token, termina la comprobación y muestra el login.
    if (!token) {
      // Indica que la revisión de sesión ya terminó.
      setCheckingSession(false)
      // Inactiva la función de limpieza del efecto.
      return () => {
        active = false
      }
    }

    // Consulta el perfil para comprobar que el token sigue siendo válido.
    api.getCurrentUser(token)
      // Guarda la sesión si la petición termina mientras sigue montado.
      .then((user) => {
        if (active) setSession({ token, user })
      })
      // Elimina el token si el backend no lo acepta.
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY)
      })
      // Termina el estado de carga cuando finaliza la consulta.
      .finally(() => {
        if (active) setCheckingSession(false)
      })

    // Marca el efecto como inactivo al desmontar el componente.
    return () => {
      active = false
    }
  // Ejecuta la validación una sola vez al montar Dashboard.
  }, [])

  // Persiste el token y establece los datos de la sesión iniciada.
  const handleLogin = ({ token, user }) => {
    // Guarda el JWT para las peticiones administrativas posteriores.
    window.localStorage.setItem(TOKEN_KEY, token)
    // Actualiza el estado con el token y el usuario recibidos.
    setSession({ token, user })
  }

  // Cierra la sesión local y regresa al formulario de acceso.
  const handleLogout = () => {
    // Borra el token guardado en el navegador.
    window.localStorage.removeItem(TOKEN_KEY)
    // Limpia la sesión actual del estado React.
    setSession(null)
  }

  // Guarda el token renovado y el perfil devueltos al actualizar la cuenta.
  const handleProfileUpdated = ({ token, user }) => {
    window.localStorage.setItem(TOKEN_KEY, token)
    setSession({ token, user })
  }

  // Mantiene una vista de espera mientras se revisa el token.
  if (checkingSession) {
    // Reserva el layout desplazable del dashboard durante la comprobación.
    return (
      <div className="dashboard-route">
        {/* Informa al administrador de que la sesión está comprobándose. */}
        <div className="dashboard dashboard-status">Checking admin session…</div>
      </div>
    )
  }

  // Presenta el panel si existe sesión; de lo contrario, muestra el login.
  return (
    // Este contenedor permite que el CSS active el flujo desplazable del dashboard.
    <div className="dashboard-route">
      {session ? (
        // Proporciona al panel sus credenciales y callback de salida.
        <Home
          session={session}
          onLogout={handleLogout}
          onProfileUpdated={handleProfileUpdated}
        />
      ) : (
        // Proporciona al login el callback para registrar una sesión nueva.
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}

// Exporta Dashboard para conectarlo con las rutas de la aplicación.
export default Dashboard

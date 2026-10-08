// Lee la dirección del backend desde el entorno o usa el servidor local.
const API_BASE_URL = (
  // El valor debe incluir el prefijo de API, por ejemplo /api.
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
// Quita barras finales para concatenar rutas sin duplicar separadores.
).replace(/\/+$/, '')

// Centraliza las peticiones HTTP y el manejo de cabeceras/respuestas.
async function request(path, { token, body, headers = {}, ...options } = {}) {
  // Solicita respuestas JSON y conserva las cabeceras adicionales recibidas.
  const requestHeaders = { Accept: 'application/json', ...headers }

  // Añade autenticación Bearer cuando la operación requiere sesión.
  if (token) {
    // Adjunta el JWT emitido por el backend.
    requestHeaders.Authorization = `Bearer ${token}`
  }

  // Configura JSON solo para cuerpos que no sean formularios multipart.
  if (body && !(body instanceof FormData)) {
    // Informa al backend que el cuerpo está serializado como JSON.
    requestHeaders['Content-Type'] = 'application/json'
  }

  // Ejecuta la solicitud combinando método, cabeceras y cuerpo.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    // Conserva opciones HTTP como method y credentials si fueron indicadas.
    ...options,
    // Envía las cabeceras calculadas para esta llamada.
    headers: requestHeaders,
    // Deja que el navegador cree el boundary de FormData o serializa JSON.
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  })

  // Convierte respuestas JSON; admite respuestas vacías o no JSON.
  const responseBody = await response.json().catch(() => null)

  // Convierte respuestas HTTP fallidas en errores con mensaje legible.
  if (!response.ok) {
    // Prioriza el mensaje de la API y usa el código HTTP como alternativa.
    throw new Error(responseBody?.message || `Request failed (${response.status})`)
  }

  // Devuelve el contenido JSON a la función que inició la petición.
  return responseBody
}

// Expone las operaciones de autenticación y administración de proyectos.
export const api = {
  // Envía las credenciales del administrador y recibe el JWT.
  login: (credentials) =>
    // Usa JSON porque el endpoint de login no recibe archivos.
    request('/auth/login', { method: 'POST', body: credentials }),
  // Comprueba el token actual y obtiene el perfil autenticado.
  getCurrentUser: (token) => request('/auth/me', { token }),
  // Actualiza el perfil del usuario autenticado y recibe su token renovado.
  updateCurrentUser: (profile, token) =>
    request('/auth/me', { method: 'PATCH', body: profile, token }),
  // Recupera la lista pública de proyectos.
  getProjects: () => request('/projects'),
  // Crea un proyecto con campos y archivo de imagen multipart.
  createProject: (formData, token) =>
    // Envía el JWT junto con el formulario sin fijar Content-Type a mano.
    request('/projects', { method: 'POST', body: formData, token }),
  // Actualiza parcialmente los campos de un proyecto existente.
  updateProject: (id, formData, token) =>
    // Envía el identificador, los datos multipart y el JWT.
    request(`/projects/${id}`, { method: 'PATCH', body: formData, token }),
  // Elimina un proyecto con autorización administrativa.
  deleteProject: (id, token) =>
    // Envía la ruta del registro y el token de autenticación.
    request(`/projects/${id}`, { method: 'DELETE', token }),
}

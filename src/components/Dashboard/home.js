// Importa callbacks memorizables, efectos y estado local de React.
import { useCallback, useEffect, useState } from 'react'
// Importa las funciones para consultar y modificar los proyectos del backend.
import { api } from '../../services/api'
// Importa las alertas modales para confirmar y comunicar operaciones.
import Swal from 'sweetalert2'

// Define los valores iniciales usados al crear o reiniciar el formulario.
const emptyProject = {
  // Guarda el título del proyecto.
  name: '',
  // Guarda su descripción corta.
  description: '',
  // Guarda la URL de la versión publicada.
  url: '',
  // Guarda la URL del código fuente.
  code: '',
}

// Presenta y administra los proyectos para el usuario autenticado.
const Home = ({ session, onLogout, onProfileUpdated }) => {
  // Almacena los proyectos recuperados desde la API.
  const [projects, setProjects] = useState([])
  // Mantiene los valores editables del proyecto actual.
  const [project, setProject] = useState(emptyProject)
  // Conserva el archivo de imagen seleccionado para subirlo.
  const [image, setImage] = useState(null)
  // Identifica el registro en edición; null significa crear uno nuevo.
  const [editingId, setEditingId] = useState(null)
  // Indica que la lista de proyectos está cargando.
  const [loading, setLoading] = useState(true)
  // Indica que se está enviando el formulario.
  const [saving, setSaving] = useState(false)
  // Conserva los datos y campos de contraseña del formulario de perfil.
  const [profile, setProfile] = useState({
    name: session.user?.name || '',
    email: session.user?.email || '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
  })
  // Evita envíos duplicados mientras se actualiza el perfil.
  const [savingProfile, setSavingProfile] = useState(false)
  // Guarda errores de las peticiones para mostrarlos en pantalla.
  const [error, setError] = useState('')
  // Define una función estable que vuelve a consultar los proyectos.
  const loadProjects = useCallback(async () => {
    // Activa el indicador de carga de la lista.
    setLoading(true)
    // Limpia un error anterior antes de repetir la petición.
    setError('')

    // Solicita los registros públicos del portafolio.
    try {
      // Reemplaza la lista local por los datos devueltos por el backend.
      setProjects(await api.getProjects())
    // Captura errores de red o respuestas de error de la API.
    } catch (requestError) {
      // Guarda el mensaje para mostrarlo en la interfaz.
      setError(requestError.message)
    // Se ejecuta tanto si la petición resulta correcta como si falla.
    } finally {
      // Oculta el estado de carga al finalizar la petición.
      setLoading(false)
    }
  // La función no depende de valores variables del componente.
  }, [])

  // Recupera la lista inicial cuando se monta el panel.
  useEffect(() => {
    // Carga los proyectos desde el backend.
    loadProjects()
  // Repite el efecto si cambia la función de carga.
  }, [loadProjects])

  // Restaura los controles al estado inicial del formulario.
  const resetForm = () => {
    // Vacía todos los campos de texto.
    setProject(emptyProject)
    // Quita el archivo seleccionado del estado.
    setImage(null)
    // Cambia el formulario a modo de creación.
    setEditingId(null)
    // Busca el selector de archivo para limpiar su valor nativo.
    const imageInput = document.getElementById('project-image')
    // Borra el archivo seleccionado si el control sigue montado.
    if (imageInput) imageInput.value = ''
  }

  // Actualiza el campo de texto o URL que originó el evento.
  const handleChange = (event) => {
    // Obtiene el nombre del campo y su nuevo contenido.
    const { name, value } = event.target
    // Conserva los demás valores y reemplaza solo el campo editado.
    setProject((current) => ({ ...current, [name]: value }))
  }

  // Actualiza un campo del formulario de información de usuario.
  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
  }

  // Envía solo los campos de perfil que realmente se quieren modificar.
  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    if (profile.password && profile.password !== profile.confirmPassword) {
      await Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Enter the same new password in both password fields.',
        confirmButtonColor: '#ffd700',
      })
      return
    }

    const updates = {}
    if (profile.name.trim() !== (session.user?.name || '')) updates.name = profile.name
    if (profile.email.trim() !== (session.user?.email || '')) updates.email = profile.email
    if (profile.password) {
      updates.currentPassword = profile.currentPassword
      updates.password = profile.password
    }

    if (Object.keys(updates).length === 0) {
      await Swal.fire({
        icon: 'info',
        title: 'No changes to save',
        text: 'Update your name, email, or password before saving.',
        confirmButtonColor: '#ffd700',
      })
      return
    }

    setSavingProfile(true)
    try {
      const result = await api.updateCurrentUser(updates, session.token)
      onProfileUpdated(result)
      setProfile({
        name: result.user.name || '',
        email: result.user.email || '',
        currentPassword: '',
        password: '',
        confirmPassword: '',
      })
      await Swal.fire({
        icon: 'success',
        title: 'Account updated',
        text: 'Your account information was saved successfully.',
        confirmButtonColor: '#ffd700',
      })
    } catch (requestError) {
      await Swal.fire({
        icon: 'error',
        title: 'Could not update account',
        text: requestError.message,
        confirmButtonColor: '#ffd700',
      })
    } finally {
      setSavingProfile(false)
    }
  }

  // Copia los datos de un registro al formulario para editarlo.
  const handleEdit = (item) => {
    // Guarda el id que usará la petición PATCH.
    setEditingId(item._id)
    // Copia los campos públicos del proyecto seleccionado.
    setProject({
      // Carga el nombre o usa texto vacío si no existe.
      name: item.name || '',
      // Carga la descripción o usa texto vacío si no existe.
      description: item.description || '',
      // Carga la dirección publicada o usa texto vacío.
      url: item.url || '',
      // Carga el enlace al código o usa texto vacío.
      code: item.code || '',
    })
    // Solicita un archivo nuevo solo si se quiere reemplazar la imagen.
    setImage(null)
    // Limpia el error anterior.
    setError('')
    // Lleva el formulario a la parte superior de la ventana.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Envía un proyecto nuevo o los cambios de un proyecto existente.
  const handleSubmit = async (event) => {
    // Evita que el navegador recargue la página al enviar el formulario.
    event.preventDefault()
    // Desactiva el botón mientras se procesa la petición.
    setSaving(true)
    // Limpia cualquier error anterior antes de enviar el formulario.
    setError('')

    // Crea el cuerpo multipart esperado por la ruta de proyectos.
    const formData = new FormData()
    // Añade al multipart cada campo de texto del proyecto.
    Object.entries(project).forEach(([field, value]) => formData.append(field, value))
    // Adjunta la imagen solo cuando se seleccionó una.
    if (image) formData.append('image', image)

    // Ejecuta la operación adecuada según el modo del formulario.
    try {
      // Actualiza el registro si hay un identificador en edición.
      if (editingId) {
        // Envía los datos y el token JWT a la ruta PATCH protegida.
        await api.updateProject(editingId, formData, session.token)
        // Notifica que el backend actualizó correctamente el proyecto.
        await Swal.fire({
          icon: 'success',
          title: 'Project updated',
          text: 'Your project changes were saved successfully.',
          confirmButtonColor: '#ffd700',
        })
      // Crea un documento nuevo cuando no hay id seleccionado.
      } else {
        // Envía los datos y la imagen con el token JWT del administrador.
        await api.createProject(formData, session.token)
        // Notifica que el backend creó correctamente el proyecto.
        await Swal.fire({
          icon: 'success',
          title: 'Project created',
          text: 'Your new project was added successfully.',
          confirmButtonColor: '#ffd700',
        })
      }
      // Limpia el formulario tras guardar correctamente.
      resetForm()
      // Vuelve a consultar la lista con el nuevo estado del backend.
      await loadProjects()
    // Muestra los errores devueltos por la API o la red.
    } catch (requestError) {
      // Conserva el mensaje para la interfaz y lo muestra en una alerta.
      setError(requestError.message)
      await Swal.fire({
        icon: 'error',
        title: editingId ? 'Could not update project' : 'Could not create project',
        text: requestError.message,
        confirmButtonColor: '#ffd700',
      })
    // Reactiva el botón una vez finalizada la solicitud.
    } finally {
      // Indica que ya no se está guardando el formulario.
      setSaving(false)
    }
  }

  // Elimina un proyecto después de confirmar la acción con el administrador.
  const handleDelete = async (item) => {
    // Confirma la eliminación antes de enviar la petición al backend.
    const confirmation = await Swal.fire({
      icon: 'warning',
      title: 'Delete project?',
      text: `“${item.name}” will be permanently deleted.`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#526674',
      reverseButtons: true,
    })
    if (!confirmation.isConfirmed) return

    // Limpia mensajes de la operación anterior.
    setError('')
    // Solicita la eliminación al backend.
    try {
      // Envía el id y el token de administrador a la ruta DELETE.
      await api.deleteProject(item._id, session.token)
      // Quita el registro eliminado de la lista visible.
      setProjects((current) => current.filter((entry) => entry._id !== item._id))
      // Reinicia el formulario si estaba editándose el registro borrado.
      if (editingId === item._id) resetForm()
      // Informa que el borrado terminó correctamente.
      await Swal.fire({
        icon: 'success',
        title: 'Project deleted',
        text: 'The project was deleted successfully.',
        confirmButtonColor: '#ffd700',
      })
    // Muestra el error si el backend rechaza o no puede borrar el registro.
    } catch (requestError) {
      // Guarda el mensaje que se mostrará en el panel.
      setError(requestError.message)
      await Swal.fire({
        icon: 'error',
        title: 'Could not delete project',
        text: requestError.message,
        confirmButtonColor: '#ffd700',
      })
    }
  }

  // Renderiza el formulario y la lista de proyectos guardados.
  return (
    // Contenedor principal del panel de administración de proyectos.
    <main className="dashboard dashboard-admin">
      {/* Encabezado con la cuenta activa y la acción de salida. */}
      <header className="dashboard-header">
        {/* Agrupa el título del panel y el correo del administrador. */}
        <div>
          {/* Identifica la sección administrativa. */}
          <h1>Portfolio projects</h1>
          {/* Muestra el correo asociado a la sesión activa. */}
          <p>Signed in as {session.user?.name}</p>
        </div>
        {/* Cierra la sesión al pulsar el botón. */}
        <button type="button" onClick={onLogout}>Sign out</button>
      </header>

      {/* Sección del formulario para crear o modificar un proyecto. */}
      <section className="dashboard-panel">
        {/* Cambia el título según se cree o edite un proyecto. */}
        <h2>{editingId ? 'Edit project' : 'Add a project'}</h2>
        {/* Gestiona el envío de los campos y el archivo de imagen. */}
        <form onSubmit={handleSubmit}>
          {/* Etiqueta accesible del campo nombre. */}
          <label htmlFor="project-name">Name</label>
          {/* Permite introducir el título del proyecto. */}
          <input id="project-name" name="name" value={project.name} onChange={handleChange} required />

          {/* Etiqueta accesible de la descripción. */}
          <label htmlFor="project-description">Description</label>
          {/* Permite introducir un resumen del proyecto. */}
          <textarea id="project-description" name="description" value={project.description} onChange={handleChange} required />

          {/* Etiqueta accesible del enlace al proyecto publicado. */}
          <label htmlFor="project-url">Live project URL</label>
          {/* Valida que la dirección del proyecto tenga formato URL. */}
          <input id="project-url" name="url" type="url" value={project.url} onChange={handleChange} required />

          {/* Etiqueta accesible del enlace al código fuente. */}
          <label htmlFor="project-code">Source code URL</label>
          {/* Valida que la dirección del repositorio tenga formato URL. */}
          <input id="project-code" name="code" type="url" value={project.code} onChange={handleChange} required />

          {/* Aclara si se necesita una imagen para este tipo de operación. */}
          <label htmlFor="project-image">Project image {editingId ? '(optional)' : ''}</label>
          {/* El selector acepta formatos de imagen del backend y exige archivo al crear. */}
          <input
            id="project-image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required={!editingId}
            onChange={(event) => setImage(event.target.files?.[0] || null)}
          />

          {/* Expone los errores como alertas accesibles. */}
          {error && <p className="dashboard-message error" role="alert">{error}</p>}
          {/* Agrupa las acciones de guardar y cancelar edición. */}
          <div className="dashboard-actions">
            {/* Envía el formulario y refleja el estado de guardado. */}
            <button type="submit" disabled={saving}>
              {/* Cambia el texto según el estado y la operación activa. */}
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create project'}
            </button>
            {/* Ofrece cancelar si el formulario está editando un proyecto. */}
            {editingId && <button type="button" onClick={resetForm}>Cancel edit</button>}
          </div>
        {/* Cierra el formulario del proyecto. */}
        </form>
      {/* Cierra la sección de creación y edición. */}
      </section>

      {/* Permite al usuario autenticado actualizar sus datos de cuenta. */}
      <section className="dashboard-panel dashboard-profile">
        <h2>Account information</h2>
        <form onSubmit={handleProfileSubmit}>
          <label htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            required
          />

          <label htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleProfileChange}
            required
          />

          <h3>Change password (optional)</h3>
          <label htmlFor="profile-current-password">Current password</label>
          <input
            id="profile-current-password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={profile.currentPassword}
            onChange={handleProfileChange}
            required={Boolean(profile.password)}
          />

          <label htmlFor="profile-password">New password</label>
          <input
            id="profile-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={profile.password}
            onChange={handleProfileChange}
          />

          <label htmlFor="profile-confirm-password">Confirm new password</label>
          <input
            id="profile-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={profile.confirmPassword}
            onChange={handleProfileChange}
          />

          <div className="dashboard-actions">
            <button type="submit" disabled={savingProfile}>
              {savingProfile ? 'Saving…' : 'Save account information'}
            </button>
          </div>
        </form>
      </section>

      {/* Sección que lista los documentos almacenados en el backend. */}
      <section className="dashboard-projects">
        {/* Identifica la lista de proyectos guardados. */}
        <h2>Saved projects</h2>
        {/* Informa de la carga, lista vacía o muestra los registros. */}
        {loading ? <p>Loading projects…</p> : projects.length === 0 ? <p>No projects yet.</p> : (
          // Agrupa las tarjetas de proyecto como una lista semántica.
          <ul>
            {/* Crea una fila de administración por cada documento. */}
            {projects.map((item) => (
              // Usa el id de MongoDB como clave estable de React.
              <li key={item._id}>
                {/* Muestra la miniatura si el registro tiene imagen. */}
                {item.image && <img src={item.image} alt="" />}
                {/* Agrupa el nombre y la descripción del proyecto. */}
                <div className="dashboard-project-details">
                  {/* Presenta el título guardado. */}
                  <h3>{item.name}</h3>
                  {/* Presenta el resumen guardado. */}
                  <p>{item.description}</p>
                </div>
                {/* Agrupa las acciones disponibles para el registro. */}
                <div className="dashboard-actions">
                  {/* Copia el registro al formulario para editarlo. */}
                  <button type="button" onClick={() => handleEdit(item)}>Edit</button>
                  {/* Elimina el registro tras pedir confirmación. */}
                  <button type="button" onClick={() => handleDelete(item)}>Delete</button>
                </div>
              {/* Cierra la fila del proyecto. */}
              </li>
            ))}
          {/* Cierra la lista de proyectos. */}
          </ul>
        )}
      {/* Cierra la sección de registros guardados. */}
      </section>
    {/* Cierra el panel administrativo. */}
    </main>
  )
}

// Exporta el panel para que Dashboard lo muestre con sesión válida.
export default Home

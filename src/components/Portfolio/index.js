// Importa efectos y estado para la carga y animación de la galería.
import { useEffect, useState } from 'react'
// Importa el indicador visual que se muestra durante la carga.
import Loader from 'react-loaders'
// Importa el componente que anima el título de la página.
import AnimatedLetters from '../AnimatedLetters'
// Importa el cliente HTTP que obtiene proyectos del backend.
import { api } from '../../services/api'
// Carga los estilos de la galería de proyectos.
import './index.scss'

// Obtiene y presenta los proyectos públicos del portafolio.
const Portfolio = () => {
  // Guarda la clase que controla la animación del encabezado.
  const [letterClass, setLetterClass] = useState('text-animate')
  // Almacena los proyectos devueltos por el backend.
  const [projects, setProjects] = useState([])
  // Indica que la solicitud de proyectos todavía está pendiente.
  const [loading, setLoading] = useState(true)
  // Conserva el mensaje si falla la carga del portafolio.
  const [error, setError] = useState('')

  // Cambia la clase del título tras el tiempo inicial de animación.
  useEffect(() => {
    // Programa la transición a la animación de hover.
    const timer = setTimeout(() => setLetterClass('text-animate-hover'), 3000)
    // Cancela el temporizador si la página se desmonta antes.
    return () => clearTimeout(timer)
  // Inicia el temporizador una sola vez al montar la página.
  }, [])

  // Solicita la lista pública del backend al montar la página.
  useEffect(() => {
    // Controla que las respuestas no actualicen estado tras desmontar.
    let active = true

    // Ejecuta la consulta de proyectos.
    api.getProjects()
      // Guarda la lista recibida mientras el componente siga activo.
      .then((items) => {
        if (active) setProjects(items)
      })
      // Conserva el mensaje de error para mostrarlo en la página.
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      // Termina el indicador de carga al finalizar la petición.
      .finally(() => {
        if (active) setLoading(false)
      })

    // Invalida las callbacks cuando la página se desmonta.
    return () => {
      active = false
    }
  // No repite la carga mientras el componente permanezca montado.
  }, [])

  // Renderiza el encabezado, los estados de carga y las tarjetas.
  return (
    // Agrupa elementos sin agregar un nodo adicional al documento.
    <>
      {/* Contiene el contenido principal de la página de portafolio. */}
      <div className="container portfolio-page">
        {/* Presenta el título animado de la galería. */}
        <h1 className="page-title">
          {/* Divide y anima cada carácter de la palabra Portfolio. */}
          <AnimatedLetters
            letterClass={letterClass}
            strArray={'Portfolio'.split('')}
            idx={15}
          />
        {/* Cierra el encabezado de la página. */}
        </h1>
        {/* Informa del error de red o API con semántica accesible. */}
        {error && <p className="portfolio-message" role="alert">Could not load projects: {error}</p>}
        {/* Indica que no hay elementos cuando la consulta terminó vacía. */}
        {!error && !loading && projects.length === 0 && (
          // Muestra un mensaje cuando todavía no se publicaron proyectos.
          <p className="portfolio-message">Projects will appear here soon.</p>
        )}
        {/* Agrupa las tarjetas responsivas de los proyectos. */}
        <div className="images-container">
          {/* Construye una tarjeta por cada documento devuelto por la API. */}
          {projects.map((project) => (
            // Usa el id de MongoDB para mantener una clave estable.
            <article className="image-box" key={project._id}>
              {/* Muestra la imagen del proyecto con carga diferida. */}
              <img
                src={project.image}
                className="portfolio-image"
                alt={`${project.name} project`}
                loading="lazy"
              />
              {/* Superpone los detalles y enlaces sobre la imagen. */}
              <div className="content">
                {/* Presenta el nombre devuelto por el backend. */}
                <p className="title">{project.name}</p>
                {/* Presenta la descripción breve del proyecto. */}
                <p className="description">{project.description}</p>
                {/* Añade el enlace de producción si el proyecto lo tiene. */}
                {project.url && (
                  // Abre el proyecto publicado en otra pestaña.
                 <button
                  type="button"
                  className="btn"
                  onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
                >
                  View
                </button>
                )}
                {/* Añade el enlace del repositorio si está disponible. */}
                {project.code && (
                  // Abre el código fuente en otra pestaña segura.
                    <button
                      type="button"
                      className="btn"
                      onClick={() => window.open(project.code, '_blank', 'noopener,noreferrer')}
                      >
                      Code
                    </button>
                )}
              {/* Cierra la capa de contenido de la tarjeta. */}
              </div>
            {/* Cierra la tarjeta del proyecto. */}
            </article>
          ))}
        {/* Cierra el contenedor de tarjetas. */}
        </div>
      {/* Cierra el contenedor principal de la página. */}
      </div>
      {/* Muestra Pac-Man mientras llegan los proyectos del backend. */}
      {loading && <Loader type="pacman" />}
    {/* Cierra el fragmento que agrupa la página y el cargador. */}
    </>
  )
}

// Exporta Portfolio para usarlo como página dentro del enrutador.
export default Portfolio

// Importa los componentes de enrutamiento de React Router.
import { Route, Routes } from 'react-router-dom'
// Importa la página principal del sitio.
import Home from './components/Home'
// Importa la página con información sobre el sitio o autor.
import About from './components/About'
// Importa la página del formulario de contacto.
import Contact from './components/Contact'
// Importa el contenedor compartido de las páginas.
import Layout from './components/Layout'
// Importa la página que muestra el portafolio.
import Portfolio from './components/Portfolio'
// Importa el panel de administración.
import Dashboard from './components/Dashboard'
// Carga los estilos globales de la aplicación.
import './App.scss'

// Define el componente raíz y las rutas visibles de la aplicación.
function App() {
  // Devuelve la estructura de rutas de React Router.
  return (
    // Usa un fragmento para agrupar elementos sin añadir un nodo al DOM.
    <>
      {/* Declara las rutas que la aplicación puede mostrar. */}
      <Routes>
        {/* Aplica el diseño común a todas las rutas anidadas. */}
        <Route path="/" element={<Layout />}>
          {/* Muestra Home al acceder a la ruta raíz. */}
          <Route index element={<Home />} />
          {/* Asocia la ruta /about con la página About. */}
          <Route path="/about" element={<About />} />
          {/* Asocia la ruta /contact con la página Contact. */}
          <Route path="/contact" element={<Contact />} />
          {/* Asocia la ruta /portfolio con la página Portfolio. */}
          <Route path="/portfolio" element={<Portfolio />} />
          {/* Asocia la ruta /dashboard con el panel Dashboard. */}
          <Route path="/dashboard" element={<Dashboard />} />
        {/* Cierra la ruta padre que contiene las páginas. */}
        </Route>
      {/* Cierra el conjunto de rutas. */}
      </Routes>
    {/* Cierra el fragmento contenedor. */}
    </>
  // Finaliza la función del componente App.
  )
}

// Exporta App para que pueda montarse desde el punto de entrada.
export default App

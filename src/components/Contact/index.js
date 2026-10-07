import { useRef, useState } from 'react'
// Importa el indicador de carga que aparece en la página.
import Loader from 'react-loaders'
import emailjs from '@emailjs/browser'
// Importa los componentes necesarios para mostrar el mapa interactivo.
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// Importa el componente que anima las letras del encabezado.
import AnimatedLetters from '../AnimatedLetters'
// Carga los estilos propios de la página de contacto.
import './index.scss'
import Swal from 'sweetalert2'

// Define la página de contacto y su comportamiento.
const Contact = () => {
  // Guarda la clase CSS que anima el título.
  const [letterClass ] = useState('text-animate text-animate-hover')
  const form = useRef()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const sendEmail = (event) => {
    event.preventDefault()

    emailjs
      .sendForm(
        'service_lt1wr2q',
        'template_5khu81x',
        form.current,
        'X4oXGvXKYDaaJaiUb'
      )
      .then(
        () => {
          setFormData({ name: '', email: '', subject: '', message: '' })
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Message sent successfully',
            showConfirmButton: false,
            timer: 2500,
          })
        },
        () => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Something went wrong!',
            showConfirmButton: false,
            timer: 1500,
          })
        }
      )
  }

  // Renderiza el contenido de la página de contacto.
  return (
    // Agrupa los elementos sin añadir un contenedor extra al DOM.
    <>
      {/* Contiene las columnas principales de la página. */}
      <div className="container contact-page">
        {/* Agrupa el título, texto y formulario. */}
        <div className="text-zone">
          {/* Presenta el título animado de la página. */}
          <h1>
            {/* Anima las letras de la palabra Contact me. */}
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['C', 'o', 'n', 't', 'a', 'c', 't', ' ', 'm', 'e']}
              idx={15}
            />
          {/* Cierra el encabezado. */}
          </h1>
          {/* Muestra el mensaje introductorio de contacto. */}
          <p>
          I am very interested in any job opportunity that requires talent 
          and a lot of dedication, do not hesitate to write me, 
          where I come from we love to solve problems and provide solutions to everything no matter how difficult the situation is
          </p>
          <div className="contact-form">
            <form ref={form} onSubmit={sendEmail}>
              <ul>
                <li className="half">
                  <input
                    placeholder="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    required
                  />
                </li>
                <li className="half">
                  <input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    required
                  />
                </li>
                <li>
                  <input
                    placeholder="Subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                    required
                  />
                </li>
                <li>
                  <textarea
                    placeholder="Message"
                    name="message"
                    value={formData.message}
                    onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                    required
                  />
                </li>
                <li>
                  <input type="submit" className="flat-button" value="SEND" />
                </li>
              </ul>
            </form>
          </div>
        </div>
        {/* Muestra los datos de ubicación y contacto directo. */}
        <div className="info-map">
          Wilmer Pocaterra
          <br />
          España
          <br />
          Santa Cruz de Tenerife, Tenerife
          <br />
          <br />
          <span>malgein17@gmail.com</span>
          <br/>
          <span>Phone number: +34-643193991</span>
        </div>
        {/* Contiene el mapa interactivo de la ubicación. */}
        <div className="map-wrap">
        {/* Centra el mapa en Tenerife con un nivel de zoom inicial. */}
        <MapContainer center={[28.427666, -16.309374]} zoom={13}>
            {/* Carga los mosaicos cartográficos de OpenStreetMap. */}
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/* Añade un marcador en la ubicación indicada. */}
            <Marker position={[28.427666, -16.309374]}>
              {/* Muestra una nota al abrir el marcador. */}
              <Popup>Wilmer lives here, come over for a cup of coffee :)</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
      {/* Muestra el indicador Pac-Man de carga. */}
      <Loader type="pacman" />
    </>
  )
}

// Exporta el componente para usarlo en el sistema de rutas.
export default Contact

import {  useState } from 'react'
import Loader from 'react-loaders'
import { useRef } from 'react'
import emailjs from '@emailjs/browser'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import Swal from 'sweetalert2'

const Contact = () => {
  const [letterClass ] = useState('text-animate text-animate-hover')
  const form = useRef()

  const [formData, setFormData] = useState({
  name: '',
  email: '',
  subject: '',
  message: '',
})

 
  const sendEmail = (e) => {
    e.preventDefault()

    emailjs
      .sendForm('service_lt1wr2q', 'template_5khu81x', form.current, 'X4oXGvXKYDaaJaiUb')
      .then(
        () => {
          setFormData({
              name: '',
              email: '',
              subject: '',
              message: '',
          })
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Message send succesfully",
            showConfirmButton: false,
            timer: 2500
          });
        },
        () => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "something went wrong!",
            showConfirmButton: false,
            timer: 1500
          });
        }
      )
  }

  return (
    <>
      <div className="container contact-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['C', 'o', 'n', 't', 'a', 'c', 't', ' ', 'm', 'e']}
              idx={15}
            />
          </h1>
          <p>
          I am very interested in any job opportunity that requires talent 
          and a lot of dedication, do not hesitate to write me, 
          where I come from we love to solve problems and provide solutions to everything no matter how difficult the situation is
          </p>
          <div className="contact-form">
            <form ref={form} onSubmit={sendEmail}>
              <ul>
                <li className="half">
                  <input placeholder="Name" type="text" name="name" 
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                  required />
                </li>
                <li className="half">
                  <input
                    placeholder="Email"
                    type="email"
                    name="email"
                     value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </li>
                <li>
                  <input
                    placeholder="Subject"
                    type="text"
                    name="subject"
                     value={formData.subject}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subject: e.target.value,
                      })
                    }
                    required
                  />
                </li>
                <li>
                  <textarea
                    placeholder="Message"
                    name="message"
                    required
                     value={formData.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      })
                    }
                  ></textarea>
                </li>
                <li>
                  <input type="submit" className="flat-button" value="SEND" />
                </li>
              </ul>
            </form>
          </div>
        </div>
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
        <div className="map-wrap">
        <MapContainer center={[28.427666, -16.309374]} zoom={13}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[28.427666, -16.309374]}>
              <Popup>Wilmer lives here, come over for a cup of coffee :)</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default Contact


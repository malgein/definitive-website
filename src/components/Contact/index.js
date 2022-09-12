import {  useState } from 'react'
import Loader from 'react-loaders'
import { useRef } from 'react'
import emailjs from '@emailjs/browser'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const Contact = () => {
  const [letterClass, setLetterClass] = useState('text-animate text-animate-hover')
  const form = useRef()

 
  const sendEmail = (e) => {
    e.preventDefault()

    emailjs
      .sendForm('service_lt1wr2q', 'template_5khu81x', form.current, 'X4oXGvXKYDaaJaiUb')
      .then(
        () => {
          alert('Message successfully sent!')
          window.location.reload(false)
        },
        () => {
          alert('Failed to send the message, please try again')
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
                  <input placeholder="Name" type="text" name="name" required />
                </li>
                <li className="half">
                  <input
                    placeholder="Email"
                    type="email"
                    name="email"
                    required
                  />
                </li>
                <li>
                  <input
                    placeholder="Subject"
                    type="text"
                    name="subject"
                    required
                  />
                </li>
                <li>
                  <textarea
                    placeholder="Message"
                    name="message"
                    required
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
          Venezuela,
          <br />
          Maracaibo, estado Zulia
          <br />
          <br />
          <span>malgein17@gmail.com</span>
          <br/>
          <span>Phone number: 58-4246250714</span>
        </div>
        <div className="map-wrap">
        <MapContainer center={[10.671288, -71.674868]} zoom={13}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[10.671288, -71.674868]}>
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
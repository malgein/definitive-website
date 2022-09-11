import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import {
  faNode,
  faCss3,
  faGitAlt,
  faHtml5,
  faJsSquare,
  faReact,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.scss'

const About = () => {

  const [letterClass, setLetterClass] = useState('text-animate text-animate-hover')

  

  return (
    <>
      <div className="container about-page">
        <div className="text-zone">
          <h1>
          <AnimatedLetters
                letterClass={letterClass}
                strArray={['A', 'b', 'o', 'u', 't', ' ', 'm', 'e']}
                idx={15}
              />
          </h1>
          <p>
          I am a front-end developer, I specialize in the structure and 
          creation of UI, currently learning back-end development for a 
          better contribution to those who want to acquire my services, I am looking for job opportunities where I can demonstrate my value in conjunction with other colleagues who share my vision
          </p>
          <p align="LEFT">
          I have a critical mind, open thinking, if you have a problem I am part 
          of the solution, I love to learn and work as a team
          </p>
          <p>
          I am a developer who loves programing, computers, and all that kind of tecnologies, 
          that is my passion after health sciences, my speciality is front-end, I love to desing an create amazing aplications, it's really great create something by giving instrucctions to a machine.
          </p>
        </div>
        <div className="stage-cube-cont">
            <div className="cubespinner">
              <div className="face1">
                <FontAwesomeIcon icon={faNode} color="green" />
              </div>
              <div className="face2">
                <FontAwesomeIcon icon={faHtml5} color="#F06529" />
              </div>
              <div className="face3">
                <FontAwesomeIcon icon={faCss3} color="#28A4D9" />
              </div>
              <div className="face4">
                <FontAwesomeIcon icon={faReact} color="#5ED4F4" />
              </div>
              <div className="face5">
                <FontAwesomeIcon icon={faJsSquare} color="#EFD81D" />
              </div>
              <div className="face6">
                <FontAwesomeIcon icon={faGitAlt} color="#EC4D28" />
              </div>
            </div>
        </div>
      </div>
      <Loader type="pacman" />
    </>
	)
}

export default About
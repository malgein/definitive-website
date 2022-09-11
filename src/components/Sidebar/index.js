import './index.scss'
import React, {useState} from 'react'
import {Link, NavLink} from 'react-router-dom'
import LogoW from '../../assets/images/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faHome, faUser, faSuitcase, faBars, faClose} from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin, faSkype } from '@fortawesome/free-brands-svg-icons'

const Sidebar = () =>{

	const [showNav, setShowNav] = useState(false);

	return(
		<div className="nav-bar">
			<Link className="logo" to='/'>
				<img src={LogoW} alt="logo" />
				<p>Wilmer</p>
			</Link>
			<nav className={showNav ? 'mobile-show' : ''}>
				<NavLink 
					onClick={() => setShowNav(false)}
					exact="true" activeclassname="active" to="/">
					<FontAwesomeIcon icon={faHome} color="#4d4d4c" />
				</NavLink>
				<NavLink 
					onClick={() => setShowNav(false)}
					exact="true" activeclassname="active" to="/about"
					className="about-link">
					<FontAwesomeIcon icon={faUser} color="#4d4d4c" />
				</NavLink>
				<NavLink 
					onClick={() => setShowNav(false)}
					exact="true" activeclassname="active" to="/contact"
					className="contact-link">
					<FontAwesomeIcon icon={faEnvelope} color="#4d4d4c" />
				</NavLink>
				<NavLink
					onClick={() => setShowNav(false)}
          activeclassname="active"
          className="portfolio-link"
          to="/portfolio">
          <FontAwesomeIcon icon={faSuitcase} color="#4d4d4e" />
        </NavLink>
				<FontAwesomeIcon 
          onClick={() => setShowNav(false)}
          icon={faClose}
          color="#ffd700"
          size="3x"
          className='close-icon' />
			</nav>
				<ul>
					<li>
						<a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/wilmerpocaterra/">
							<FontAwesomeIcon icon={faLinkedin} color="4d4d4e" />
						</a>
					</li>
					<li>
						<a target="_blank" rel="noreferrer" href="https://github.com/malgein">
							<FontAwesomeIcon icon={faGithub} color="4d4d4e" />
						</a>
					</li>
					<li>
						<a target="_blank" rel="noreferrer" href="https://join.skype.com/invite/oUFdpU9UhrUb">
							<FontAwesomeIcon icon={faSkype} color="4d4d4e" />
						</a>
					</li>
				</ul>
				<FontAwesomeIcon 
          onClick={() => setShowNav(true)}
          icon={faBars}
          color="#ffd700"
          size="3x"
          className='hamburger-icon' />
		</div>
	)
}

export default Sidebar
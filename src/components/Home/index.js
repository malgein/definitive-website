import logoTitle from '../../assets/images/logo.svg'
import AnimatedLetters from '../AnimatedLetters'
import {Link} from 'react-router-dom'
import './index.scss'

const Home =() =>{

	const letterClass = 'text-animate text-animate-hover'

  const nameArray = ['','','','','','','','i' , 'l' , 'm' , 'e' , 'r' ]
  const jobArray = [
    'w',
    'e',
    'b',
    ' ',
    'd',
    'e',
    'v',
    'e',
    'l',
    'o',
    'p',
    'e',
    'r',
    '.',
  ]

	

	return(
		<div className="container home-page">
			<div className="text-zone">
				<h1> <span className={letterClass}>H</span>
            <span className={`${letterClass} _12`}>i,</span>
            <br />
            <span className={`${letterClass} _13`}>I</span>
            <span className={`${letterClass} _14`}>'m</span>
            <img src={logoTitle} alt="logo" />
					<AnimatedLetters
              letterClass={letterClass}
              strArray={nameArray}
              idx={15}
            />
            <br />
            <AnimatedLetters
              letterClass={letterClass}
              strArray={jobArray}
              idx={22}
            />
				</h1>
				<h2>Front-end developer / Full-stack developer / Back-end developer </h2>
				<Link to='/contact' className='flat-button'>
					CONTACT ME
				</Link>
			</div>
      <img src={logoTitle} alt="logo2" className="big-img" />
		</div>
	)
}

export default Home
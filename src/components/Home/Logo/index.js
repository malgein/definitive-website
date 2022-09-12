import LogoS from '../../../assets/images/logo.svg'
import './index.scss'

const Logo = ()  => {
	

	return(
		<div className="logo-container" >
      <img
        className="solid-logo"
        src={LogoS}
        alt="JavaScript,  Developer"
      />
    </div>
	)
}

export default Logo
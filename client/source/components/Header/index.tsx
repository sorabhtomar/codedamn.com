import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './styles.scss'
import css from 'react-css-modules'
import Menu from '@material-ui/icons/Menu'

const mapStateToProps = ({system}) => ({
	userLoggedIn: system.userLoggedIn,
	user: system.user,
	headerType: system.headerType
})

let rightNavLoggedOut = (
	<div styleName="right-transparent-nav">
		<div styleName="item">
			<Link to="/about">Know More</Link>
		</div>

		<div styleName="item">
			<Link to="/feedback">Feedback</Link>
		</div>

		<div styleName="item">
			<Link to={{pathname: "/register", search: window.location.search}}>Register</Link>
		</div>

		<div styleName="item">
			<Link to={{pathname: "/login", search: window.location.search}}>Login</Link>
		</div>

	</div>
)

let rightNavLoggedIn = (
	<div styleName="right-transparent-nav">
		<div styleName="item">
			<Link to={"/damn-table"}>Damn Table</Link>
		</div>
		<div styleName="item">
			<Link to={"/settings"}>Settings</Link>
		</div>

		<div styleName="item">
			<Link to={"/feedback"}>Feedback</Link>
		</div>

		<div styleName="item">
			<Link to={"/about"}>Know More</Link>
		</div>

		<div styleName="item">
			<Link to={"/logout"}>Logout</Link>
		</div>
	</div>
)

let loggedInLinks = (
	<>
		<Link styleName='item' to={"/damn-table"}>Damn Table</Link>
		<Link styleName='item' to={"/settings"}>Settings</Link>
		<Link styleName='item' to={"/logout"}>Sign out</Link>
	</>
)

let loggedOutLinks = (
	<>
		<Link to={{pathname: "/login", search: window.location.search}} styleName='item'>
			Login
		</Link>
		<Link to={{pathname: "/register", search: window.location.search}} styleName='item signup-button'>
			Register
		</Link>
	</>
)

function Header(props) {

	const [menuVisible, setMenuVisible] = useState(false)

	function expandLinksResponsive(event) {
		setMenuVisible(menuVisible => !menuVisible)
        event.preventDefault()
	}

	const { userLoggedIn } = props
	const nav = userLoggedIn? loggedInLinks: loggedOutLinks

	const leftNavbarStyles = [styles['navbar-left-links']]
	const rightNavbarStyles = [styles['navbar-right']]
	if (!menuVisible) {
		leftNavbarStyles.push(styles.hideOnMobile)
		rightNavbarStyles.push(styles.hideOnMobile)
	}

	return (
	<header styleName='main-navbar'>
		<div styleName='navbar-left'>
			<Link to="/" styleName="image-text-pair">
				<img src={`/assets/images/red-logo.png`} />

				<div styleName='textDiv'>
					codedamn
				</div>

				<div styleName='expand-icon'>
					<Menu onClick={(event) => expandLinksResponsive(event)} />
				</div>
			</Link>

			<div className={leftNavbarStyles.join(' ')}>
				<Link to="/about" styleName='item'>About us</Link>
				<Link to="/feedback" styleName='item'>Got feedback?</Link>
			</div>
		</div>

		<div className={rightNavbarStyles.join(' ')}>
			{nav}
		</div>
	</header>
	)
}

let com = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(Header)
com = connect(mapStateToProps, {})(com)

export default com
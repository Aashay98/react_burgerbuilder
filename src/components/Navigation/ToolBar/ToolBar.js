import React from "react";
import classes from "./ToolBar.css";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import DrawerToggle from "../DrawerToggle/DrawerToggle";

const ToolBar = (props) => {
	return (
		<header className={classes.ToolBar}>
			<DrawerToggle clicked={props.toggleClicked} />
			<div className={classes.Logo}>
				<Logo />
			</div>
			<nav className={classes.DesktopOnly}>
				<NavigationItems isAuth={props.isAuth} />
			</nav>
		</header>
	);
};

export default ToolBar;

import React, { useState } from "react";
import classes from "./Layout.css";
import Aux from "../Container";
import ToolBar from "../../components/Navigation/ToolBar/ToolBar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import { connect } from "react-redux";

const Layout = (props) => {
	const [showSideDrawer, setShowSideDrawer] = useState(false);
	const sideDrawerCloseHandler = () => {
		setShowSideDrawer(false);
	};
	const sideDrawerToggleHandler = () => {
		setShowSideDrawer(!showSideDrawer);
	};

	return (
		<Aux>
			<div>
				<ToolBar
					isAuth={props.isAuthenticated}
					toggleClicked={sideDrawerToggleHandler}
				/>
				<SideDrawer
					isAuth={props.isAuthenticated}
					isOpen={showSideDrawer}
					closed={sideDrawerCloseHandler}
				/>
			</div>
			<main className={classes.Content}>{props.children}</main>
		</Aux>
	);
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null,
	};
};
export default connect(mapStateToProps)(Layout);

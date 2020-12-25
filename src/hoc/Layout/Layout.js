import React, { Component } from "react";
import classes from "./Layout.css";
import Aux from "../Container";
import ToolBar from "../../components/Navigation/ToolBar/ToolBar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import { connect } from "react-redux";

class Layout extends Component {
	state = {
		showSideDrawer: false,
	};
	sideDrawerCloseHandler = () => {
		this.setState({ showSideDrawer: false });
	};
	sideDrawerToggleHandler = () => {
		this.setState({ showSideDrawer: !this.state.showSideDrawer });
	};
	render() {
		return (
			<Aux>
				<div>
					<ToolBar
						isAuth={this.props.isAuthenticated}
						toggleClicked={this.sideDrawerToggleHandler}
					/>
					<SideDrawer
						isAuth={this.props.isAuthenticated}
						isOpen={this.state.showSideDrawer}
						closed={this.sideDrawerCloseHandler}
					/>
				</div>
				<main className={classes.Content}>
					{this.props.children}
				</main>
			</Aux>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null,
	};
};
export default connect(mapStateToProps)(Layout);

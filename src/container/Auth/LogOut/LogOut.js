import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as actions from "../../../store/actions/index";

export const LogOut = (props) => {
	useEffect(() => {
		props.onLogout();
	}, []);

	return <Redirect to="/" />;
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLogout: () => dispatch(actions.logOut()),
	};
};

export default connect(null, mapDispatchToProps)(LogOut);

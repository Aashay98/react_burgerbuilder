import React, { lazy, Suspense, useEffect } from "react";
import BurgerBuilder from "./container/BurgerBuilder/BurgerBuilder";
import Layout from "./hoc/Layout/Layout";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { LogOut } from "./container/Auth/LogOut/LogOut";
import * as actions from "./store/actions/index";
import { connect } from "react-redux";
import Spinner from "./components/UI/Spinner/Spinner";

const Checkout = lazy(() => {
	return import("./container/Checkout/Checkout");
});

const Orders = lazy(() => {
	return import("./container/Orders/Orders");
});

const Auth = lazy(() => {
	return import("./container/Auth/Auth");
});

const App = (props) => {
	useEffect(() => {
		props.onTryAutoSignup();
	}, []);

	let routes = (
		<Switch>
			<Route path="/auth" render={(props) => <Auth {...props} />} />
			<Route path="/" exact component={BurgerBuilder} />
			<Redirect to="/" />
		</Switch>
	);

	if (props.isAuthenticated) {
		routes = (
			<Switch>
				<Route
					path="/auth"
					render={(props) => <Auth {...props} />}
				/>
				<Route
					path="/checkout"
					render={(props) => <Checkout {...props} />}
				/>
				<Route
					path="/orders"
					render={(props) => <Orders {...props} />}
				/>
				<Route path="/logout" component={LogOut} />
				<Route path="/" exact component={BurgerBuilder} />
			</Switch>
		);
	}
	return (
		<div>
			<Layout>
				<Suspense fallback={<Spinner />}>{routes}</Suspense>
			</Layout>
		</div>
	);
};
const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onTryAutoSignup: () => dispatch(actions.authCheckState()),
	};
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

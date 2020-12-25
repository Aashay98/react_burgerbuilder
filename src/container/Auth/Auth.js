import React, { useEffect, useState } from "react";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import classes from "./Auth.css";
import * as authActions from "../../store/actions/index";
import ErrorHandlerModal from "../../hoc/ErrorHandlerModal/ErrorHandlerModal";
import { connect } from "react-redux";
import axios from "../../axios-order";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";
import { checkValidity, updateObject } from "../../shared/utility";

export const Auth = (props) => {
	const [controls, setControls] = useState({
		email: {
			elementType: "input",
			elementConfig: {
				type: "email",
				placeholder: "Mail Address",
			},
			value: "",
			validation: {
				required: true,
				isEmail: true,
			},
			valid: false,
			touched: false,
		},
		password: {
			elementType: "input",
			elementConfig: {
				type: "password",
				placeholder: "Password",
			},
			value: "",
			validation: {
				required: true,
				minLength: 8,
			},
			valid: false,
			touched: false,
		},
	});
	const [isSignUp, setIsSignUp] = useState(true);

	useEffect(() => {
		if (!props.buildingBurger && props.authRedirectPath !== "/") {
			props.onSetAuthRedirectPath();
		}
	}, []);

	const inputChangedHandler = (event, controlName) => {
		const updatedControlsForm = updateObject(controls, {
			[controlName]: updateObject(controls[controlName], {
				value: event.target.value,
				valid: checkValidity(
					event.target.value,
					controls[controlName].validation,
				),
				touched: true,
			}),
		});
		setControls(updatedControlsForm);
	};

	const submitHandler = (event) => {
		event.preventDefault();
		props.onAuthCheck(
			controls.email.value,
			controls.password.value,
			isSignUp,
		);
	};
	const switchAuthModeHandler = () => {
		setIsSignUp(!isSignUp);
	};

	const formElementsArray = [];
	for (let key in controls) {
		formElementsArray.push({
			id: key,
			config: controls[key],
		});
	}

	let form = formElementsArray.map((formElement) => (
		<Input
			key={formElement.id}
			elementType={formElement.config.elementType}
			elementConfig={formElement.config.elementConfig}
			value={formElement.config.value}
			invalid={!formElement.config.valid}
			shouldValidate={formElement.config.validation}
			touched={formElement.config.touched}
			changed={(event) =>
				inputChangedHandler(event, formElement.id)
			}
		/>
	));

	if (props.loading) {
		form = <Spinner />;
	}

	let errorMessage = null;
	if (props.error) {
		errorMessage = <p>{props.error.message}</p>;
	}

	let authRedirect = null;
	if (props.isAuth) {
		authRedirect = <Redirect to={props.authRedirectPath} />;
	}

	return (
		<div className={classes.Auth}>
			{authRedirect}
			<form onSubmit={submitHandler}>
				{form}
				{errorMessage}
				<Button btnType="Success">SUBMIT</Button>
			</form>
			<Button btnType="Danger" clicked={switchAuthModeHandler}>
				SWITCH TO {isSignUp ? "SIGNIN" : "SIGNUP"}
			</Button>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		error: state.auth.error,
		loading: state.auth.loading,
		isAuth: state.auth.token !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirectPath: state.auth.authRedirectPath,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuthCheck: (email, password, isSignUp) =>
			dispatch(authActions.auth(email, password, isSignUp)),
		onSetAuthRedirectPath: () =>
			dispatch(authActions.setAuthRedirectPath("/")),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ErrorHandlerModal(Auth, axios));

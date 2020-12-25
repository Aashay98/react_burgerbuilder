import React, { Component } from "react";
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

export class Auth extends Component {
	state = {
		controls: {
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
		},
		isSignUp: true,
	};
	componentDidMount() {
		if (
			!this.props.buildingBurger &&
			this.props.authRedirectPath !== "/"
		) {
			this.props.onSetAuthRedirectPath();
		}
	}

	inputChangedHandler = (event, controlName) => {
		const updatedControlsForm = updateObject(this.state.controls, {
			[controlName]: updateObject(
				this.state.controls[controlName],
				{
					value: event.target.value,
					valid: checkValidity(
						event.target.value,
						this.state.controls[controlName].validation,
					),
					touched: true,
				},
			),
		});
		this.setState({
			controls: updatedControlsForm,
		});
	};
	submitHandler = (event) => {
		event.preventDefault();
		this.props.onAuthCheck(
			this.state.controls.email.value,
			this.state.controls.password.value,
			this.state.isSignUp,
		);
	};
	switchAuthModeHandler = () => {
		this.setState((prevState) => {
			return { isSignUp: !prevState };
		});
	};
	render() {
		const formElementsArray = [];
		for (let key in this.state.controls) {
			formElementsArray.push({
				id: key,
				config: this.state.controls[key],
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
					this.inputChangedHandler(event, formElement.id)
				}
			/>
		));

		if (this.props.loading) {
			form = <Spinner />;
		}

		let errorMessage = null;
		if (this.props.error) {
			errorMessage = <p>{this.props.error.message}</p>;
		}

		let authRedirect = null;
		if (this.props.isAuth) {
			authRedirect = <Redirect to={this.props.authRedirectPath} />;
		}

		return (
			<div className={classes.Auth}>
				{authRedirect}
				<form onSubmit={this.submitHandler}>
					{form}
					{errorMessage}
					<Button btnType="Success">SUBMIT</Button>
				</form>
				<Button
					btnType="Danger"
					clicked={this.switchAuthModeHandler}>
					SWITCH TO{" "}
					{this.state.isSignUp ? "SIGNIN" : "SIGNUP"}
				</Button>
			</div>
		);
	}
}

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

import React, { useEffect, useState } from "react";
import Aux from "../../hoc/Container";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-order";
import Spinner from "../../components/UI/Spinner/Spinner";
import ErrorHandlerModal from "../../hoc/ErrorHandlerModal/ErrorHandlerModal";
import { connect } from "react-redux";
import * as burgerBuilderActions from "../../store/actions/index";

export const BurgerBuilder = (props) => {
	const [purchasing, setPurchasing] = useState(false);

	const { onInitIngredients } = props;
	useEffect(() => {
		onInitIngredients();
	}, [onInitIngredients]);

	const updatePurchaseState = (ingredients) => {
		const sum = Object.keys(ingredients)
			.map((igKey) => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		return sum > 0;
	};

	const purchaseHandler = () => {
		if (props.isAuth) {
			setPurchasing(true);
		} else {
			props.onSetAuthRedirectPath("/checkout");
			props.history.push("/auth");
		}
	};
	const purchaseCancelHandler = () => {
		setPurchasing(false);
	};
	const purchaseCancelClicked = () => {
		alert("Cancelled");
	};
	const purchaseContinueClicked = () => {
		props.onInitPurchase();
		props.history.push("/checkout");
	};

	const disabledInfo = {
		...props.ing,
	};
	for (let info in disabledInfo) {
		disabledInfo[info] = disabledInfo[info] <= 0;
	}
	let orderSummary = null;

	let burger = props.error ? (
		<p>Ingredients cant be loaded</p>
	) : (
		<Spinner />
	);
	if (props.ing) {
		burger = (
			<Aux>
				<Burger ingredients={props.ing} />
				<BuildControls
					addIngredient={props.onAddedIngredients}
					removeIngredient={props.onRemoveIngredients}
					isAuth={props.isAuth}
					disabled={disabledInfo}
					price={props.totalPrice}
					purchaseable={updatePurchaseState(props.ing)}
					ordered={purchaseHandler}
				/>
			</Aux>
		);
		orderSummary = (
			<OrderSummary
				ingredients={props.ing}
				cancelClicked={purchaseCancelClicked}
				continueClicked={purchaseContinueClicked}
				price={props.totalPrice}
			/>
		);
	}
	return (
		<Aux>
			<Modal show={purchasing} modalClosed={purchaseCancelHandler}>
				{orderSummary}
			</Modal>
			{burger}
		</Aux>
	);
};

const mapStateToProps = (state) => {
	return {
		ing: state.burgerBuilder.ingredients,
		totalPrice: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuth: state.auth.token !== null,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAddedIngredients: (ingName) =>
			dispatch(burgerBuilderActions.addIngredient(ingName)),
		onRemoveIngredients: (ingName) =>
			dispatch(burgerBuilderActions.removeIngredient(ingName)),
		onInitIngredients: () =>
			dispatch(burgerBuilderActions.initIngredients()),
		onInitPurchase: () => dispatch(burgerBuilderActions.purchaseInit()),
		onSetAuthRedirectPath: (path) =>
			dispatch(burgerBuilderActions.setAuthRedirectPath(path)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ErrorHandlerModal(BurgerBuilder, axios));

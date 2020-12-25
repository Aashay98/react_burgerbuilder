import React, { useCallback, useEffect, useState } from "react";
import Aux from "../../hoc/Container";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-order";
import Spinner from "../../components/UI/Spinner/Spinner";
import ErrorHandlerModal from "../../hoc/ErrorHandlerModal/ErrorHandlerModal";
import { useDispatch, useSelector } from "react-redux";
import * as burgerBuilderActions from "../../store/actions/index";

export const BurgerBuilder = (props) => {
	const [purchasing, setPurchasing] = useState(false);

	const dispatch = useDispatch();
	const ing = useSelector((state) => {
		return state.burgerBuilder.ingredients;
	});
	const totalPrice = useSelector((state) => {
		return state.burgerBuilder.totalPrice;
	});
	const error = useSelector((state) => {
		return state.burgerBuilder.error;
	});
	const isAuth = useSelector((state) => {
		return state.auth.token !== null;
	});

	const onAddedIngredients = (ingName) =>
		dispatch(burgerBuilderActions.addIngredient(ingName));
	const onRemoveIngredients = (ingName) =>
		dispatch(burgerBuilderActions.removeIngredient(ingName));
	const onInitIngredients = () =>
		useCallback(
			() => dispatch(burgerBuilderActions.initIngredients()),
			[dispatch],
		);
	const onInitPurchase = () =>
		dispatch(burgerBuilderActions.purchaseInit());
	const onSetAuthRedirectPath = (path) =>
		dispatch(burgerBuilderActions.setAuthRedirectPath(path));

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
		if (isAuth) {
			setPurchasing(true);
		} else {
			onSetAuthRedirectPath("/checkout");
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
		onInitPurchase();
		props.history.push("/checkout");
	};

	const disabledInfo = {
		...ing,
	};
	for (let info in disabledInfo) {
		disabledInfo[info] = disabledInfo[info] <= 0;
	}
	let orderSummary = null;

	let burger = error ? <p>Ingredients cant be loaded</p> : <Spinner />;
	if (ing) {
		burger = (
			<Aux>
				<Burger ingredients={ing} />
				<BuildControls
					addIngredient={onAddedIngredients}
					removeIngredient={onRemoveIngredients}
					isAuth={isAuth}
					disabled={disabledInfo}
					price={totalPrice}
					purchaseable={updatePurchaseState(ing)}
					ordered={purchaseHandler}
				/>
			</Aux>
		);
		orderSummary = (
			<OrderSummary
				ingredients={ing}
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

export default ErrorHandlerModal(BurgerBuilder, axios);

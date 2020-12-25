import React, { Component } from "react";
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

export class BurgerBuilder extends Component {
	state = {
		purchasing: false,
		error: false,
	};
	componentDidMount() {
		this.props.onInitIngredients();
		/*  axios
      .get("https://react-burger-builder-95f67.firebaseio.com/ingredients.json")
      .then((response) => this.setState({ ingredients: response.data }))
      .catch((error) => console.log(error)); */
	}

	updatePurchaseState = (ingredients) => {
		const sum = Object.keys(ingredients)
			.map((igKey) => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		return sum > 0;
	};
	/*addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceAddition;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };*/

	purchaseHandler = () => {
		if (this.props.isAuth) {
			this.setState({ purchasing: true });
		} else {
			this.props.onSetAuthRedirectPath("/checkout");
			this.props.history.push("/auth");
		}
	};
	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};
	purchaseCancelClicked = () => {
		alert("Cancelled");
	};
	purchaseContinueClicked = () => {
		this.props.onInitPurchase();
		this.props.history.push("/checkout");
	};

	render() {
		const disabledInfo = {
			...this.props.ing,
		};
		for (let info in disabledInfo) {
			disabledInfo[info] = disabledInfo[info] <= 0;
		}
		let orderSummary = null;

		let burger = this.props.error ? (
			<p>Ingredients cant be loaded</p>
		) : (
			<Spinner />
		);
		if (this.props.ing) {
			burger = (
				<Aux>
					<Burger ingredients={this.props.ing} />
					<BuildControls
						addIngredient={
							this.props.onAddedIngredients
						}
						removeIngredient={
							this.props.onRemoveIngredients
						}
						isAuth={this.props.isAuth}
						disabled={disabledInfo}
						price={this.props.totalPrice}
						purchaseable={this.updatePurchaseState(
							this.props.ing,
						)}
						ordered={this.purchaseHandler}
					/>
				</Aux>
			);
			orderSummary = (
				<OrderSummary
					ingredients={this.props.ing}
					cancelClicked={this.purchaseCancelClicked}
					continueClicked={this.purchaseContinueClicked}
					price={this.props.totalPrice}
				/>
			);
		}
		return (
			<Aux>
				<Modal
					show={this.state.purchasing}
					modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

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

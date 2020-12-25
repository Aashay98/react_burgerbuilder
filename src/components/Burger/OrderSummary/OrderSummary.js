import React from "react";
import Aux from "../../../hoc/Container";
import Button from "../../UI/Button/Button";

const OrderSummary = (props) => {
	const ingredientsSummary = Object.keys(props.ingredients).map((igKey) => {
		return (
			<li key={igKey}>
				<span style={{ textTransform: "capitalize" }}>
					{igKey}
				</span>
				: {props.ingredients[igKey]}
			</li>
		);
	});
	return (
		<Aux>
			<h3>Your Order</h3>
			<p>A delicious burger with the following ingredients:</p>
			<ul>{ingredientsSummary}</ul>
			<p>
				<strong>Total Price: {props.price.toFixed(2)}</strong>
			</p>
			<p>Continue to checkout?</p>
			<Button btnType="Danger" clicked={props.cancelClicked}>
				Cancel
			</Button>
			<Button btnType="Success" clicked={props.continueClicked}>
				Continue
			</Button>
		</Aux>
	);
};

export default OrderSummary;

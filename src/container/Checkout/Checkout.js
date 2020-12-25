import React, { Component } from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import { Redirect, Route } from "react-router-dom";
import ContactData from "./ContactData/ContactData";
import { connect } from "react-redux";

class Checkout extends Component {
	cancelCheckoutClick = () => {
		this.props.history.goBack();
	};

	continueCheckoutClick = () => {
		this.props.history.replace("/checkout/contact-data");
	};

	render() {
		let summary = <Redirect to="/" />;
		if (this.props.ings) {
			const purchasedRedirect = this.props.purchased ? (
				<Redirect to="/" />
			) : null;

			summary = (
				<div>
					{purchasedRedirect}
					<CheckoutSummary
						ingredients={this.props.ings}
						cancelCheckout={this.cancelCheckoutClick}
						continueCheckout={
							this.continueCheckoutClick
						}
					/>
					<Route
						path={
							this.props.match.path +
							"/contact-data"
						}
						component={ContactData}
					/>
				</div>
			);
		}
		return summary;
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		purchased: state.order.purchased,
	};
};

export default connect(mapStateToProps)(Checkout);

import React, { useEffect } from "react";
import Order from "../../components/Order/Order";
import axios from "../../axios-order";
import ErrorHandlerModal from "../../hoc/ErrorHandlerModal/ErrorHandlerModal";
import * as orderActions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";

export const Orders = (props) => {
	useEffect(() => {
		props.onFetchOrders(props.token, props.userId);
	}, []);

	let order = <Spinner />;
	if (!props.loading) {
		order = props.orders.map((order) => (
			<Order
				key={order.id}
				ingredients={order.ingredients}
				price={order.price}
			/>
		));
	}
	return <div>{order}</div>;
};

const mapStateToProps = (state) => {
	return {
		orders: state.order.orders,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onFetchOrders: (token, userId) =>
			dispatch(orderActions.fetchOrders(token, userId)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ErrorHandlerModal(Orders, axios));

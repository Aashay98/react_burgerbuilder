import axios from "../../axios-order";
import * as actionTypes from "./actionTypes";

export const addIngredient = (payload) => ({
	type: actionTypes.ADD_INGREDIENT,
	ingredientName: payload,
});

export const removeIngredient = (payload) => ({
	type: actionTypes.REMOVE_INGREDIENT,
	ingredientName: payload,
});

export const setIngredients = (ingredients) => {
	return {
		type: actionTypes.SET_INGREDIENTS,
		ingredients: ingredients,
	};
};

export const fetchIngredientsFailed = () => {
	return {
		type: actionTypes.FETCH_INGREDIENTS_FAILED,
	};
};

export const initIngredients = () => {
	return (dispatch) => {
		axios.get(
			"https://react-burger-builder-95f67.firebaseio.com/ingredients.json",
		)
			.then((response) => {
				dispatch(setIngredients(response.data));
			})
			.catch((error) => {
				dispatch(fetchIngredientsFailed());
			});
	};
};

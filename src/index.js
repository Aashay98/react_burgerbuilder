import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { orderReducer } from "./store/reducers/orderReducer";
import burgerBuilderReducer from "./store/reducers/burgerBuilderReducer";
import { authReducer } from "./store/reducers/authReducer";
import { BrowserRouter } from "react-router-dom";

const composeEnhancers =
	process.env.NODE_ENV === "development"
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		: null || compose;

const rootReducer = combineReducers({
	burgerBuilder: burgerBuilderReducer,
	order: orderReducer,
	auth: authReducer,
});
const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(thunk)),
);

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
	document.getElementById("root"),
);
registerServiceWorker();

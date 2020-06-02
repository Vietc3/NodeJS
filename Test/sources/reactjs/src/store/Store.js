import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers/reducer";
import thunk from "redux-thunk";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

const loggerMiddleware = createLogger();
const apply = process.env.REACT_APP_REDUX_LOG === "1" ?  applyMiddleware(thunk, thunkMiddleware, loggerMiddleware) : applyMiddleware(thunk, thunkMiddleware)

var store = createStore(
	reducer,
	apply
);

store.subscribe(() => {
	store.getState();
});

export default store;

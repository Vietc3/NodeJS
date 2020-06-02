import { combineReducers } from "redux";

import homeReducer from "./reducer";
import reducer_user from "./reducer_user";
import reducer_issue_type from "./reducer_issue_type";
import reducer_issue_status from "./reducer_issue_status";
import reducer_priority from "./reducer_priority";

export default combineReducers({
	homeReducer,
	reducer_user,
	reducer_issue_type,
	reducer_issue_status,
	reducer_priority
});

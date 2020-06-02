const initialState = {
	isAuth: null,
	isAdmin:false,
	User: {},
	User_Function: {},
	Project_Function:{},
	Priority: ["Low", "Normal", "High", "Urgent", "Immediate"],
	changeAvatar: 0,
	// url: avatar,
	language: "EN",
	// flag: English
};

export default function(state: any = initialState, action: Function) {
	console.log(action);
	switch (action.type) {
		case 'CHANGE_AUTH':
			return { ...state, isAuth: action.auth }
			case 'CHANGE_ISADMIN':
			return { ...state, isAdmin: action.isAdmin }
		case 'CHANGE_USER_INFOR':
			return { ...state, User: action.user }
		case 'SET_USER_FUNCTION':
			return {...state, User_Function: action.User_Function}
			case 'SET_PROJECT_FUNCTION':
			return {...state, Project_Function: action.Project_Function}
		case 'GETURL':
			return { ...state, url: action.url };

		case 'GETLANGUAGE':
			return { ...state, language: action.language };
		case 'GETFLAG':
			return { ...state, flag: action.flag };
		case 'SAVE_EMAIL':
			return {...state, email: action.payload};

		default: return state;
	}
	return state;
}

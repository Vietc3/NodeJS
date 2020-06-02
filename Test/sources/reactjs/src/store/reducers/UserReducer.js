

const INITIAL_STATE = { 
	currentUser: {},
	isAuth: null,
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
			case 'UPDATE_USER_INFO':
				return {
					...state,
					currentUser: action.currentUser,
					isAuth: action.currentUser.user !== undefined
				}
			case 'UPDATE_PERMISSION':
				return {
					...state,
					currentUser: { ...state.currentUser, permissions: action.permissions },
				}
			default:
					return state;
    }
}

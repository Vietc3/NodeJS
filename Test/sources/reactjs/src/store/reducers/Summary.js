const INITIAL_STATE = {
	isLoading: false
};

export default function(state = INITIAL_STATE, action) {
	switch (action.type) {
		case 'GET_DATA':
			return {
				...state, 
				[action.name]: action.payload
			}
			
		case 'UPDATE_LOADING':
			return {
				...state,
				isLoading: action.payload
			}
		default:
			return state;
	}
}

const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_SEARCH_FILTER":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          ...action.filter
        }
      };

    default:
      return state;
  }
}
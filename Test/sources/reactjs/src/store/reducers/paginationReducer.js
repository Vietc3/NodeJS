const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_PAGINATION":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          ...action.pageStatus
        }
      };

    default:
      return state;
  }
}

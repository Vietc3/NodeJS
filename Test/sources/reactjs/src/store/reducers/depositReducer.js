const INITIAL_STATE = {
  deposits: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_DEPOSIT_LIST":
      return {
        ...state,
        deposits: action.deposits,
      };

    default:
      return state;
  }
}

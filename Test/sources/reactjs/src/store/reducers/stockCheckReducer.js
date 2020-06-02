const INITIAL_STATE = {
  stockChecks: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_STOCK_CHECK":
      return {
        ...state,
        stockChecks: action.stockChecks,
      };

    default:
      return state;
  }
}
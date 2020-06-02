import Constants from 'variables/Constants/'

const INITIAL_STATE = {
  stockList: {},
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_STOCK_LIST":
      return {
        ...state,
        stockList: action.stockList,
      };

    default:
      return state;
  }
}

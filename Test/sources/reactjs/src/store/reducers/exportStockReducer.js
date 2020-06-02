const INITIAL_STATE = {
  exportStocks: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_EXPORT_STOCK_LIST":
      return {
        ...state,
        exportStocks: action.exportStocks,
      };

    default:
      return state;
  }
}
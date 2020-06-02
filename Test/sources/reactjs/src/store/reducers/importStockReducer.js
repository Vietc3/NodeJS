const INITIAL_STATE = {
    importStocks: {},
  };
  
  export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
      case "CHANGE_IMPORT_STOCK_LIST":
        return {
          ...state,
          importStocks: action.importStocks,
        };
  
      default:
        return state;
    }
  }
const INITIAL_STATE = {
  saleOrders: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_SALE_ORDER":
      return {
        ...state,
        saleOrders: action.saleOrders,
      };

    default:
      return state;
  }
}
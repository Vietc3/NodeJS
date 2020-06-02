const INITIAL_STATE = {
  importOrders: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_IMPORT_ORDER":
      return {
        ...state,
        importOrders: action.importOrders,
      };

    default:
      return state;
  }
}
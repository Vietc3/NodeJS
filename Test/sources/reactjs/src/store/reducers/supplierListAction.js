const INITIAL_STATE = {
  suppliers: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_SUPPLIER_LIST":
      return {
        ...state,
        suppliers: action.suppliers,
      };

    default:
      return state;
  }
}

const INITIAL_STATE = {
  invoices: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_INVOICE":
      return {
        ...state,
        invoices: action.invoices,
      };

    default:
      return state;
  }
}
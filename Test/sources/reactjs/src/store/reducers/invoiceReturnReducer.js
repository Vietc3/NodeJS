const INITIAL_STATE = {
  invoiceReturns: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_INVOICE_RETURN":
      return {
        ...state,
        invoiceReturns: action.invoiceReturns,
      };

    default:
      return state;
  }
}
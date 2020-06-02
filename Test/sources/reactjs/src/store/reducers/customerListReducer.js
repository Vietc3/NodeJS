const INITIAL_STATE = {
  customers: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_CUSTOMER_LIST":
      return {
        ...state,
        customers: action.customers,
      };

    default:
      return state;
  }
}

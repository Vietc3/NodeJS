const INITIAL_STATE = {
  incomeExpenseTypes: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_INCOME_EXPENSE_TYPE":
      return {
        ...state,
        incomeExpenseTypes: action.incomeExpenseTypes,
      };

    default:
      return state;
  }
}
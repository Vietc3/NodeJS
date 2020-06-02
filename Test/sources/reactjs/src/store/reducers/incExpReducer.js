const INITIAL_STATE = {
  incomeExpenses: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_INCOME_EXPENSE":
      return {
        ...state,
        incomeExpenses: action.incomeExpenses,
      };

    default:
      return state;
  }
}
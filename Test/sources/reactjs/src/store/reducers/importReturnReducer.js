const INITIAL_STATE = {
  importReturns: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_IMPORT_RETURN":
      return {
        ...state,
        importReturns: action.importReturns,
      };

    default:
      return state;
  }
}
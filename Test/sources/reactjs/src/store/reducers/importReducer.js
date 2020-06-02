const INITIAL_STATE = {
  imports: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_IMPORT":
      return {
        ...state,
        imports: action.imports,
      };

    default:
      return state;
  }
}
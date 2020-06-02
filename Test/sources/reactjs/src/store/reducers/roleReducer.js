const INITIAL_STATE = {
  roles: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_ROLE_LIST":
      return {
        ...state,
        roles: action.roles,
      };

    default:
      return state;
  }
}
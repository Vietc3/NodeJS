import Constants from 'variables/Constants/'

const INITIAL_STATE = {
  language: Constants.DEFAULT_LANGUAGE
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_LANGUAGE":
      localStorage.setItem("language", action.language)
      return {
        ...state,
        language: action.language,
      };

    default:
      return state;
  }
}

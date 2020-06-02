import {
  VALIDATE_EMAIL,
  VALIDATE_EMAIL_SUCCESS,
  VALIDATE_EMAIL_FAILURE,
  ME_FROM_TOKEN,
  ME_FROM_TOKEN_SUCCESS,
  ME_FROM_TOKEN_FAILURE,
  RESET_TOKEN,
  SIGNUP_USER,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAILURE,
  RESET_USER,
  SIGNIN_USER,
  SIGNIN_USER_SUCCESS,
  SIGNIN_USER_FAILURE,
  LOGOUT_USER,
  UPDATE_USER_EMAIL,
} from "../actions/user";

const INITIAL_STATE = {user: null, status: null, error: null, loading: false};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    case VALIDATE_EMAIL:
      return {
        ...state,
        user: null,
        status: "validate_email",
        error: null,
        loading: true,
      };
    case VALIDATE_EMAIL_SUCCESS:
      return {
        ...state,
        user: action.payload.data.user,
        status: "authenticated",
        error: null,
        loading: false,
      };
    case VALIDATE_EMAIL_FAILURE:
      error = action.payload.data || {message: action.payload.message};
      return {
        ...state,
        user: null,
        status: "validate_email",
        error: error,
        loading: false,
      };

    case ME_FROM_TOKEN:
      return {
        ...state,
        user: null,
        status: "storage",
        error: null,
        loading: true,
      };
    case ME_FROM_TOKEN_SUCCESS:
      return {
        ...state,
        user: action.payload.data.user,
        status: "authenticated",
        error: null,
        loading: false,
      };
    case ME_FROM_TOKEN_FAILURE:
      error = action.payload.data || {message: action.payload.message};
      return {
        ...state,
        user: null,
        status: "storage",
        error: error,
        loading: false,
      };
    case RESET_TOKEN:
      return {
        ...state,
        user: null,
        status: "storage",
        error: null,
        loading: false,
      };

    case SIGNUP_USER:
      return {
        ...state,
        user: null,
        status: "signup",
        error: null,
        loading: true,
      };
    case SIGNUP_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        status: "authenticated",
        error: null,
        loading: false,
      };
    case SIGNUP_USER_FAILURE:
      error = action.payload.data || {message: action.payload.message};
      return {
        ...state,
        user: null,
        status: "signup",
        error: error,
        loading: false,
      };

    case SIGNIN_USER:
      return {
        ...state,
        user: null,
        status: "signin",
        error: null,
        loading: true,
      };
    case SIGNIN_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        status: "authenticated",
        error: null,
        loading: false,
      };
    case SIGNIN_USER_FAILURE:
      error = action.payload.data || {message: action.payload.message};
      return {
        ...state,
        user: null,
        status: "signin",
        error: error,
        loading: false,
      };

    case UPDATE_USER_EMAIL:
      return {...state, user: {...state.user, email: action.payload.email}};

    case LOGOUT_USER:
      return {
        ...state,
        user: null,
        status: "logout",
        error: null,
        loading: false,
      };

    case RESET_USER:
      return {...state, user: null, status: null, error: null, loading: false};

    default:
      return state;
  }
}

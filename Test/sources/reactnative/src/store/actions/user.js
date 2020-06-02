
import {serverURL} from "server/config/config";
import {signIn} from "api/api";
import Axios from "axios";
import {
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
  VALIDATE_EMAIL,
  VALIDATE_EMAIL_SUCCESS,
  VALIDATE_EMAIL_FAILURE,
  UPDATE_USER_EMAIL,
  LOGOUT_USER
} from "../types/user";

export function validateEmail(validateEmailToken) {
  //check if token from welcome email is valid, if so, update email as verified and login the user from response
  const request = Axios.get(`${serverURL}/validateEmail/${validateEmailToken}`);

  return {
    type: VALIDATE_EMAIL,
    payload: request,
  };
}

export function validateEmailSuccess(currentUser) {
  return {
    type: VALIDATE_EMAIL_SUCCESS,
    payload: currentUser,
  };
}

export function validateEmailFailure(error) {
  return {
    type: VALIDATE_EMAIL_FAILURE,
    payload: error,
  };
}

export function meFromToken(tokenFromStorage) {
  //check if the token is still valid, if so, get me from the server

  const request = Axios({
    method: "get",
    url: `${serverURL}/me/from/token?token=${tokenFromStorage}`,
    headers: {
      Authorization: `Bearer ${tokenFromStorage}`,
    },
  });

  return {
    type: ME_FROM_TOKEN,
    payload: request,
  };
}

export function meFromTokenSuccess(currentUser) {
  return {
    type: ME_FROM_TOKEN_SUCCESS,
    payload: currentUser,
  };
}

export function meFromTokenFailure(error) {
  return {
    type: ME_FROM_TOKEN_FAILURE,
    payload: error,
  };
}

export function resetToken() {
  //used for logout
  return {
    type: RESET_TOKEN,
  };
}

export function signUpUser(formValues) {
  const request = Axios.post(`${serverURL}/users/signup`, formValues);

  return {
    type: SIGNUP_USER,
    payload: request,
  };
}

export function signUpUserSuccess(user) {
  return {
    type: SIGNUP_USER_SUCCESS,
    payload: user,
  };
}

export function signUpUserFailure(error) {
  return {
    type: SIGNUP_USER_FAILURE,
    payload: error,
  };
}

export function resetUser() {
  return {
    type: RESET_USER,
  };
}

export function signInUser(formValues) {
  console.log(serverURL);
  const request = signIn(formValues);
  console.log(request);
  return {
    type: SIGNIN_USER,
    payload: request,
  };
}

export function signInUserSuccess(user) {
  return {
    type: SIGNIN_USER_SUCCESS,
    payload: user,
  };
}

export function signInUserFailure(error) {
  return {
    type: SIGNIN_USER_FAILURE,
    payload: error,
  };
}

export function logoutUser() {
  return {
    type: LOGOUT_USER,
  };
}
export function updateUserEmail(email) {
  return {
    type: UPDATE_USER_EMAIL,
    payload: email,
  };
}
export function saveEmail(email) {
  return {
    type: "SAVE_EMAIL",
    payload: email,
  };
}

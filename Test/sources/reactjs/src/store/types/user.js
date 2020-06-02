/*!

* Coded by Pham Tri

*/
// User list
export const FETCH_USERS = "FETCH_USERS";
export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
export const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";
export const RESET_USERS = "RESET_USER";
//Get current user(me) from token in localStorage
export const ME_FROM_TOKEN = "ME_FROM_TOKEN";
export const ME_FROM_TOKEN_SUCCESS = "ME_FROM_TOKEN_SUCCESS";
export const ME_FROM_TOKEN_FAILURE = "ME_FROM_TOKEN_FAILURE";
export const RESET_TOKEN = "RESET_TOKEN";

//Sign Up User
export const SIGNUP_USER = "SIGNUP_USER";
export const SIGNUP_USER_SUCCESS = "SIGNUP_USER_SUCCESS";
export const SIGNUP_USER_FAILURE = "SIGNUP_USER_FAILURE";
export const RESET_USER = "RESET_USER";

//Sign In User
export const SIGNIN_USER = "SIGNIN_USER";
export const SIGNIN_USER_SUCCESS = "SIGNIN_USER_SUCCESS";
export const SIGNIN_USER_FAILURE = "SIGNIN_USER_FAILURE";

//validate email, if success, then load user and login
export const VALIDATE_EMAIL = "VALIDATE_EMAIL";
export const VALIDATE_EMAIL_SUCCESS = "VALIDATE_EMAIL_SUCCESS";
export const VALIDATE_EMAIL_FAILURE = "VALIDATE_EMAIL_FAILURE";


//Sign Up User
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILURE = "UPDATE_PROFILE_FAILURE";

// User update
export const UPDATE_USER_MODAL = "UPDATE_USER_MODAL";
export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";
export const RESET_UPDATE_USER = "RESET_UPDATE_USER";

//called when email is updated in profile to update main user's email state
export const UPDATE_USER_EMAIL = "UPDATE_USER_EMAIL";

//log out user
export const LOGOUT_USER = "LOGOUT_USER";

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
    UPDATE_PROFILE,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    FETCH_USERS,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    UPDATE_USER_MODAL,
    UPDATE_USER,
    UPDATE_USER_SUCCESS,  
    UPDATE_USER_FAILURE,
    RESET_UPDATE_USER
} from "../types/user";

//user = userobj,
// status can be:
// 1. 'storage' ie. localstorage / sessionstorage)
// 2. 'signup' (signing up)
// 3. 'signin' (signing in)
// 4. 'validate'(validate fields)
// 5. 'validate_email' (validating email token)
// 5. 'authenticated'(after signin)
// 6. 'logout' (after logout)

const INITIAL_STATE = { 
    listUsers: { Users: [], error: null, loading: true},
    createUser: {
        User: null,
        error: null,
        success: null,
        type: null,
        loading: false,
        show: false
    },
    user: null, status: null, error: null, loading: false };

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {
    case FETCH_USERS:
        return {
            ...state,
            listUsers: { Users: [], error: null, loading: true }
        };
    case FETCH_USERS_SUCCESS:
        return {
            ...state,
            listUsers: {
                Users: action.payload,
                error: null,
                loading: false
            }
        };
    case FETCH_USERS_FAILURE:
        error = action.payload || { message: action.payload.message };
        return {
            ...state,
            listUsers: { Users: [], error: error, loading: false }
        };
    case VALIDATE_EMAIL: //check email verification token
        return {
            ...state,
            user: null,
            status: "validate_email",
            error: null,
            loading: true
        };
    case VALIDATE_EMAIL_SUCCESS:
        return {
            ...state,
            user: action.payload.data.user,
            status: "authenticated",
            error: null,
            loading: false
        }; //<-- authenticated & email verified
    case VALIDATE_EMAIL_FAILURE:
        error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
        return {
            ...state,
            user: null,
            status: "validate_email",
            error: error,
            loading: false
        }; //<-- authenticated

    case ME_FROM_TOKEN: // loading currentUser("me") from jwttoken in local/session storage storage,
        return {
            ...state,
            user: null,
            status: "storage",
            error: null,
            loading: true
        };
    case ME_FROM_TOKEN_SUCCESS: //return user, status = authenticated and make loading = false
        return {
            ...state,
            user: action.payload.data.user,
            status: "authenticated",
            error: null,
            loading: false
        }; //<-- authenticated
    case ME_FROM_TOKEN_FAILURE: // return error and make loading = false
        error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
        return {
            ...state,
            user: null,
            status: "storage",
            error: error,
            loading: false
        };
    case RESET_TOKEN: // remove token from storage make loading = false
        return {
            ...state,
            user: null,
            status: "storage",
            error: null,
            loading: false
        };

    case SIGNUP_USER: // sign up user, set loading = true and status = signup
        return {
            ...state,
            user: null,
            status: "signup",
            error: null,
            loading: true
        };
    case SIGNUP_USER_SUCCESS: //return user, status = authenticated and make loading = false
        return {
            ...state,
            user: action.payload.user,
            status: "authenticated",
            error: null,
            loading: false
        }; //<-- authenticated
    case SIGNUP_USER_FAILURE: // return error and make loading = false
        error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
        return {
            ...state,
            user: null,
            status: "signup",
            error: error,
            loading: false
        };

    case SIGNIN_USER: // sign in user,  set loading = true and status = signin
        return {
            ...state,
            user: null,
            status: "signin",
            error: null,
            loading: true
        };
    case SIGNIN_USER_SUCCESS: //return authenticated user,  make loading = false and status = authenticated
        return {
            ...state,
            user: action.data,
            status: "authenticated",
            error: null,
            loading: false
        }; //<-- authenticated
    case SIGNIN_USER_FAILURE: // return error and make loading = false
        error = action.payload || { message: action.payload }; //2nd one is network or server down errors
        return {
            ...state,
            user: null,
            status: "signin",
            error: error,
            loading: false
        };
    case UPDATE_PROFILE: // sign up user, set loading = true and status = signup
        return {
            ...state,
            user: null,
            status: "update_profile",
            error: null,
            loading: true
        };
    case UPDATE_PROFILE_SUCCESS: //return user, status = authenticated and make loading = false
        return {
            ...state,
            user: action.payload.user,
            status: "update_profile_success",
            error: null,
            loading: false
        };
    case UPDATE_PROFILE_FAILURE: // return error and make loading = false
        error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
        return {
            ...state,
            user: null,
            status: "update_profile_failure",
            error: error,
            loading: false
        };
    case UPDATE_USER_EMAIL:
        return { ...state, user: { ...state.user, email: action.payload.email } };

    case LOGOUT_USER:
        return {
            ...state,
            user: null,
            status: "logout",
            error: null,
            loading: false
        };

    case UPDATE_USER_MODAL:
        return {
            ...state,
            createUser: {
                User: action.payload,
                type: action.title,
                error: null,
                success: null,
                loading: true,
                show: true
            }
        };
    case UPDATE_USER:
        return {
            ...state,
            createUser: {
                User: action.payload,
                type: action.title,
                error: null,
                success: null,
                loading: true,
                show: action.show
            }
        };
    case UPDATE_USER_SUCCESS:
        return {
            ...state,
            createUser: {
                User: {},
                type: null,
                success: true,
                error: null,
                loading: false,
                show: false
            }
        };
    case UPDATE_USER_FAILURE:
        error = action.payload || { message: action.payload };
        return {
            ...state,
            createUser: {
                User: {},
                type: null,
                error: error,
                success: false,
                loading: false,
                show: true
            }
        };
    case RESET_UPDATE_USER:
        return {
            ...state,
            createUser: {
                User: {},
                error: null,
                success: null,
                type: null,
                loading: false,
                show: false
            }
        };
    case RESET_USER: // reset authenticated user to initial state
        return {
            ...state,
            user: null,
            status: null,
            error: null,
            loading: false
        };

    default:
        return state;
    }
}

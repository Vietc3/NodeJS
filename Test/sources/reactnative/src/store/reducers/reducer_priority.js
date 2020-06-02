import {
    FETCH_PRIORITIES,
    FETCH_PRIORITIES_SUCCESS,
    FETCH_PRIORITIES_FAILURE,
    UPDATE_PRIORITY,
    UPDATE_PRIORITY_SUCCESS,
    UPDATE_PRIORITY_FAILURE,
    UPDATE_PRIORITY_MODAL,
    DELETE_PRIORITY
  } from "../types/priority";

const INITIAL_STATE = {
                        listPriorities: {Priorities: [], error:null, loading: true},
                        updatePriority:{post:null, error: null, loading: false, show: false},
                        deletePriority: {key: null, error:null, loading: true},
                      };

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {
      case FETCH_PRIORITIES:
        return { ...state, listPriorities: {Priorities: [], error:null, loading: true} };
      case FETCH_PRIORITIES_SUCCESS:
        return { ...state, listPriorities: {Priorities: action.payload, error:null, loading: false} };
      case FETCH_PRIORITIES_FAILURE:
        error = action.payload || {message: action.payload.message};
        return { ...state, listPriorities: {Priorities: [], error:error, loading: false} };
      case UPDATE_PRIORITY_MODAL:
        return { ...state, updatePriority: {Priority: [], error:null, loading: true, show: action.status} };
      case UPDATE_PRIORITY:
        return { ...state, updatePriority: {Priority: [], error:null, loading: true, show: false} };
      case UPDATE_PRIORITY_SUCCESS:
        return { ...state, updatePriority: {Priority: action.payload, error:null, loading: false, show: true} };
      case UPDATE_PRIORITY_FAILURE:
        error = action.payload || {message: action.payload.message};
        return { ...state, updatePriority: {Priority: [], error:error, loading: false, show: false} };
      case DELETE_PRIORITY:
        return { ...state, deletePriority: {key: [], error:null, loading: true} };
      default:
        return state;
    }
  }

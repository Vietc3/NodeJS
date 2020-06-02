import {
    FETCH_ISSUE_TYPES,
    FETCH_ISSUE_TYPES_SUCCESS,
    FETCH_ISSUE_TYPES_FAILURE,
    UPDATE_ISSUE_TYPE,
    UPDATE_ISSUE_TYPE_SUCCESS,
    UPDATE_ISSUE_TYPE_FAILURE,
    UPDATE_ISSUE_TYPE_MODAL,
    DELETE_ISSUE_TYPE
  } from "../types/issue_type";

const INITIAL_STATE = {
                        listIssueTypes: {issuetypes: [], error:null, loading: true},
                        updateIssueType:{post:null, error: null, loading: false, show: false},
                        deleteIssuetype: {key: null, error:null, loading: true},
                      };

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {
      case FETCH_ISSUE_TYPES:
        return { ...state, listIssueTypes: {issuetypes: [], error:null, loading: true} };
      case FETCH_ISSUE_TYPES_SUCCESS:
        return { ...state, listIssueTypes: {issuetypes: action.payload, error:null, loading: false} };
      case FETCH_ISSUE_TYPES_FAILURE:
        error = action.payload || {message: action.payload.message};
        return { ...state, listIssueTypes: {issuetypes: [], error:error, loading: false} };
      case UPDATE_ISSUE_TYPE_MODAL:
        return { ...state, updateIssueType: {issuetype: [], error:null, loading: true, show: action.status} };
      case UPDATE_ISSUE_TYPE:
        return { ...state, updateIssueType: {issuetype: [], error:null, loading: true, show: false} };
      case UPDATE_ISSUE_TYPE_SUCCESS:
        return { ...state, updateIssueType: {issuetype: action.payload, error:null, loading: false, show: true} };
      case UPDATE_ISSUE_TYPE_FAILURE:
        error = action.payload || {message: action.payload.message};
        return { ...state, updateIssueType: {issuetype: [], error:error, loading: false, show: false} };
      case DELETE_ISSUE_TYPE:
        return { ...state, deleteIssuetype: {key: [], error:null, loading: true} };
      default:
        return state;
    }
  }

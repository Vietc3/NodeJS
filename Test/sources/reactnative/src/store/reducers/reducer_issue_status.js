import {
    FETCH_ISSUE_STATUSES,
    FETCH_ISSUE_STATUSES_SUCCESS,
    FETCH_ISSUE_STATUSES_FAILURE,
    UPDATE_ISSUE_STATUS,
    UPDATE_ISSUE_STATUS_SUCCESS,
    UPDATE_ISSUE_STATUS_FAILURE,
    UPDATE_ISSUE_STATUS_MODAL,
    DELETE_ISSUE_STATUS
  } from "../types/issue_status";

const INITIAL_STATE = {
                        listIssueStatuses: {issueStatuses: [], error:null, loading: true},
                        updateIssueStatus:{post:null, error: null, loading: false, show: false},
                        deleteIssueStatus: {key: null, error:null, loading: true},
                      };

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {
      case FETCH_ISSUE_STATUSES:
        return { ...state, listIssueStatuses: {issueStatuses: [], error:null, loading: true} };
      case FETCH_ISSUE_STATUSES_SUCCESS:
        return { ...state, listIssueStatuses: {issueStatuses: action.payload, error:null, loading: false} };
      case FETCH_ISSUE_STATUSES_FAILURE:
        error = action.payload || {message: action.payload.message};
        return { ...state, listIssueStatuses: {issueStatuses: [], error:error, loading: false} };
      case UPDATE_ISSUE_STATUS_MODAL:
        return { ...state, updateIssueStatus: {issueStatus: [], error:null, loading: true, show: action.status} };
      case UPDATE_ISSUE_STATUS:
        return { ...state, updateIssueStatus: {issueStatus: [], error:null, loading: true, show: false} };
      case UPDATE_ISSUE_STATUS_SUCCESS:
        return { ...state, updateIssueStatus: {issueStatus: action.payload, error:null, loading: false, show: true} };
      case UPDATE_ISSUE_STATUS_FAILURE:
        error = action.payload || {message: action.payload.message};
        return { ...state, updateIssueStatus: {issueStatus: [], error:error, loading: false, show: false} };
      case DELETE_ISSUE_STATUS:
        return { ...state, deleteIssueStatus: {key: [], error:null, loading: true} };
      default:
        return state;
    }
  }

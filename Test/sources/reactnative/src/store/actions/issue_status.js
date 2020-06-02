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
import {getData} from "../../api/api";
import {serverURL} from "server/config/config";
import axios from "axios";
import openSocket from "socket.io-client";

const socket = openSocket(serverURL);
export function fetchIssueStatuses(data) {
  return async function (dispatch) {
    dispatch({ type: FETCH_ISSUE_STATUSES });
    const request = axios.post(serverURL + "/getData", data);
    try {
      const response = await request;
      return dispatch(fetchIssueStatusesSuccess(response.data));
    }
    catch (err) {
      return dispatch(fetchIssueStatusesFailure(err));
    }
  };
}

export function fetchIssueStatusesSuccess(IssueStatuses) {
    return {
      type: FETCH_ISSUE_STATUSES_SUCCESS,
      payload: IssueStatuses
    };
}

export function fetchIssueStatusesFailure(IssueStatuses) {
    return {
      type: FETCH_ISSUE_STATUSES_FAILURE,
      payload: IssueStatuses
    };
}

export function showModalUpdateIssueStatus(status) {
  return {
    type: UPDATE_ISSUE_STATUS_MODAL,
    status: status
  };
}

export function updateIssueStatus(data) {
  var requestObject = {};
  if (data.Key !== undefined)
  {
    requestObject = {
      uid: data.Key
    };
    delete data.Key;
  }
  requestObject = {
    ...requestObject,
    data: data,
    ref: "IssueStatus",
  };
  return async function (dispatch) {
    dispatch({ type: UPDATE_ISSUE_STATUS });
    const request = socket.emit("update", requestObject);
    try {
      const response = await request;
      console.log(response);
      return "success";
      // return dispatch(updateIssueStatusSuccess(response.data));
    }
    catch (err) {
      // return dispatch(updateIssueStatusFailure(err));
    }
  };
}

export function updateIssueStatusSuccess(data) {
  return {
    type: UPDATE_ISSUE_STATUS_SUCCESS,
    payload: data
  };
}

export function updateIssueStatusFailure(data) {
  return {
    type: UPDATE_ISSUE_STATUS_FAILURE,
    payload: data
  };
}

export function deleteIssueStatus(key) {
  var requestObject = {
    uid: key,
    ref: "IssueStatus",
  };
  return async function (dispatch) {
    dispatch({ type: DELETE_ISSUE_STATUS });
    const request = socket.emit("delete", requestObject);
    try {
      const response = await request;
      return response;
      // return dispatch(updateIssueStatusSuccess(response.data));
    }
    catch (err) {
      // return dispatch(updateIssueStatusFailure(err));
    }
  };
}

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
import {getData} from "../../api/api";
import {serverURL} from "server/config/config";
import axios from "axios";
import openSocket from "socket.io-client";

const socket = openSocket(serverURL);
export function fetchIssueTypes(data) {
  return async function (dispatch) {
    dispatch({ type: FETCH_ISSUE_TYPES });
    const request = axios.post(serverURL + "/getData", data);
    try {
      const response = await request;
      return dispatch(fetchIssueTypesSuccess(response.data));
    }
    catch (err) {
      return dispatch(fetchIssueTypesFailure(err));
    }
  };
}

export function fetchIssueTypesSuccess(IssueTypes) {
    return {
      type: FETCH_ISSUE_TYPES_SUCCESS,
      payload: IssueTypes
    };
}

export function fetchIssueTypesFailure(IssueTypes) {
    return {
      type: FETCH_ISSUE_TYPES_FAILURE,
      payload: IssueTypes
    };
}

export function showModalUpdateIssueType(status) {
  return {
    type: UPDATE_ISSUE_TYPE_MODAL,
    status: status
  };
}

export function updateIssueType(data) {
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
    ref: "IssueType",
  };
  return async function (dispatch) {
    dispatch({ type: UPDATE_ISSUE_TYPE });
    const request = socket.emit("update", requestObject);
    try {
      const response = await request;
      console.log(response);
      return "success";
      // return dispatch(updateIssueTypeSuccess(response.data));
    }
    catch (err) {
      // return dispatch(updateIssueTypeFailure(err));
    }
  };
}

export function updateIssueTypeSuccess(data) {
  return {
    type: UPDATE_ISSUE_TYPE_SUCCESS,
    payload: data
  };
}

export function updateIssueTypeFailure(data) {
  return {
    type: UPDATE_ISSUE_TYPE_FAILURE,
    payload: data
  };
}

export function deleteIssueType(key) {
  var requestObject = {
    uid: key,
    ref: "IssueType",
  };
  return async function (dispatch) {
    dispatch({ type: DELETE_ISSUE_TYPE });
    const request = socket.emit("delete", requestObject);
    try {
      const response = await request;
      return response;
      // return dispatch(updateIssueTypeSuccess(response.data));
    }
    catch (err) {
      // return dispatch(updateIssueTypeFailure(err));
    }
  };
}

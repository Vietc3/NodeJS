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
import {getData} from "../../api/api";
import {serverURL} from "server/config/config";
import axios from "axios";
import openSocket from "socket.io-client";

const socket = openSocket(serverURL);
export function fetchPriorities(data) {
  return async function (dispatch) {
    dispatch({ type: FETCH_PRIORITIES });
    const request = axios.post(serverURL + "/getData", data);
    try {
      const response = await request;
      return dispatch(fetchPrioritiesSuccess(response.data));
    }
    catch (err) {
      return dispatch(fetchPrioritiesFailure(err));
    }
  };
}

export function fetchPrioritiesSuccess(Priorities) {
    return {
      type: FETCH_PRIORITIES_SUCCESS,
      payload: Priorities
    };
}

export function fetchPrioritiesFailure(Priorities) {
    return {
      type: FETCH_PRIORITIES_FAILURE,
      payload: Priorities
    };
}

export function showModalUpdatePriority(status) {
  return {
    type: UPDATE_PRIORITY_MODAL,
    status: status
  };
}

export function updatePriority(data) {
  var requestObject = {
    uid: data.Key,
    data: data.Value,
    ref: "Priority",
  };
  return async function (dispatch) {
    dispatch({ type: UPDATE_PRIORITY });
    const request = socket.emit("update", requestObject);
    try {
      const response = await request;
      console.log(response);
      return "success";
      // return dispatch(updatePrioritySuccess(response.data));
    }
    catch (err) {
      // return dispatch(updatePriorityFailure(err));
    }
  };
}

export function updatePrioritySuccess(data) {
  return {
    type: UPDATE_PRIORITY_SUCCESS,
    payload: data
  };
}

export function updatePriorityFailure(data) {
  return {
    type: UPDATE_PRIORITY_FAILURE,
    payload: data
  };
}

export function deletePriority(key) {
  var requestObject = {
    uid: key,
    ref: "Priority",
  };
  return async function (dispatch) {
    dispatch({ type: DELETE_PRIORITY });
    const request = socket.emit("delete", requestObject);
    try {
      const response = await request;
      return response;
      // return dispatch(updatePrioritySuccess(response.data));
    }
    catch (err) {
      // return dispatch(updatePriorityFailure(err));
    }
  };
}

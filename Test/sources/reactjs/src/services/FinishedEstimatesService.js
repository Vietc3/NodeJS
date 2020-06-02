import http from "./HttpService";

const apiEndpoint = "/finished-estimates-report";


export function getFinishedEstimatesDate(datafilter) {
  return http.post(`${apiEndpoint}/`, datafilter);
}

export function getExpandFinishedEstimatesDate(datafilter) {
  return http.post(`${apiEndpoint}/get`, datafilter);
}

export default {
  getFinishedEstimatesDate,
  getExpandFinishedEstimatesDate
};
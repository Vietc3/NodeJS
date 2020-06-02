import http from "./HttpService";

const apiEndpoint = "/get-import-export-report";

export function getStoreReportData(datafilter) {
  return http.post(`${apiEndpoint}/`, datafilter);
}

export default {
  getStoreReportData
};
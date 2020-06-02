import http from "./HttpService";

const apiEndpoint = "/low-stock-report";

export function getQuotaReportData(datafilter) {
  return http.post(`${apiEndpoint}/`, datafilter);
}

export default {
  getQuotaReportData
};
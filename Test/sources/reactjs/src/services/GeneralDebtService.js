import http from "./HttpService";

const apiEndpoint = "/get-general-debt-report";

export function getGeneralDebtReportData(datafilter) {
  return http.post(`${apiEndpoint}/`, datafilter);
}

export default {
  getGeneralDebtReportData
};
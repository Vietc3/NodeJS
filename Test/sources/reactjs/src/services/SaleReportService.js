import http from "./HttpService";

const apiEndpoint = "/get-sale-report";

export function getSaleReportData(datafilter) {
  return http.post(`${apiEndpoint}/`, datafilter);
}

export default {
    getSaleReportData
};

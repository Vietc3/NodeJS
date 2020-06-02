import http from "./HttpService";

const apiEndpoint = "/get-inventory-report";

export function getInventoryReportData(datafilter) {
  return http.post(`${apiEndpoint}/`, datafilter);
}

export default {
    getInventoryReportData
};
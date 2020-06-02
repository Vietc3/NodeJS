import http from "./HttpService";

const apiEndpoint = "/get-dashboard-report";

export function getDashboardData(datafilter) {
  return http.post(`${apiEndpoint}/`, datafilter);
}

export default {
    getDashboardData
};

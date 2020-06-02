import http from "./HttpService";

const apiEndpoint = "/get-debt-report";
export function getDebtReport (filter) {
    return http.post(`${apiEndpoint}`, filter);
}

export default {
    getDebtReport
};

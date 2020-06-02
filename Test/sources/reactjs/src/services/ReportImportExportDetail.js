import http from "./HttpService";

const apiEndpoint = "/import-export-detail";
export function getImportExportDetailReport (filter) {
    return http.post(`${apiEndpoint}`, filter);
}

export default {
    getImportExportDetailReport
};

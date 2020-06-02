import http from "./HttpService";

const apiEndpoint = "/actionlog";

function generateApiUrl(path) {
  return `${apiEndpoint}/${path}`;
}

export function getActionLog(id) {
  return http.get(generateApiUrl(id));
}

export function getActionLogs(datafilter) {
  return http.post(`${apiEndpoint}/list`, datafilter);
}

export default {
  getActionLog,
  getActionLogs
};

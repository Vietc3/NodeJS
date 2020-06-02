import http from "./HttpService";

const apiEndpoint = "/store";

function generateApiUrl(path) {
  return `${apiEndpoint}/${path}`;
}

export function createStore(body) {
  return http.post(`${apiEndpoint}`,body);
}

export default {
  createStore
};

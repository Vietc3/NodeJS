import http from "./HttpService";

const apiEndpoint = "/store-config";

function generateApiUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getConfig(configType) {
  return http.post(`${apiEndpoint}/get`,configType);
}

export function saveConfig(config) {
    return http.put(`${apiEndpoint}/update`,config)
}

export function getPrintTemplate(datafilter) {
  return http.post(`${apiEndpoint}/print-template`, datafilter);
}

export function printTemplate(datafilter) {
  return http.post(`${apiEndpoint}/print`, datafilter);
}

export function getStoreLogo() {
  return http.get(`${apiEndpoint}/logo`);
}

export function getStoreExpired() {
  return http.get(`${apiEndpoint}/expired`);
}

export function saveStore(config) {
  if (config.id) {
      const body = { ...config };
      delete body.id;
      return http.put(generateApiUrl(config.id), body);
  }
  return http.post(apiEndpoint, config);
}


export default {
  getConfig,
  getPrintTemplate,
  getStoreLogo,
  saveConfig,
  printTemplate,
  getStoreExpired
};

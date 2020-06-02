import http from "./HttpService";

const apiEndpoint = "/stocklist";

function generateApiUrl(path) {
  return `${apiEndpoint}/${path}`;
}

export function saveStock(data) {    
  if (data.stockId) {
    const body = { ...data };
    delete body.id;
    return http.put(generateApiUrl(data.id), body);
  }

  return http.post(apiEndpoint, data);
}
export function getStock(stockId) {
  return http.get(generateApiUrl(stockId));
}
export function getStockList(datafilter) {
  return http.post(`${apiEndpoint}/list`, datafilter);
}

export function deleteStock(stockId, moveTo) {
  return http.delete(generateApiUrl(stockId), {
   data: { moveTo }
  });
}

export default {
  saveStock,
  deleteStock,
  getStock,
  getStockList
};

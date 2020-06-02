import http from "./HttpService";

const apiEndpoint = "/stockcheck";

function generateApiUrl(path) {
  return `${apiEndpoint}/${path}`;
}

export function getStockCheckCards (filter) {
  return http.post(`${apiEndpoint}/list`, filter);
}

export function getStockCheckCard (cardId) {
  return http.get(generateApiUrl(cardId));
}

export function saveStockCheckCard(stockCheckCard, stockCheckProducts) {
  if (stockCheckCard.id) {
    return http.put(generateApiUrl(stockCheckCard.id), {stockCheckCard, stockCheckProducts});
  }

  return http.post(apiEndpoint, {stockCheckCard, stockCheckProducts});
}

export function deleteStockCheckCard(productId) {
  return http.delete(generateApiUrl(productId));
}

export function deleteStockCheckBatch(ids) {
  return http.post(`${apiEndpoint}/deleteBatch`, ids);
}

export default {
  getStockCheckCards,
  getStockCheckCard,
  saveStockCheckCard,
  deleteStockCheckCard,
  deleteStockCheckBatch
};

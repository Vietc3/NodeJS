import http from "./HttpService";

const apiEndpoint = "/move_stock_card";

function generateApiUrl(id) {
  return `${apiEndpoint}/${id}`;
}

// get list
export function getMoveStockCardList(filter) {
  return http.post(`${apiEndpoint}/list`, filter);
}

// get one card
export function getMoveStockCard(id) {
  return http.get(generateApiUrl(id));
}

// create or update if has card id
export function saveMoveStockCard(data) {
  if (data.id) {
    const body = { ...data };
    delete body.id;
    return http.put(generateApiUrl(data.id), body);
  }

  return http.post(apiEndpoint, data);
}

export function cancelMoveStockCard(id) {
  return http.post(`${apiEndpoint}/cancel`, {id});
}

export default {
  getMoveStockCardList,
  getMoveStockCard,
  saveMoveStockCard,
  cancelMoveStockCard,
};
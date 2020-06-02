import http from "./HttpService";

const apiEndpoint = "/order-card";

function generateApiUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getOrder(orderId) {
  return http.get(generateApiUrl(orderId));
}
export function getOrders(datafilter) {
  return http.post(`${apiEndpoint}/list`, datafilter);
}

export function saveOrder(order) {
  
  if (order.id) {
    let body = {...order};
    delete body.id;
    return http.put(generateApiUrl(order.id), body);
  }

  return http.post(apiEndpoint, order);
}

export function cancelOrder(orderId) {
  return http.post(generateApiUrl(orderId));
}

export default {
  getOrders,
  getOrder,
  saveOrder,
  cancelOrder
};

import http from "./HttpService";

const apiEndpoint = "/product_types";

function generateApiUrl(path) {
  return `${apiEndpoint}/${path}`;
}

export function getProductTypes(filters) {
  return http.post(`${apiEndpoint}/list`, filters);
}

export function getProductType(productId) {
  return http.get(generateApiUrl(productId));
}

export function saveProductType(product) {
  if (product.id) {
    const body = { ...product };
    delete body.id;
    return http.put(generateApiUrl(product.id), body);
  }

  return http.post(apiEndpoint, product);
}

export function deleteProductType(productId) {
  return http.delete(generateApiUrl(productId));
}

export function deleteProductTypes(arrProductId) {
  return http.post(generateApiUrl("deleteBatch"), { arrId: arrProductId });
}

export default {
  getProductTypes,
  getProductType,
  saveProductType,
  deleteProductType,
  deleteProductTypes
};

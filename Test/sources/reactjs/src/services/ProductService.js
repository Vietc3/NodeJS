import http from "./HttpService";

const apiEndpoint = "/product";

function generateApiUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getProductList(datafilter) {
  return http.post(`${apiEndpoint}/list`, datafilter);
}

export function getProduct(productId) {
  return http.get(generateApiUrl(productId));
}

export function getBranchProducts(productId) {
  return http.get(`${apiEndpoint}/branch/${productId}`);
}

export function saveProduct(product) {
  
  if (product.id) {
    let body = {...product};
    delete body.id;
    return http.put(generateApiUrl(product.id), body);
  }

  return http.post(apiEndpoint, product);
}

export function deleteProduct(productId) {
  return http.delete(generateApiUrl(productId));
}

export function deleteProductBatch(ids) {
  return http.post(`${apiEndpoint}/deleteBatch`, ids);
}

export function stopProduct(productId, isStop) {
  return http.put(generateApiUrl(`stop/${productId}`), isStop);
}

export function stopProductBatch(inputs) {
  return http.post(`${apiEndpoint}/stopBatch`, inputs);
}

export function updateProductBatch(inputs) {
  return http.post(`${apiEndpoint}/updateBatch`, inputs);
}

export function saveImage(arrImg) {
  return http.post(`/file-storage`, arrImg)
}

export function deleteImage(arrImg) {
  return http.post(`/file-storage/delete`, arrImg)
}

export function getProductImages(arrImg) {
  return http.post(`/file-storage/list`, arrImg)
}

export function updateProductPrice(dataCalculatorPrice) {
  return http.post(generateApiUrl('updatePrice'), dataCalculatorPrice)
}

export function getProductFormula(productId) {
  return http.get(generateApiUrl(`formula/${productId}`));
}

export function saveProductFormula(product) {
  if (product.id) {
    const body = { ...product };
    delete body.id;
    return http.put(generateApiUrl(`formula/update/${product.id}`), body);
  }
  return http.post(apiEndpoint, product);
}

export function importProducts(inputs) {
  return http.post(`${apiEndpoint}/import`, inputs);
}

export function convertStockQuantity(inputs) {
  return http.post(`${apiEndpoint}/convertStockQuantity`, inputs);
}

export function getFormulaList(datafilter) {
  return http.post(generateApiUrl(`formula/list`), datafilter);
}

export default {
  getProductList,
  getProduct,
  saveProduct,
  deleteProduct,
  stopProduct,
  deleteProductBatch,
  stopProductBatch,
  updateProductBatch,
  saveImage,
  deleteImage,
  updateProductPrice,
  getProductImages,
  getProductFormula,
  saveProductFormula,
  importProducts,
  convertStockQuantity,
  getBranchProducts,
  getFormulaList
};

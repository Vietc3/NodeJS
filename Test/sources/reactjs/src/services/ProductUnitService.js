import http from "./HttpService";

const apiEndpoint = "/product_unit";

function generateApiUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getProductUnits (filter) {
    return http.post(`${apiEndpoint}/list`,filter);
}

export function getProductUnit(productUnitId) {
    return http.get(generateApiUrl(productUnitId))
}

export function saveProductUnit(productUnit) {
    if (productUnit.id) {
        const body = { ...productUnit };
        delete body.id;
        return http.put(generateApiUrl(productUnit.id), body);
    }
    return http.post(apiEndpoint, productUnit);
}

export function deleteProductUnit(productUnitId) {
    return http.delete(generateApiUrl(productUnitId));
  }

export function deleteProductUnits(arrProductUnitId) {
    return http.post(generateApiUrl("deleteBatch"), { ids: arrProductUnitId });
  }

export default {
    getProductUnit,
    getProductUnits,
    saveProductUnit,
    deleteProductUnit,
    deleteProductUnits
};

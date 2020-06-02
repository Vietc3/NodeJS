import http from "./HttpService";

const apiEndpoint = "/import_return_card";

function generateApiUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getImportReturnList(filter) {
  return http.post(`${apiEndpoint}/list`, filter);
}

export function getImportReturn(ImportReturnId) {
  return http.get(generateApiUrl(ImportReturnId));
}

export function saveImportReturn(ImportReturn) {
  if (ImportReturn.id) {
    const body = { ...ImportReturn };
    delete body.id;
    return http.put(generateApiUrl(ImportReturn.id), body);
  }

  return http.post(apiEndpoint, ImportReturn);
}

export function deleteImportReturn(ImportReturnId) {
  return http.delete(generateApiUrl(ImportReturnId));
}

export function deleteImportReturnBatch(inputs) {
    return http.post(`${apiEndpoint}/deleteBatch`, inputs);
}

export default {
    getImportReturnList,
    getImportReturn,
    saveImportReturn,
    deleteImportReturn,
    deleteImportReturnBatch
};
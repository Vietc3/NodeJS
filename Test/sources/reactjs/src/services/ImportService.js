import http from "./HttpService";

const apiEndpoint = "/import_card";

function generateApiUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getImportList(filter) {
  return http.post(`${apiEndpoint}/list`, filter);
}

export function getImport(ImportId) {
  return http.get(generateApiUrl(ImportId));
}

export function saveImport(Import) {
  if (Import.id) {
    const body = { ...Import };
    delete body.id;
    return http.put(generateApiUrl(Import.id), body);
  }

  return http.post(apiEndpoint, Import);
}

export function deleteImport(ImportId) {
  return http.delete(generateApiUrl(ImportId));
}

export function deleteImportBatch(inputs) {
    return http.post(`${apiEndpoint}/deleteBatch`, inputs);
}

export function cancelImport(ImportId) {
  return http.post(generateApiUrl(ImportId));
}

export default {
    getImportList,
    getImport,
    saveImport,
    deleteImport,
    deleteImportBatch,
    cancelImport
};
import http from "./HttpService";

const apiEndpoint = "/export_card";

function generateApiUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getExportList(filter) {
  return http.post(`${apiEndpoint}/list`, filter);
}

export function getExport(ExportId) {
  return http.get(generateApiUrl(ExportId));
}

export function saveExport(Export) {
  if (Export.id) {
    const body = { ...Export };
    delete body.id;
    return http.put(generateApiUrl(Export.id), body);
  }

  return http.post(apiEndpoint, Export);
}

export function deleteExport(ExportId) {
  return http.delete(generateApiUrl(ExportId));
}

export function deleteExportBatch(inputs) {
  return http.post(`${apiEndpoint}/deleteBatch`, inputs);
}

export default {
  getExportList,
  getExport,
  saveExport,
  deleteExport,
  deleteExportBatch
};
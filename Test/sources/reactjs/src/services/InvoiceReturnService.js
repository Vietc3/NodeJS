import http from "./HttpService";

const apiEndpoint = "/invoice_return";

function generateApiUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getInvoiceReturnList(filter) {
  return http.post(`${apiEndpoint}/list`, filter);
}

export function getInvoiceReturn(invoiceReturnId) {
  return http.get(generateApiUrl(invoiceReturnId));
}

export function saveInvoiceReturn(invoiceReturn) {
  if (invoiceReturn.id) {
    const body = { ...invoiceReturn };
    delete body.id;
    return http.put(generateApiUrl(invoiceReturn.id), body);
  }

  return http.post(apiEndpoint, invoiceReturn);
}

export function deleteInvoiceReturn(invoiceReturnId) {
  return http.delete(generateApiUrl(invoiceReturnId));
}

export function deleteInvoiceReturnBatch(inputs) {
  return http.post(`${apiEndpoint}/deleteBatch`, inputs);
}

export default {
  getInvoiceReturnList,
  getInvoiceReturn,
  saveInvoiceReturn,
  deleteInvoiceReturn,
  deleteInvoiceReturnBatch,
};
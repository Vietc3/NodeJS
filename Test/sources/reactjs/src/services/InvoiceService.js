import http from "./HttpService";

const apiEndpoint = "/invoice";

function generateApiUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getInvoice(invoiceId) {
  return http.get(generateApiUrl(invoiceId));
}
export function getInvoices(datafilter) {
  return http.post(`${apiEndpoint}/list`, datafilter);
}

export function getListInvoice(datafilter) {
  return http.post(`${apiEndpoint}/list-invoice`, datafilter);
}

export function deleteInvoice(InvoiceId) {
  return http.delete(generateApiUrl(InvoiceId));
}

export function deleteInvoices(inputs) {
  return http.post(`${apiEndpoint}/deleteBatch`, inputs);
}

export function saveInvoice(invoice) {
  
  if (invoice.id) {
    let body = {...invoice};
    delete body.id;
    return http.put(generateApiUrl(invoice.id), body);
  }

  return http.post(apiEndpoint, invoice);
}

export function cancelInvoice(InvoiceId) {
  return http.post(generateApiUrl(InvoiceId));
}

export default {
  getInvoices,
  getInvoice,
  deleteInvoice,
  deleteInvoices,
  saveInvoice,
  cancelInvoice,
  getListInvoice
};

import http from "./HttpService";
import Constants from "variables/Constants/";

const apiEndpointCustomer = "/customer/" + Constants.CUSTOMER_TYPE.TYPE_CUSTOMER;
const apiEndpointSupplier = "/customer/" + Constants.CUSTOMER_TYPE.TYPE_SUPPLIER;

function generateApiUrlCustomer(id) {
  return `${apiEndpointCustomer}/${id}`;
}

function generateApiUrlSupplier(id) {
  return `${apiEndpointSupplier}/${id}`;
}

export function getCustomers(datafilter) {
  return http.post(`${apiEndpointCustomer}/list`,datafilter);
}

export function getCustomer(id) {
  return http.get(generateApiUrlCustomer(id));
}

export function saveCustomer(customer) {
  if (customer.id) {
    const body = { ...customer };
    delete body.id;
    return http.put(generateApiUrlCustomer(customer.id), body);
  }

  return http.post(`${apiEndpointCustomer}`, customer);
}

export function deleteCustomer(id) {
  return http.delete(generateApiUrlCustomer(id));
}

export function deleteCustomerBatch(inputs) {
  return http.post(`${apiEndpointCustomer}/deleteBatch`, inputs);
}

export function importCustomers(inputs) {
  return http.post(`${apiEndpointCustomer}/import`, inputs);
}

//supplier


export function getSuppliers(datafilter) {
  return http.post(`${apiEndpointSupplier}/list`,datafilter);
}

export function getSupplier(id) {
  return http.get(generateApiUrlSupplier(id));
}

export function saveSupplier(supplier) {
  if (supplier.id) {
    const body = { ...supplier };
    delete body.id;
    return http.put(generateApiUrlSupplier(supplier.id), body);
  }

  return http.post(`${apiEndpointSupplier}`, supplier);
}

export function deleteSupplier(id) {
  return http.delete(generateApiUrlSupplier(id));
}

export function deleteSupplierBatch(inputs) {
  return http.post(`${apiEndpointSupplier}/deleteBatch`, inputs);
}

export function importSuppliers(inputs) {
  return http.post(`${apiEndpointSupplier}/import`, inputs);
}

export default {
  getCustomers,
  getCustomer,
  saveCustomer,
  deleteCustomer,
  deleteCustomerBatch,
  importCustomers,
  
  getSuppliers,
  getSupplier,
  saveSupplier,
  deleteSupplier,
  deleteSupplierBatch,
  importSuppliers
};
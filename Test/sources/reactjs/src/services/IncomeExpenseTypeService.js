import http from "./HttpService";

const apiEndpoint = "/income_expense_type";

function generateApiUrl(path) {
  return `${apiEndpoint}/${path}`;
}

export function getIncomeExpenseTypes(filters) {
  return http.post(`${apiEndpoint}/list`, filters);
}

export function getIncomeExpenseType(typeId) {
  return http.get(generateApiUrl(typeId));
}

export function saveIncomeExpenseType(typeData) {
  if (typeData.id) {
    const body = { ...typeData };
    delete body.id;
    return http.put(generateApiUrl(typeData.id), body);
  }

  return http.post(apiEndpoint, typeData);
}

export function deleteIncomeExpenseType(typeId) {
  return http.delete(generateApiUrl(typeId));
}

export function deleteIncomeExpenseTypes(arrTypeId) {
  return http.post(generateApiUrl("deleteBatch"), { arrId: arrTypeId });
}

export default {
  getIncomeExpenseTypes,
  getIncomeExpenseType,
  saveIncomeExpenseType,
  deleteIncomeExpenseType,
  deleteIncomeExpenseTypes
};

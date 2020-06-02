import http from "./HttpService";
import Constants from "variables/Constants/";

const apiEndpointIncomeExpense = "/income_expense";
const apiEndpointIncome = "/income_expense/" + Constants.INCOME_EXPENSE_TYPE.TYPE_INCOME;
const apiEndpointExpense = "/income_expense/" + Constants.INCOME_EXPENSE_TYPE.TYPE_EXPENSE;

function generateApiUrlIncome(path) {
  return `${apiEndpointIncome}/${path}`;
}

function generateApiUrlExpense(path) {
  return `${apiEndpointExpense}/${path}`;
}

// income expense

export function getIncomeExpenseCards(data) {
  return http.post(`${apiEndpointIncomeExpense}/list`, data);
}

//income

export function getIncomeCard(id) {
  return http.get(generateApiUrlIncome(id));
}

export function saveIncomeCard(data) {
  if (data.id) {
    return http.put(generateApiUrlIncome(data.id), {data});
  }
  return http.post(`${apiEndpointIncome}`, {data});
}

export function cancelIncomeCard(id) {
  return http.delete(generateApiUrlIncome(id));
}

//expense

export function getExpenseCard(id) {
  return http.get(generateApiUrlExpense(id));
}

export function saveExpenseCard(data) {
  if (data.id) {
    return http.put(generateApiUrlExpense(data.id), {data});
  }
  return http.post(`${apiEndpointExpense}`, {data});
}

export function cancelExpenseCard(id) {
  return http.delete(generateApiUrlExpense(id));
}

export default {
  getIncomeExpenseCards,
  
  getIncomeCard,
  saveIncomeCard,
  cancelIncomeCard,

  getExpenseCard,
  saveExpenseCard,
  cancelExpenseCard,
};

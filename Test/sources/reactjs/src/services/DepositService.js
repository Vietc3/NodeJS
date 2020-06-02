import http from "./HttpService";

const apiEndpoint = "/deposit_card";

function generateApiUrl(path) {
  return `${apiEndpoint}/${path}`;
}

export function getDeposits(filters) {
  return http.post(`${apiEndpoint}/list`, filters);
}

export function getDeposit(depositId) {
  return http.get(generateApiUrl(depositId));
}

export function saveDeposit(deposit) {
  if (deposit.id) {
    const body = { ...deposit };
    delete body.id;
    return http.put(generateApiUrl(deposit.id), body);
  }

  return http.post(apiEndpoint, deposit);
}

export function deleteDeposit(depositId) {
  return http.delete(generateApiUrl(depositId));
}

export default {
    getDeposits,
    getDeposit,
    saveDeposit,
    deleteDeposit,
};

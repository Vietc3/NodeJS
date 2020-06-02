import http from "./HttpService";

const apiEndpoint = "/debt";

function generateApiUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getDebtCards(filter) {
    return http.post(`${apiEndpoint}/list`, filter);
}

export function getDebtCard(debtCardId) {
    return http.get(generateApiUrl(debtCardId))
}

export function saveDebtCard(debtCard) {
    if (debtCard.id) {
      const body = { ...debtCard };
      delete body.id;
      return http.put(generateApiUrl(debtCard.id), body);
    }
  
    return http.post(apiEndpoint, debtCard);
  }

export default {
    getDebtCards,
    getDebtCard,
    saveDebtCard
};

import http from "./HttpService";

const apiEndpoint = "/manufacturing_card";

function generateApiUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getManufacturingCard(id) {
  return http.get(generateApiUrl(id));
}
export function getManufacturingCards(datafilter) {
  return http.post(`${apiEndpoint}/list`, datafilter);
}

export function cancelManufacturingCard(id) {
  return http.post(generateApiUrl(id));
}

export function updateManufacturingCard(manufacturingCard) {
  
  if (manufacturingCard.id) {
    let body = {...manufacturingCard};
    delete body.id;
    return http.put(generateApiUrl(manufacturingCard.id), body);
  }

  return http.post(apiEndpoint, manufacturingCard);
}

export default {
  getManufacturingCards,
  getManufacturingCard,
  cancelManufacturingCard,
  updateManufacturingCard
};

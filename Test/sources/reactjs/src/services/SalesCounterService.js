import jwtDecode from "jwt-decode";
import http from "./HttpService";


const apiEndpoint = "/get-sales-counter";

export function getSalesCounterData(datafilter) {
  return http.post(`${apiEndpoint}/`, datafilter);
}

function setSalesCounterStorage(data) {
  if (data) {
    localStorage.setItem("sales-counter", JSON.stringify(data));
  } 
}

export default {
    getSalesCounterData,
    setSalesCounterStorage
};

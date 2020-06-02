import http from "./HttpService";

const apiEndpoint = "/branch";

function generateApiUrl(path) {
  return `${apiEndpoint}/${path}`;
}

export function saveBranch(branch) {
  if (branch.id) {
    const body = { ...branch };
    delete body.id;
    return http.put(generateApiUrl(branch.id), body);
  }

  return http.post(apiEndpoint, branch);
}
export function getBranch(branchId) {
  return http.get(generateApiUrl(branchId));
}
export function getBranches(datafilter) {
  return http.post(`${apiEndpoint}/list`, datafilter);
}

export function deleteBranch(branchId) {
  return http.delete(generateApiUrl(branchId));
}

export default {
  saveBranch,
  deleteBranch,
  getBranch,
  getBranches
};

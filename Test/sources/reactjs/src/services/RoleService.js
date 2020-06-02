import http from "./HttpService";

const apiEndpoint = "/role";

function generateApiUrl(path) {
  return `${apiEndpoint}/${path}`;
}

export function addRole(role) {
  const body = {...role}
  delete body.id;
  return http.post(`${apiEndpoint}`,body);
}

export function getRoles(filter) {
  return http.post(`${apiEndpoint}/list`, filter);
}

export function getRole(roletId) {
  return http.get(generateApiUrl(roletId));
}

export function getUserRole(userId) {
  return http.get(generateApiUrl(`user/${userId}`));
}

export function saveRole(role) {
  if (role.id) {
    const body = { ...role };
    delete body.id;
    return http.put(generateApiUrl(role.id), body);
  }

  return http.post(apiEndpoint, role);
}

export function deleteRole(roletId) {
  return http.delete(generateApiUrl(roletId));
}

export function deleteRoles(arrRoletId) {
  return http.post(generateApiUrl("deleteBatch"),arrRoletId );
}

export default {
  getRoles,
  getRole,
  addRole,
  saveRole,
  deleteRole,
  deleteRoles,
  getUserRole
};

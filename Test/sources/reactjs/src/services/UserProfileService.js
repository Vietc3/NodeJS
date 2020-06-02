import http from "./HttpService";

const apiEndpoint = "/user_profile";

function generateApiUrl(path) {
  return `${apiEndpoint}/${path}`;
}

export function logout() {
  localStorage.removeItem("token");
  http.setJwt();
}

export function getUserProfile() {
  return http.get(apiEndpoint);
}

export function getUserAvatar() {
  return http.get(generateApiUrl('avatar'));
}

export function saveUserProfile(user) {
  if (user.id) {
    const body = { ...user };
    delete body.id;
    return http.put(apiEndpoint, body);
  }
  return http.post(apiEndpoint, user);
}

export function changePassword(user) {
    if (user.id) {
      const body = { ...user };
      delete body.id;
      return http.put(generateApiUrl("change_password"), body);
    }
    return http.post(apiEndpoint, user);
  }

export default {
  logout,
  getUserProfile,
  saveUserProfile,
  changePassword,
  getUserAvatar
};

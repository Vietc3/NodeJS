import jwtDecode from "jwt-decode";
import http from "./HttpService";
import UserService from "services/UserService";
import RoleService from "services/RoleService";
import { notifyError } from "components/Oh/OhUtils";

const apiEndpoint = "/users";

function generateApiUrl(path) {
  return `${apiEndpoint}/${path}`;
}

export function register(user) {
  return http.post(`${apiEndpoint}/signup`, user);
}

export async function login(email, password, cb) {
  const res = await http.post(`${apiEndpoint}/login`, { email, password });

  http.setJwt(res.data || "");
  getCurrentUser();
  if (cb) cb(res);
}

export function logout() {
  localStorage.removeItem("token");
  http.setJwt();
}

export async function getCurrentUser() {
  const jwt = localStorage.getItem("token");
  let user = jwt && jwt.length > 0 ? jwtDecode(jwt).user : null;
  if(user) {
    let promises = [
      UserService.getUser(user.id),
      RoleService.getUserRole(user.id)
    ];
    
    let responds = await Promise.all(promises);
    let getUser = responds[0];
    let getRole = responds[1];
    
    // Lấy thông tin user đăng nhập
    if(!getUser.status) {
      notifyError(getUser.message);
    } else if(!getRole.status) {
      notifyError(getRole.message);
    } else{
      http.setUser({
        user: getUser.data,
        role: getRole.role,
        permissions: getRole.type,
      });
    }
  }
}

export function getUser(userId) {
  return http.get(generateApiUrl(userId));
}

export function getUserList(data) {
  return http.post(`${apiEndpoint}/list`, data || {});
}

export function saveUser(user) {
  if (user.id) {
    const body = { ...user };
    delete body.id;
    return http.put(generateApiUrl(user.id), body);
  }
  return http.post(apiEndpoint, user);
}

export function saveChangePassword(user) {
  if (user.resetPasswordToken) {
    const body = { ...user };
    return http.post(generateApiUrl("reset-password"), body);
  }
  return ;
}

export function deleteUser(UserId) {
  return http.delete(generateApiUrl(UserId));
}

export function deleteUsers(inputs) {
  return http.post(`${apiEndpoint}/deleteBatch`, inputs);
}
export function resetPassword(inputs) {
  return http.post(`${apiEndpoint}/forgot-password`, inputs);
}

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getUserList,
  getUser,
  saveUser,
  deleteUser,
  deleteUsers,
  resetPassword,
  saveChangePassword
};

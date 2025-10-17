const base = "itpec-exam-";
const _token = base + "token";

export const setToken = (token) => {
  localStorage.setItem(_token, token);
};
export const getToken = () => {
  return localStorage.getItem(_token);
};
export const removeToken = () => {
  localStorage.removeItem(_token);
};

export const removeAll = () => {
  removeToken();
};

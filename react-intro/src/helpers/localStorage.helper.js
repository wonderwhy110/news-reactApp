export function getTokenFromLocalStorage() {
  const data = localStorage.getItem("token");
  const token = data ? JSON.parse(data) : "";

  return token;
}

export function setTokenToLocalStorage(key, token) {
  localStorage.setItem(key, JSON.stringify(token));
}

export function removeTokenFromLocalStorage(key) {
  localStorage.removeItem(key);
}

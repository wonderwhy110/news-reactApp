import axios from "axios";
import { getTokenFromLocalStorage } from "../helpers/localStorage.helper";

export const instance = axios.create({
   baseURL :process.env.REACT_APP_API_URL 
});
// Добавляем интерцептор для КАЖДОГО запроса
instance.interceptors.request.use((config) => {
  const token = getTokenFromLocalStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Удаляем заголовок если токена нет
    delete config.headers.Authorization;
  }
  return config;
});


export const instanceWithoutAuth = axios.create({
   baseURL :process.env.REACT_APP_API_URL 
});
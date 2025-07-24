// src/api/newsApiClient.js
import axios from 'axios';

const newsApiClient = axios.create({
  baseURL: 'http://localhost:5230/api/v1', // ¡¡AJUSTA EL PUERTO SI ES DIFERENTE!!
  headers: {
    'Content-Type': 'application/json',
  }
});

// Puedes añadir interceptores para manejar errores globalmente o añadir tokens de autenticación aquí
// newsApiClient.interceptors.request.use(config => {
//   const token = localStorage.getItem('user_token'); // Ejemplo
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default newsApiClient;
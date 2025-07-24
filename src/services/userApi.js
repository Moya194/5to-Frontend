import axios from 'axios';

// Este cliente apunta directamente a tu API de Express.js
const userApiClient = axios.create({
  baseURL: 'http://localhost:34568/api', // Asegúrate de que el puerto sea el correcto
  headers: {
    'Content-Type': 'application/json'
  }
});

export default userApiClient;
// src/api/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5199/api', // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  }
});

export default apiClient;
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

// Actualizamos la declaración para incluir la nueva instancia
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
    $apiClient: AxiosInstance; // <-- Añadimos la nueva instancia
  }
}

const api = axios.create({
  baseURL: 'http://localhost:34567/api', // AHORA
});

// --- INSTANCIA 2: Tu VeterinariaApi de .NET ---
const apiClient = axios.create({
  baseURL: 'http://localhost:5299/api', // AHORA (ajusta el puerto si es diferente)
});

// Puedes añadir interceptores a cada una de forma independiente si lo necesitas
// Por ejemplo, el interceptor de autenticación solo para tu API principal:
api.interceptors.request.use((config) => {
  const userProfileString = sessionStorage.getItem('userProfile');
  if (userProfileString) {
    // Aquí iría tu lógica para añadir el token de autenticación
    // config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default boot(({ app }) => {
  // Hacemos que ambas instancias estén disponibles globalmente en tus componentes
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$apiClient = apiClient; // <-- La registramos
});

// Exportamos ambas para poder importarlas en los scripts
export { api, apiClient };

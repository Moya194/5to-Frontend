import axios from 'axios';

/**
 * Creamos una instancia de Axios dedicada para la ProductoApi.
 * Esta instancia manejará la autenticación y otras futuras
 * funcionalidades de esta API.
 */
const productoApiClient = axios.create({
  // Apuntamos a la dirección base de tu nueva API
  baseURL: 'http://localhost:5216/api', 
  
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Este interceptor es crucial. Se ejecuta ANTES de cada petición
 * hecha con 'productoApiClient'. Su trabajo es adjuntar automáticamente
 * el token JWT a las cabeceras si el usuario está autenticado.
 */
productoApiClient.interceptors.request.use(
  async (config) => { // La función ahora es async
    // Usamos un import dinámico para evitar problemas de carga circular
    const { useAuthStore } = await import('@/stores/auth-store');
    const authStore = useAuthStore();
    
    if (authStore.isAuthenticated) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

export default productoApiClient;

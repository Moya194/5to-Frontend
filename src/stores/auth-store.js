import { defineStore } from 'pinia';
// Asumimos que la API de login está en productoApi.js
import productoApiClient from '../services/ProductoApi'; 

export const useAuthStore = defineStore('auth', {
  // STATE: Aquí guardamos la información
  state: () => {
    // --- LÓGICA DE INICIALIZACIÓN CORREGIDA ---
    // 1. Obtenemos el usuario guardado como texto desde localStorage.
    const storedUser = localStorage.getItem('user');

    // 2. Devolvemos el estado inicial.
    return {
      // El token se puede obtener directamente.
      token: localStorage.getItem('token') || null,
      // Solo intentamos parsear el usuario si 'storedUser' realmente existe.
      // Si no, el valor por defecto es null.
      user: storedUser ? JSON.parse(storedUser) : null,
    };
  },

  // GETTERS: Propiedades computadas para acceder fácilmente al estado
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.tipousuario, // Asumiendo que el claim se llama así
  },

  // ACTIONS: Los métodos que modifican el estado
  actions: {
    /**
     * Maneja el inicio de sesión del usuario.
     * @param {string} username - El nombre de usuario.
     * @param {string} password - La contraseña.
     */
    async login(username, password) {
      try {
        const response = await productoApiClient.post('/auth/login', { username, password });
        
        const { token, usuario } = response.data;

        this.token = token;
        this.user = usuario;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(usuario));

        return true;

      } catch (error) {
        console.error("Error en el login:", error);
        this.logout();
        throw new Error(error.response?.data?.error || 'Credenciales incorrectas.');
      }
    },

    /**
     * Cierra la sesión del usuario.
     */
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

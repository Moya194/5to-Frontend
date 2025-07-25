import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Define una 'interfaz' para el perfil de usuario para que el código sea más claro
export interface UserProfile {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  permiso?: 'Admin' | 'User'; // El permiso puede ser opcional o venir de la API
  // Agrega cualquier otro campo del perfil que tu API devuelva
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  // --- ESTADO ---
  // Guarda el perfil completo del usuario. Es 'null' si no está logueado.
  const userProfile = ref<UserProfile | null>(null);

  // --- GETTERS (Propiedades calculadas) ---
  // Un getter reactivo que nos dice si el usuario está autenticado.
  // Es la forma limpia de verificar el estado en toda la app.
  const isAuthenticated = computed(() => !!userProfile.value);

  // --- ACCIONES (Métodos) ---

  /**
   * Acción para manejar el inicio de sesión.
   * @param profile - El objeto del perfil del usuario recibido de la API.
   */
  function login(profile: UserProfile) {
    userProfile.value = profile;
    // Guardamos en sessionStorage para persistir la sesión si se recarga la página
    sessionStorage.setItem('userProfile', JSON.stringify(profile));
  }

  /**
   * Acción para manejar el cierre de sesión.
   */
  function logout() {
    userProfile.value = null;
    sessionStorage.removeItem('userProfile');
    // Redirigimos al login después de cerrar sesión
    router.push({ name: 'login' });
  }

  function checkAuthStatus() {
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
      // Si encontramos un perfil, lo cargamos de nuevo en el estado de Pinia.
      userProfile.value = JSON.parse(storedProfile);
    }
  }

  // Exponemos el estado y las acciones para que puedan ser usados en los componentes.
  return {
    userProfile,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
  };
});

import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { useAuthStore } from 'src/stores/auth-store'; // Importa tu almacén de auth

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // --- ¡AQUÍ VA LA GUARDIA DE NAVEGACIÓN! ---
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated; // Usamos el getter del almacén

    // Si la ruta requiere autenticación y el usuario no está logueado
    if (to.meta.requiresAuth && !isAuthenticated) {
      // Redirigir al login
      next({ name: 'login' });
    }
    // Si el usuario está logueado y trata de ir al login
    else if (!to.meta.requiresAuth && isAuthenticated) {
      // Redirigir al home de la app
      next({ name: 'home' });
    }
    // En cualquier otro caso, permitir el acceso
    else {
      next();
    }
  });

  return Router;
});

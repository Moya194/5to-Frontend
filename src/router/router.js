// src/router/index.js (o donde esté tu archivo)
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/components/HelloWorld.vue'; // O '@views/HomeView.vue' si lo moviste
import LoginView from '@/views/LoginView.vue';
import RegisterUser from '@/views/RegisterUser.vue';
import SideMenu from '@/components/SideMenu.vue';
import MascotaRegister from '@/views/MascotaRegister.vue';
import MascotaRegisterAdmin from '@/views/MascotaRegisterAdmin.vue';
import MascotasRegistradas from '@/views/MascotasRegistradas.vue';
import MascotasRegistradasAdmin from '@/views/MascotasRegistradasAdmin.vue';
import PerfilUsuario from '@/views/perfilUsuario.vue';
import MisMascotas from '@/views/Mismascotas.vue';
import EscanearQR from '@/views/EscanearQR.vue';
import ConstanciaForm from '@/views/ConstanciaForm.vue';
import ConstanciasListView from '@/views/ConstanciasListView.vue';


// Importa tu vista de noticias
import NewsView from '@/modules/news/views/NewsView.vue'; // Ajusta esta ruta si es necesario
import PerfilAdmin from '@/views/perfilAdmin.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/home',
    name: 'home',
    components: {
      default: HomeView,
      sideMenu: SideMenu,
    },
  },
  {
    path: '/admin',
    name: 'admin',
    components: {
      default: PerfilAdmin,
      sideMenu: SideMenu,
    },
  },
  // ... (tus otras rutas existentes) ...
  {
    path: '/register-user',
    name: 'register-user',
    components: {
      default: RegisterUser,
      sideMenu: SideMenu,
    },
  },
  {
    path: '/register-mascota',
    name: 'register-mascota',
    components: {
      default: MascotaRegister,
      sideMenu: SideMenu,
    },
  },
  {
    path: '/mascotas-registradas',
    name: 'mascotas-registradas',
    components: {
      default: MascotasRegistradas,
      sideMenu: SideMenu,
    },
  },
  {
    path: '/registermascota',
    name: 'registermascota',
    components: {
      default: MascotaRegisterAdmin,
      sideMenu: SideMenu,
    },
  },
  {
    path: '/mascotasregistradas',
    name: 'mascotasregistradas',
    components: {
      default: MascotasRegistradasAdmin,
      sideMenu: SideMenu,
    },
  },
  {
    path: '/perfil-usuario',
    name: 'perfil-usuario',
    components: {
      default: PerfilUsuario,
      sideMenu: SideMenu,
    },
  },
  {
    path: '/mis-mascotas',
    name: 'mis-mascotas',
    components: {
      default: MisMascotas,
      sideMenu: SideMenu,
    },
  },
  {
    path: '/escanear-qr',
    name: 'escanear-qr',
    components: {
      default: EscanearQR,
      sideMenu: SideMenu,
    },
  },
  // --- Nueva Ruta para Noticias ---
  {
    path: '/noticias', // O la URL que prefieras
    name: 'news',
    components: { // Usando el mismo patrón para incluir el SideMenu
      default: NewsView,    // Tu vista principal del módulo de noticias
      sideMenu: SideMenu, // El mismo menú lateral
    },
    // Puedes añadir meta campos si los usas para títulos de página o protección de rutas
    // meta: { requiresAuth: true, title: 'Noticias' }
  },
  {
    path: '/Constancia', // O la URL que prefieras
    name: 'Consatcia',
    components: { // Usando el mismo patrón para incluir el SideMenu
      default: ConstanciaForm,    // Tu vista principal del módulo de noticias
      sideMenu: SideMenu, // El mismo menú lateral
    },
  },
  {
    path: '/Consulta-Constancia', // O la URL que prefieras
    name: 'Consulta Consatcia',
    components: { // Usando el mismo patrón para incluir el SideMenu
      default: ConstanciasListView,    // Tu vista principal del módulo de noticias
      sideMenu: SideMenu, // El mismo menú lateral
    },
  },
];

const router = createRouter({
  history: createWebHistory(), // o process.env.BASE_URL si usas Vue CLI y no Vite
  routes,
});

export default router;
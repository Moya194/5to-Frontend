import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('pages/perfilAdmin.vue'),
      },
      {
        path: 'perfil-usuario',
        name: 'perfil-usuario',
        component: () => import('pages/perfilUsuario.vue'),
      },
      {
        path: 'compo',
        name: 'compo',
        component: () => import('pages/MascotaRegisterAdmin.vue'),
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'tabla',
        name: 'tabla',
        component: () => import('pages/ConstanciasListView.vue'),
      },
      {
        path: 'constacia',
        name: 'constacia',
        component: () => import('pages/ConstanciaForm.vue'),
      },
      {
        path: 'carnet',
        name: 'carnet',
        component: () => import('pages/MascotasRegistradas.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router' // Importa desde la carpeta router
import { IonicVue } from '@ionic/vue'

// Importa los estilos de Ionic
import '@ionic/core/css/ionic.bundle.css'

const app = createApp(App)
  .use(IonicVue)
  .use(router) // Registra el router

router.isReady().then(() => {
  app.mount('#app')
})
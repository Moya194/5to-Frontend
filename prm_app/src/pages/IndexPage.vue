<template>
  <q-page class="column items-center justify-center q-pa-md login-page-bg">
    <div class="login-container">
      <div class="logo-container">
        <q-img :src="logo" alt="Logo Municipio" class="logo" />
      </div>

      <div class="image-container">
        <q-img :src="mascotasLogo" alt="Mascotas" class="mascotas-logo" />
      </div>

      <div class="text-container text-center">
        <h1 class="text-h4 text-weight-bold text-grey-9">MASCOTAS</h1>
        <p class="text-subtitle1 text-grey-7">
          Bienvenidos al registro de mascotas del municipio de Cayambe
        </p>
      </div>

      <q-form @submit.prevent="handleLogin" class="q-gutter-y-md">
        <q-input
          outlined
          v-model="username"
          label="Usuario (cédula)"
          placeholder="Ingresa tu usuario"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Por favor, ingresa tu usuario',
          ]"
        />

        <q-input
          outlined
          v-model="password"
          label="Contraseña"
          type="password"
          placeholder="Ingresa tu contraseña"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) || 'Por favor, ingresa tu contraseña',
          ]"
        />

        <q-btn
          type="submit"
          label="Iniciar Sesión"
          color="positive"
          class="full-width login-btn"
          size="lg"
          :loading="loading"
        />
      </q-form>

      <div class="download-links">
        <q-btn flat round>
          <q-img :src="googlePlay" alt="Google Play" class="download-icon" />
        </q-btn>
        <q-btn flat round>
          <q-img :src="appStore" alt="App Store" class="download-icon" />
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios'; // Importante: Usamos la instancia de Axios configurada

// Importación de imágenes
import mascotasLogo from 'src/assets/logoMascotas.png';
import logo from 'src/assets/escudo.png';
import googlePlay from 'src/assets/playstore.png';
import appStore from 'src/assets/appstore.png';

// Inicializamos Quasar y Vue Router
const $q = useQuasar();
const router = useRouter();

// Estado del componente (reactividad)
const username = ref('');
const password = ref('');
const loading = ref(false);
// El `errorMessage` ya no es necesario, usaremos notificaciones de Quasar

// Lógica de login (exactamente la misma que tenías, pero con notificaciones)
const handleLogin = async () => {
  loading.value = true;

  // Acceso de administrador local para pruebas
  if (username.value === 'admin' && password.value === 'admin') {
    loading.value = false;
    sessionStorage.setItem(
      'userProfile',
      JSON.stringify({ NomProfe: 'Admin Local', Permiso: 'ADMIN' })
    );
    router.push('/admin'); // Reemplaza con tu ruta de admin
    return;
  }

  try {
    // Usamos la instancia 'api' del boot file de axios
    const response = await api.post('/login', {
      username: username.value,
      password: password.value,
    });

    const userProfile = response.data;
    console.log('Login exitoso:', userProfile);

    sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
    sessionStorage.setItem('CedProfe', userProfile.cedProfe);

    // Redirigir basado en el rol/permiso
    if (userProfile.permiso === 'Admin') {
      router.push({ name: 'ruta-admin' }); // Reemplaza con el nombre de tu ruta de admin
    } else {
      router.push({ name: 'perfil-usuario' }); // Reemplaza con tu ruta de usuario
    }
  } catch (error) {
    console.error('Error en login:', error);
    let message = 'No se pudo conectar con el servidor. Intente más tarde.';
    if (error.response && error.response.status === 401) {
      message = 'Cédula o contraseña incorrectos.';
    }

    // Mostramos una notificación de error (mejor UX)
    $q.notify({
      color: 'negative',
      position: 'top',
      message: message,
      icon: 'report_problem',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Copiamos los estilos originales, ya que son CSS estándar y funcionan perfectamente */
.login-page-bg {
  background-color: #f0f2f5; /* Un color de fondo suave */
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px; /* Ancho máximo para el formulario en pantallas grandes */
  animation: fadeIn 0.6s ease-out;
}

.logo-container {
  margin-bottom: 20px;
  animation-delay: 0.1s;
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.image-container {
  margin-bottom: 20px;
  animation-delay: 0.2s;
}

.mascotas-logo {
  max-width: 200px;
  height: auto;
  border-radius: 12px;
}

.text-container {
  margin-bottom: 20px;
  animation-delay: 0.3s;
}

.login-btn {
  height: 50px;
  font-weight: 600;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.login-btn:active {
  transform: scale(0.98);
}

.download-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  animation-delay: 0.5s;
}

.download-icon {
  width: 120px;
  height: auto;
}

/* Animación de entrada */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

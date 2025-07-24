<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="login-container">
        <!-- Logo del municipio -->
        <div class="logo-container">
          <img :src="logo" alt="Logo" class="logo" />
        </div>
        
        <!-- Imagen de mascotas -->
        <div class="image-container">
          <img :src="mascotasLogo" alt="Mascotas" class="mascotas-logo" />
        </div>
        
        <!-- Título y texto de bienvenida -->
        <div class="text-container">
          <h1 class="title">MASCOTAS</h1>
          <p class="welcome-text">Bienvenidos al registro de mascotas del municipio de Cayambe</p>
        </div>
        
        <!-- Formulario de login -->
        <form @submit.prevent="handleLogin">
          <ion-item>
            <ion-label position="floating">Usuario</ion-label>
            <ion-input 
              type="text" 
              v-model="username" 
              placeholder="Ingresa tu usuario"
              required
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="floating">Contraseña</ion-label>
            <ion-input 
              type="password" 
              v-model="password" 
              placeholder="Ingresa tu contraseña"
              required
            ></ion-input>
          </ion-item>
          
          <ion-button 
            expand="block" 
            type="submit"
            :disabled="loading"
            class="login-btn"
          >
            <ion-spinner v-if="loading" name="crescent"></ion-spinner>
            <span v-else>INICIAR SESIÓN</span>
          </ion-button>
        </form>
        
        <!-- Mensaje de error -->
        <ion-text v-if="errorMessage" color="danger" class="error-message">
          {{ errorMessage }}
        </ion-text>
        
        <!-- Enlaces de descarga -->
        <div class="download-links">
          <ion-button fill="clear" class="download-btn">
            <img :src="googlePlay" alt="Google Play" class="download-icon" />
          </ion-button>
          <ion-button fill="clear" class="download-btn">
            <img :src="appStore" alt="App Store" class="download-icon" />
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { 
  IonPage, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton,
  IonSpinner,
  IonText
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
// import authService from '@/api/auth.service';
import userApiClient from '@/services/userApi';
import mascotasLogo from '/src/imagenes/logoMascotas.png';
import logo from '/src/imagenes/escudo.png';
import googlePlay from '/src/imagenes/playstore.png';
import appStore from '/src/imagenes/appstore.png';
export default defineComponent({
  name: 'LoginView',
  components: {
    IonPage, 
    IonContent, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton,
    IonSpinner,
    IonText
  },
  
  setup() {
    const router = useRouter();
    const username = ref(''); // La cédula del usuario
    const password = ref('');
    const loading = ref(false);
    const errorMessage = ref('');
    
    const handleLogin = async () => {
      loading.value = true;
      errorMessage.value = '';
      
      // Acceso de administrador (temporal, si aún lo necesitas)
      if (username.value === 'admin' && password.value === 'admin') {
        console.log('Inicio de sesión como administrador local');
        loading.value = false;
        // Aquí podrías guardar un perfil de admin falso en sessionStorage si es necesario
        sessionStorage.setItem('userProfile', JSON.stringify({ NomProfe: 'Admin Local', Permiso: 'ADMIN' }));
        router.push('/admin'); // Redirige a la ruta de admin
        return;
      }
      
      try {
        // Usamos el cliente Axios y el endpoint correcto
        const response = await userApiClient.post('/login', {
          // Usamos .value para acceder a los datos de las refs
          username: username.value,
          password: password.value
        });
        
        // La respuesta exitosa (response.data) contiene el perfil del usuario
        const userProfile = response.data;
        
        console.log('Login exitoso:', userProfile);

        // Guardamos el perfil completo en sessionStorage, como en tu JS original
        // Esto es más útil que guardar cada campo por separado.
        sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        // También puedes guardar la cédula por separado si la necesitas con frecuencia
        sessionStorage.setItem('CedProfe', userProfile.cedProfe);

        // Redirigir basado en el rol/permiso
        if (userProfile.permiso === 'Admin') {
            router.push({ name: 'ruta-admin' }); // Reemplaza con tu ruta de admin
        } else {
            router.push({ name: 'perfil-usuario' }); // Reemplaza con tu ruta de usuario
        }
        
      } catch (error) {
        console.error('Error en login:', error);
        // Axios devuelve errores en error.response. Si es 401, las credenciales son incorrectas.
        if (error.response && error.response.status === 401) {
          errorMessage.value = 'Cédula o contraseña incorrectos.';
        } else {
          errorMessage.value = 'No se pudo conectar con el servidor. Intente más tarde.';
        }
      } finally {
        loading.value = false;
      }
    };
    
    return {
      username,
      password,
      loading,
      errorMessage,
      handleLogin,
      mascotasLogo,
      logo,
      googlePlay,
      appStore
    };
  }
});
</script>
<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.logo-container {
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.image-container {
  margin-bottom: 30px;
}

.mascotas-logo {
  max-width: 250px;
  height: auto;
  border-radius: 12px;
}

.text-container {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
}

.welcome-text {
  font-size: 1rem;
  color: #7f8c8d;
  max-width: 300px;
}

ion-item {
  --background: #f9f9f9;
  --border-radius: 10px;
  margin-bottom: 20px;
  --padding-start: 0;
  --inner-padding-end: 0;
}

ion-input {
  --padding-start: 16px;
  --padding-end: 16px;
}

.login-btn {
  --background: #4CAF50;
  --background-hover: #45a049;
  --background-activated: #3d8b40;
  --border-radius: 10px;
  height: 50px;
  font-weight: 600;
  margin-top: 10px;
  transition: transform 0.3s ease;
}

.login-btn:active {
  transform: scale(0.98);
}

.error-message {
  display: block;
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
}

.download-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 40px;
}

.download-btn {
  --padding-start: 0;
  --padding-end: 0;
  --ripple-color: transparent;
}

.download-icon {
  width: 120px;
  height: auto;
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.logo-container, .image-container, .text-container, form {
  animation: fadeIn 0.6s ease-out;
}

.logo-container { animation-delay: 0.1s; }
.image-container { animation-delay: 0.2s; }
.text-container { animation-delay: 0.3s; }
form { animation-delay: 0.4s; }
.download-links { animation-delay: 0.5s; }

/* Media queries para diferentes tamaños de pantalla */
@media (max-height: 600px) {
  .login-container {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  
  .logo-container {
    margin-bottom: 15px;
  }
  
  .image-container {
    margin-bottom: 15px;
  }
  
  .mascotas-logo {
    max-width: 180px;
  }
  
  .text-container {
    margin-bottom: 20px;
  }
  
  .download-links {
    margin-top: 20px;
  }
}

@media (min-width: 768px) {
  .login-container {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .mascotas-logo {
    max-width: 300px;
  }
}
</style>
<template>
  <div class="login-container">
    <div class="login-box">
      <h1>MASCOTAS</h1>
      <p class="welcome-text">Bienvenidos al registro de mascotas del municipio de Cayambe</p>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">USUARIO</label>
          <input type="text" id="username" v-model="username" placeholder="Ingresa tu usuario" />
        </div>
        <div class="input-group">
          <label for="password">CONTRASEÑA</label>
          <input type="password" id="password" v-model="password" placeholder="Ingresa tu contraseña" />
        </div>
        <button type="submit">INICIAR SESIÓN</button>
      </form>
      <div class="download-links">
        <a href="#" class="download-btn">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Google_Play_Logo.svg/1200px-Google_Play_Logo.svg.png" alt="Descargar en Google Play" class="download-icon" />
        </a>
        <a href="#" class="download-btn">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Apple_Logo.svg/200px-Apple_Logo.svg.png" alt="Descargar en App Store" class="download-icon" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    handleLogin() {
      // Verificar si las credenciales son correctas
      if (this.username === 'admin' && this.password === 'admin') {
        // Redirigir a la página de home
        this.$router.push({ name: 'home' });
      } else {
        // Si las credenciales son incorrectas, mostrar un mensaje de error
        alert('Usuario o contraseña incorrectos');
      }
    }
  }
};
</script>

<style scoped>
* {
  font-family: 'Montserrat', sans-serif;
}

/* Fondo y contenedor principal */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f9f9f9, #e0e0e0);
}

/* Caja del login */
.login-box {
  background: #fff;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 380px;
  text-align: center;
  transition: transform 0.3s ease-in-out;
}

/* Animación de la caja */
.login-box:hover {
  transform: translateY(-10px);
}

/* Título */
h1 {
  color: #333;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Texto de bienvenida */
.welcome-text {
  color: #555;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

/* Estilo de los inputs */
.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: #fafafa;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

input:focus {
  border-color: #007bff;
  background-color: #fff;
  outline: none;
}

input::placeholder {
  color: #aaa;
}

/* Botón de submit */
button {
  width: 100%;
  padding: 0.9rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

/* Estilo del texto de descarga */
.download-links {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.download-btn {
  display: inline-block;
}

.download-icon {
  width: 130px;
  height: auto;
  transition: transform 0.3s ease;
}

.download-icon:hover {
  transform: scale(1.05);
}
</style>

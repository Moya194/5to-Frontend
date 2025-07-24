<template>
  <div>
    <SideMenu @menu-toggle="handleMenuToggle" />

    <div class="perfil-usuario" :class="{ 'menu-collapsed': !isMenuOpen }">
      <div class="perfil-container">
        <h1>Perfil de Usuario</h1>
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <span>Cargando datos...</span>
        </div>
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-else class="perfil-info">
          <div class="datos">
            <div class="dato-item">
              <strong>ID:</strong>
              <span>{{ usuario.id }}</span>
            </div>
            <div class="dato-item">
              <strong>Nombre:</strong>
              <span>{{ usuario.nombre }} {{ usuario.apellido }}</span>
            </div>
            <div class="dato-item">
              <strong>Correo electrónico:</strong>
              <span>{{ usuario.correo || 'No proporcionado' }}</span>
            </div>
            <div class="dato-item">
              <strong>Teléfono:</strong>
              <span>{{ usuario.telefono || 'No proporcionado' }}</span>
            </div>
            <div class="dato-item">
              <strong>Dirección:</strong>
              <span>{{ usuario.direccion || 'No proporcionada' }}</span>
            </div>
            <div class="dato-item">
              <strong>Cédula:</strong>
              <span>{{ usuario.cedula || 'No proporcionada' }}</span>
            </div>
            <div class="dato-item">
              <strong>Ocupación:</strong>
              <span>{{ usuario.ocupacion || 'No proporcionada' }}</span>
            </div>
            <div class="dato-item">
              <strong>Tipo de usuario:</strong>
              <span>{{ usuario.tipo || 'No proporcionado' }}</span>
            </div>
          </div>
        </div>
        <button @click="editarPerfil" class="btn-editar">
          <svg class="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editar Perfil
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SideMenu from '@/components/SideMenu.vue';
export default {
  name: 'PerfilUsuario',
  components: {
    SideMenu,
  },
  data() {
    return {
      usuario: {
        id: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        direccion: '',
        cedula: '',
        ocupacion: '',
        tipo: '',
        avatar: '',
      },
      loading: true,
      isMenuOpen: true,
      error: null
    };
  },
  mounted() {
    this.cargarDatosUsuario();
  },
  methods: {
    handleMenuToggle(isOpen) {
      this.isMenuOpen = isOpen;
    },
    async cargarDatosUsuario() {
      try {
        const usuarioId = localStorage.getItem('usuarioId');
        console.log('ID del usuario:', usuarioId); // Debug
        if (!usuarioId) {
          throw new Error('No hay sesión activa');
        }
        // Cargar datos del localStorage primero
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
          this.usuario = JSON.parse(usuarioGuardado);
        }

        // Luego actualizar desde el servidor
        await this.obtenerDatosUsuario(usuarioId);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        this.error = error.message;

        if (error.message === 'No hay sesión activa') {
          this.$router.push('/login');
        }
      }
    },
    async obtenerDatosUsuario(usuarioId) {
  console.log(`📡 Enviando solicitud para el usuario con ID: ${usuarioId}`);

  try {
    const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}`);

    if (!response.ok) {
      throw new Error(`⚠️ Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("📌 Datos recibidos:", data);

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No se encontraron datos para este usuario.");
    }

    this.usuario = data; // Asignar directamente los datos
  } catch (error) {
    console.error("🚨 Error al obtener datos del usuario:", error);
    alert(error.message);
  } finally {
    this.loading = false;
  }
},
    editarPerfil() {
      alert('Funcionalidad de editar perfil en construcción.');
    }
  }
};
</script>

<style scoped>
.error-message {
  color: #dc3545;
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  background-color: #fff;
  border: 1px solid #dc3545;
  border-radius: 4px;
}

.perfil-usuario {
  margin-left: 250px;
  padding: 2rem;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  background: #f8f9fa;
}

.perfil-usuario.menu-collapsed {
  margin-left: 0;
}

.perfil-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.perfil-info {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.avatar {
  flex-shrink: 0;
  text-align: center;
}

.avatar img {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 4px solid white;
  transition: transform 0.3s ease;
  object-fit: cover;
}

.avatar img:hover {
  transform: scale(1.05);
}

.datos {
  flex: 1;
  min-width: 280px;
}

.dato-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dato-item strong {
  color: #666;
  font-size: 0.9rem;
}

.dato-item span {
  color: #333;
  font-size: 1.1rem;
}

.btn-editar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 2rem auto 0;
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-editar:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
}

.edit-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .perfil-usuario {
    margin-left: 0;
    padding: 1rem;
  }

  .perfil-container {
    padding: 1.5rem;
  }

  .perfil-info {
    flex-direction: column;
    align-items: center;
  }

  .avatar img {
    width: 150px;
    height: 150px;
  }

  .datos {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .perfil-container {
    padding: 1rem;
  }

  .avatar img {
    width: 120px;
    height: 120px;
  }

  .btn-editar {
    width: 100%;
  }
}
</style>
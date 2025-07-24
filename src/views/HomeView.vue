<template>
  <div class="dashboard">
    <menul /> <!-- Menú lateral -->
    <div class="content">
      <header>
        <h1>Sistema de Catastro de Animales</h1>
        <p>Bienvenido, aquí puedes gestionar el registro de usuarios y sus mascotas.</p>
      </header>

      <section class="actions">
        <button @click="registrarUsuario">Registrar Usuario</button>
        <button @click="registrarMascota">Registrar Mascota</button>
      </section>

      <section class="info">
        <h2>Últimos Registros</h2>
        <ul>
          <li v-for="(usuario, index) in usuarios" :key="index">
            {{ usuario.nombre }} - {{ usuario.cedula }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import Menul from '@/components/SideMenu';

export default {
  name: 'DashboardView',
  components: {
    Menul
  },
  data() {
    return {
      usuarios: [
        { nombre: 'Juan Pérez', cedula: '1723456789' },
        { nombre: 'Ana Gómez', cedula: '1809876543' }
      ]
    };
  },
  methods: {
    registrarUsuario() {
      alert('Función para registrar usuario');
    },
    registrarMascota() {
      alert('Función para registrar mascota');
    }
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
}

.content {
  margin-left: 250px;
  padding: 20px;
  width: 100%;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 2rem;
  color: #42b983;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #36976b;
}

.info {
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  font-size: 1.2rem;
  color: #333;
}
</style>

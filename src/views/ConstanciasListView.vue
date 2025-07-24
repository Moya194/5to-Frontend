<template>
  <div class="app-layout">
    <SideMenu />
    
    <main class="main-content">
      <router-view />
    </main>
  
  <div class="page-container">
    <div class="list-card">
      <header class="list-header">
        <h1>Listado de Constancias Emitidas</h1>
        <p>Aquí puedes ver todas las constancias registradas en el sistema.</p>
      </header>

      <div v-if="!store.loading && !store.error && store.constancias.length > 0">
        <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nombre Constancia</th>
                  <th>Mascota</th>
                  <th>Propietario</th>
                  <th>Fecha de Entrega</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="constancia in store.constancias" :key="constancia.id">
                  <td>{{ constancia.nombre }}</td>
                  <td>{{ constancia.mascota?.nombre || 'N/A' }}</td>
                  <td>{{ constancia.responsable }}</td>
                  <td>{{ formatDate(constancia.fechaEntrega) }}</td>
                  <td class="actions-cell">
                    <button 
                      @click="handleDelete(constancia.id)"
                      class="btn btn-delete"
                      title="Eliminar Constancia"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>

        <div class="pagination-controls">
          <button 
            @click="changePage(store.currentPage - 1)" 
            :disabled="store.currentPage <= 1"
            class="btn"
          >
            Anterior
          </button>
          
          <span>
            Página {{ store.currentPage }} de {{ store.totalPages }}
          </span>

          <button 
            @click="changePage(store.currentPage + 1)" 
            :disabled="store.currentPage >= store.totalPages"
            class="btn"
          >
            Siguiente
          </button>
        </div>
        </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useConstanciaStore } from '../stores/constancia-store';
import Swal from 'sweetalert2';
import SideMenu from '@/components/SideMenu.vue';


const store = useConstanciaStore();

// Al montar el componente, cargamos la primera página
onMounted(() => {
  store.fetchAllConstancias(1);
});

// ✅ Nueva función para cambiar de página
const changePage = (page) => {
  // Verificamos que la página solicitada esté dentro del rango válido
  if (page >= 1 && page <= store.totalPages) {
    store.fetchAllConstancias(page);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-EC', options);
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esta acción.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, ¡eliminar!',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      await store.deleteConstancia(id);
      Swal.fire('¡Eliminada!', 'La constancia ha sido eliminada.', 'success');
    } catch (error) {
      Swal.fire('Error', store.error, 'error');
    }
  }
};
</script>

<style scoped>
/* Estilos consistentes con el resto de la aplicación */
.page-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}
.list-card {
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}
.list-header {
  text-align: center;
  margin-bottom: 2rem;
}
.list-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
}
.table-container {
  width: 100%;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
th, td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
}
thead tr {
  background-color: #f8f9fa;
}
th {
  font-weight: 600;
  color: #495057;
}
tbody tr:hover {
  background-color: #f1f1f1;
}
.actions-cell {
  display: flex;
  gap: 10px;
}
.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-delete {
  background-color: #dc3545;
  color: white;
}
.btn-delete:hover:not(:disabled) {
  background-color: #c82333;
}
.loading-indicator, .error-banner, .info-banner {
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
}
.error-banner {
  background-color: #f8d7da;
  color: #721c24;
}
.info-banner {
  background-color: #e2e3e5;
  color: #383d41;
}
.app-layout {
  display: flex;
  height: 100vh;
}

.main-content {
  flex-grow: 1; 
  overflow-y: auto;
  padding: 2rem;
  /* ✅ Con este margen, el contenido principal empieza justo
     donde termina el menú lateral, sin sobreponerse. */
  margin-left: 240px; 
}
.sidebar-container {
  width: 240px; /* Ancho fijo para la barra de navegación */
  flex-shrink: 0; /* Evita que el menú se haga más pequeño */
  background-color: #ffffff;
  height: 100vh;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05); /* Sombra sutil */
  position: fixed; /* Lo fija en la pantalla */
  left: 0;
  top: 0;
  z-index: 1000; /* Se asegura de que esté por encima de otros elementos si es necesario */
}
</style>
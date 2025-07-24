<template>
  <div class="page-container">
    <div class="wizard-card">
      
      <!-- PASO 1: BÚSQUEDA DEL PROPIETARIO -->
      <div v-if="!propietarioSeleccionado">
        <header class="form-header">
          <h1>Crear Nueva Constancia</h1>
          <p>Paso 1 de 3: Buscar al propietario por su Cédula</p>
        </header>
        <div class="search-container">
          <label for="cedula-search">Cédula del Propietario</label>
          <input
            id="cedula-search"
            v-model="cedulaBusqueda"
            type="text"
            placeholder="Ingrese la cédula para buscar..."
            @input="handleInput"
          />
          <div v-if="usuarioStore.loading" class="loading-indicator-small">Buscando...</div>
          <div v-if="usuariosEncontrados.length > 0" class="search-results">
            <ul>
              <li v-for="usuario in usuariosEncontrados" :key="usuario.Id" @click="seleccionarPropietario(usuario)">
                {{ usuario.Nombre }} {{ usuario.Apellido }} - Cédula: {{ usuario.Cedula }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- PASO 2: SELECCIÓN DE LA MASCOTA -->
      <div v-if="propietarioSeleccionado && !mascotaSeleccionada">
        <header class="form-header">
          <h1>Seleccionar Mascota</h1>
          <p>Paso 2 de 3: Elija una mascota de <strong>{{ propietarioSeleccionado.Nombre }} {{ propietarioSeleccionado.Apellido }}</strong></p>
        </header>
        <div v-if="mascotasStore.loading" class="loading-indicator">Cargando mascotas...</div>
        <div v-else-if="mascotasDelPropietario.length > 0" class="mascotas-list">
          <p>Haga clic en una mascota para generar su constancia:</p>
          <ul>
            <li v-for="mascota in mascotasDelPropietario" :key="mascota.Id" @click="seleccionarMascota(mascota)">
              <strong>{{ mascota.Nombre }}</strong> (Raza: {{ mascota.Raza }})
            </li>
          </ul>
        </div>
        <div v-else class="error-banner">Este propietario no tiene mascotas registradas.</div>
        <button type="button" @click="resetWizard" class="btn btn-secondary">Volver a buscar</button>
      </div>

      <!-- PASO 3: FORMULARIO DE CONSTANCIA -->
      <div v-if="mascotaSeleccionada">
        <header class="form-header">
            <h1>Registrar Constancia</h1>
            <p>Paso 3 de 3: Llene los datos para la mascota <strong>{{ mascotaSeleccionada.Nombre }}</strong></p>
        </header>
        <form @submit.prevent="onSubmit" class="vue-form">
            <div class="form-group">
                <label for="nombre">Nombre de la Constancia *</label>
                <input type="text" id="nombre" v-model="formData.nombre" required />
            </div>
            <div class="form-group">
                <label for="fechaEntrega">Fecha de Entrega *</label>
                <input type="date" id="fechaEntrega" v-model="formData.fechaEntrega" required />
            </div>
            <div class="form-group">
                <label for="responsable">Responsable</label>
                <input type="text" id="responsable" v-model="formData.responsable" />
            </div>
            <div class="form-group">
                <label for="direccion">Dirección</label>
                <input type="text" id="direccion" v-model="formData.direccion" />
            </div>
            <div class="form-group">
                <label for="barrioComunidad">Barrio / Comunidad</label>
                <input type="text" id="barrioComunidad" v-model="formData.barrioComunidad" />
            </div>
            <div class="form-group">
                <label for="claveCatastral">Clave Catastral</label>
                <input type="text" id="claveCatastral" v-model="formData.claveCatastral" />
            </div>
            <div class="form-group">
                <label for="cedula">Cédula del Responsable</label>
                <input type="text" id="cedula" v-model="formData.cedula" readonly />
            </div>
            <div class="form-actions">
                <button type="button" @click="resetWizard" class="btn btn-secondary">Cancelar y Empezar de Nuevo</button>
                <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
                    {{ isSubmitting ? 'Guardando...' : 'Guardar Constancia' }}
                </button>
            </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import { useUsuarioStore } from '../stores/usuario-store';
import { useMascotasStore } from '../stores/mascotasStore';
import { useConstanciaStore } from '../stores/constancia-store';

const usuarioStore = useUsuarioStore();
const mascotasStore = useMascotasStore();
const constanciaStore = useConstanciaStore();

const cedulaBusqueda = ref('');
const usuariosEncontrados = computed(() => usuarioStore.usuarios);
const propietarioSeleccionado = ref(null);
const mascotasDelPropietario = computed(() => mascotasStore.mascotas);
const mascotaSeleccionada = ref(null);
const isSubmitting = ref(false);
let debounceTimeout = null;

const initialFormData = {
  nombre: '',
  fechaEntrega: new Date().toISOString().split('T')[0],
  responsable: '',
  direccion: '',
  barrioComunidad: '',
  claveCatastral: '',
  cedula: ''
};

const formData = ref({ ...initialFormData });

const handleInput = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    if (cedulaBusqueda.value.trim()) {
      await usuarioStore.buscarUsuariosPorCedula(cedulaBusqueda.value);
    } else {
        usuarioStore.clearUsuarios();
    }
  }, 300);
};

const seleccionarPropietario = async (usuario) => {
  propietarioSeleccionado.value = usuario;
  await mascotasStore.fetchMascotasPorPropietario(usuario.Id);
};

const seleccionarMascota = (mascota) => {
  mascotaSeleccionada.value = mascota;
  const propietario = propietarioSeleccionado.value;
  formData.value.responsable = `${propietario.Nombre || ''} ${propietario.Apellido || ''}`.trim();
  formData.value.direccion = propietario.Direccion || '';
  // El barrio se deja en blanco para que el usuario lo llene, ya que no viene con los datos del propietario.
  formData.value.barrioComunidad = '';
  formData.value.cedula = propietario.Cedula || '';
};

// ==========================================================
// FUNCIÓN onSubmit CORREGIDA
// ==========================================================
const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      Nombre: formData.value.nombre,
      FechaEntrega: formData.value.fechaEntrega,
      Responsable: formData.value.responsable,
      Direccion: formData.value.direccion,
      BarrioComunidad: formData.value.barrioComunidad,
      ClaveCatastral: formData.value.claveCatastral,
      Cedula: formData.value.cedula,
    };
    
    await constanciaStore.createConstancia(mascotaSeleccionada.value.Id, payload);
    
    // FLUJO DE ÉXITO: Mostramos alerta y reiniciamos el asistente completo.
    await Swal.fire('¡Éxito!', 'La constancia ha sido creada.', 'success');
    resetWizard();

  } catch (error) {
    const errorMessage = constanciaStore.error || 'Ocurrió un error desconocido al guardar.';
    Swal.fire('Error', errorMessage, 'error');
    console.error("Error al guardar constancia:", error);
  } finally {
    isSubmitting.value = false;
  }
};


const resetWizard = () => {
    // Limpiar la búsqueda
    cedulaBusqueda.value = '';
    usuarioStore.clearUsuarios();

    // Limpiar las selecciones
    propietarioSeleccionado.value = null;
    mascotaSeleccionada.value = null;
    mascotasStore.clearMascotas();

    // Limpiar el formulario a su estado inicial
    formData.value = { ...initialFormData };
};
</script>

<style scoped>
.page-container { display: flex; justify-content: center; padding: 2rem; background-color: #f4f7f6; min-height: 100vh; }
.wizard-card { width: 100%; max-width: 800px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 2rem; }
.form-header { text-align: center; margin-bottom: 2rem; }
.form-header h1 { font-size: 1.75rem; font-weight: 600; color: #333; margin: 0; }
.form-header p { margin-top: 0.5rem; color: #666; }
.search-container { position: relative; }
.search-container input, .vue-form input { width: 100%; padding: 0.75rem; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box; font-size: 1rem; }
.search-results { position: absolute; background-color: white; border: 1px solid #ccc; width: 100%; max-height: 200px; overflow-y: auto; z-index: 10; }
.search-results ul, .mascotas-list ul { list-style: none; padding: 0; margin: 0; }
.search-results li, .mascotas-list li { padding: 12px; cursor: pointer; border-bottom: 1px solid #eee; }
.search-results li:hover, .mascotas-list li:hover { background-color: #f0f0f0; }
.mascotas-list { margin-top: 1rem; margin-bottom: 1rem; }
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
.btn { padding: 0.75rem 1.5rem; border: none; border-radius: 4px; font-size: 1rem; font-weight: 600; cursor: pointer; }
.btn-primary { background-color: #007bff; color: white; }
.btn-secondary { background-color: #6c757d; color: white; }
.loading-indicator, .error-banner, .loading-indicator-small { text-align: center; padding: 1rem; margin: 1rem 0; border-radius: 4px; }
.loading-indicator-small { font-style: italic; color: #666; }
.error-banner { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
</style>
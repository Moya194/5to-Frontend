import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiClient } from 'boot/axios';
import { useQuasar } from 'quasar';
import { AxiosError } from 'axios';

// Interfaz para los datos que se envían al crear una constancia
export interface ConstanciaPayload {
  nombre: string;
  fechaEntrega: string;
  responsable: string;
  direccion: string;
  barrioComunidad: string;
  claveCatastral: string;
  cedula: string;
}

// Interfaz para los datos de una constancia ya creada (que se muestra en la lista)
export interface Constancia {
  id: number;
  nombre: string;
  mascota?: { nombre: string }; // La mascota puede ser opcional
  responsable: string;
  fechaEntrega: string;
}

// Interfaz para el objeto de paginación de la QTable
export interface Pagination {
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
}

export const useConstanciaStore = defineStore('constancia', () => {
  const $q = useQuasar();
  const constancias = ref<Constancia[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<Pagination>({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
  });

  /**
   * Obtiene la lista de constancias desde la API con paginación.
   */
  async function fetchAllConstancias(props: { pagination: Pagination }) {
    const { page, rowsPerPage } = props.pagination;
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get('/constancias', {
        params: { page: page, pageSize: rowsPerPage },
      });

      if (response.data && Array.isArray(response.data.items)) {
        constancias.value = response.data.items;
        pagination.value.rowsNumber = response.data.total;
      } else if (Array.isArray(response.data)) {
        constancias.value = response.data;
        pagination.value.rowsNumber = response.data.length;
      } else {
        console.warn(
          'La respuesta de la API de constancias no tiene el formato esperado:',
          response.data
        );
        constancias.value = [];
      }

      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
    } catch (err) {
      error.value = 'No se pudieron cargar las constancias.';
      $q.notify({ type: 'negative', message: error.value });
      constancias.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Crea una nueva constancia para una mascota específica.
   */
  async function createConstancia(
    mascotaId: number,
    payload: ConstanciaPayload
  ) {
    loading.value = true;
    error.value = null;
    try {
      await apiClient.post(`/mascotas/${mascotaId}/constancias`, payload);
      $q.notify({ type: 'positive', message: 'Constancia creada con éxito.' });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value =
        axiosError.response?.data?.message || 'Error al crear la constancia.';
      $q.notify({
        type: 'negative',
        message: error.value ?? 'Ocurrió un error inesperado.',
      });
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Elimina una constancia por su ID.
   */
  async function deleteConstancia(id: number) {
    try {
      await apiClient.delete(`/constancias/${id}`);
      $q.notify({
        type: 'positive',
        message: 'Constancia eliminada con éxito.',
      });
      await fetchAllConstancias({ pagination: pagination.value });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value =
        axiosError.response?.data?.message ||
        'No se pudo eliminar la constancia.';
      $q.notify({ type: 'negative', message: error.value });
      throw new Error(error.value);
    }
  }

  return {
    constancias,
    loading,
    error,
    pagination,
    fetchAllConstancias,
    createConstancia,
    deleteConstancia,
  };
});

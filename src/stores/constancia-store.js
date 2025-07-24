// src/stores/constancia-store.js
import { defineStore } from 'pinia';
import constanciasService from '../services/constanciasService';

export const useConstanciaStore = defineStore('constancias', {
  state: () => ({
    constancias: [], 
    constanciaActual: null, // Guardará la constancia que se está viendo o editando
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * Busca una constancia por ID y la guarda en el estado.
     * Es ideal para las páginas de edición.
     * @param {string} id - El ID de la constancia a buscar.
     */
    async fetchConstancia(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await constanciasService.getConstanciaById(id);
        this.constanciaActual = response.data;
        return this.constanciaActual; // Devuelve el dato para que el componente lo use
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al obtener los datos de la constancia.';
        console.error(err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Llama al servicio para crear una nueva constancia.
     * @param {string} mascotaId - El ID de la mascota.
     * @param {object} constanciaData - El payload con los datos de la constancia.
     */
    async createConstancia(mascotaId, payload) {
      this.loading = true;
      this.error = null;
      try {
        await constanciasService.createConstanciaForMascota(mascotaId, payload);
      } catch (err) {
        // Capturamos el mensaje de error detallado del backend si existe
        this.error = err.response?.data?.title || err.response?.data?.message || 'Error al crear la constancia.';
        console.error(err);
        // Lanzamos el error para que el componente lo pueda atrapar y mostrarlo
        throw new Error(this.error); 
      } finally {
        this.loading = false;
      }
    },

    /**
     * Llama al servicio para actualizar una constancia.
     * @param {string} constanciaId - El ID de la constancia a actualizar.
     * @param {object} constanciaData - El payload con los nuevos datos.
     */
    async updateConstancia(constanciaId, constanciaData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await constanciasService.updateConstancia(constanciaId, constanciaData);
        this.constanciaActual = response.data; // Actualiza el estado con los nuevos datos
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al actualizar la constancia.';
        console.error(err);
        throw new Error(this.error); // Lanza el error para que el componente lo atrape
      } finally {
        this.loading = false;
      }
    },
    async fetchAllConstancias() {
      this.loading = true;
      this.error = null;
      try {
       const response = await constanciasService.getAllConstancias();
        this.constancias = response.data;
        return this.constancias;
      } catch (err) {
        this.error = 'Error al cargar el listado de constancias.';
        console.error(err);
      } finally {
        this.loading = false;
      }   
    },
    async deleteConstancia(id) {
      this.loading = true;
      this.error = null;
      try {
        await constanciasService.deleteConstanciaById(id);
        
        // ¡Éxito! Ahora actualizamos el estado local para reflejar el cambio.
        // Filtramos la lista, quedándonos solo con las constancias que NO tienen el ID eliminado.
        this.constancias = this.constancias.filter(c => c.Id !== id);

      } catch (err) {
        this.error = 'Error al eliminar la constancia.';
        console.error(err);
        // Lanzamos el error para que el componente lo pueda atrapar si es necesario
        throw new Error(this.error); 
      } finally {
        this.loading = false;
      }
    },

    /**
     * Limpia los datos de la constancia actual del estado.
     * Es útil llamar a esta acción cuando el componente se desmonta.
     */
    clearCurrentConstancia() {
      this.constanciaActual = null;
    },
  },
});
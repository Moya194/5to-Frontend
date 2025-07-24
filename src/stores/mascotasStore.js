import { defineStore } from 'pinia';
// Asumo que tienes un mascotasService que habla con la API
import mascotasService from '../services/mascotasService';

export const useMascotasStore = defineStore('mascotas', {
  state: () => ({
    mascotaActual: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMascota(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await mascotasService.getMascota(id);
        // Asumo que tu API devuelve la mascota con un objeto 'propietario' anidado
        this.mascotaActual = response.data;
        return this.mascotaActual;
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al obtener los datos de la mascota.';
        console.error(err);
        return null;
      } finally {
        this.loading = false;
      }
    },
    async fetchMascotasPorPropietario(usuarioId) { // <-- 1. Ahora recibe el ID numérico
      this.loading = true;
      this.error = null;
      this.mascotas = [];
      try {
        // 2. Llama al nuevo método del servicio
        const response = await mascotasService.getMascotasPorUsuarioId(usuarioId);
        this.mascotas = response.data;
      } catch (err) {
        this.error = 'No se encontraron mascotas para este usuario.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },  

    clearCurrentMascota() {
      this.mascotaActual = null;
    },
  },
});
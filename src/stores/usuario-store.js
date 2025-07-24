import { defineStore } from 'pinia';
import userApiClient from '../services/userApi'; // <-- 1. Usa el nuevo cliente API

export const useUsuarioStore = defineStore('usuarios', {
  state: () => ({
    usuarios: [],
    loading: false,
    error: null,
  }),
  actions: {
    async buscarUsuariosPorCedula(cedula) {
      this.loading = true;
      this.error = null;
      try {
        // 2. Llama al endpoint correcto de tu API: /api/usuarios/:cedula
        const response = await userApiClient.get(`/usuarios/${cedula}`);
        this.usuarios = response.data;
      } catch (err) {
        this.error = 'Error al buscar usuarios.';
        this.usuarios = []; // Limpiar la lista en caso de error
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    clearUsuarios() {
    this.usuarios = [];
},
  },
});

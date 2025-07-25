// src/stores/usuario-store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';

// 1. Definimos la interfaz para un objeto Usuario
export interface Usuario {
  Id: number;
  Nombre: string;
  Apellido: string;
  Cedula: string;
  Telefo: string;
  Direccion: string;
  // Agrega aquí otras propiedades que pueda tener un usuario
}

export const useUsuarioStore = defineStore('usuario', () => {
  // 2. Especificamos que 'usuarios' es un array de 'Usuario'
  const usuarios = ref<Usuario[]>([]);
  const loading = ref(false);

  async function buscarUsuariosPorCedula(cedula: string) {
    loading.value = true;
    try {
      const response = await api.get<Usuario[]>(`/usuarios/${cedula}`); // Opcional: tipar la respuesta de la API
      usuarios.value = Array.isArray(response.data)
        ? response.data
        : [response.data];
    } catch (error) {
      console.error(error);
      usuarios.value = [];
    } finally {
      loading.value = false;
    }
  }

  function clearUsuarios() {
    usuarios.value = [];
  }

  return { usuarios, loading, buscarUsuariosPorCedula, clearUsuarios };
});

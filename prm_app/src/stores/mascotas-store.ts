// src/stores/mascotas-store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiClient } from 'boot/axios';

// Definimos la "forma" de una mascota, incluyendo su ID
export interface Mascota {
  id: number; // <-- ¡Esto es crucial!
  nombre: string;
  raza: string;
  // Agrega aquí cualquier otra propiedad
}

export const useMascotasStore = defineStore('mascotas', () => {
  const mascotas = ref<Mascota[]>([]);
  const loading = ref(false);

  async function fetchMascotasPorPropietario(cedulaPropietario: string) {
    loading.value = true;
    mascotas.value = [];
    try {
      const response = await apiClient.get<Mascota[]>(
        `/mascotas/${cedulaPropietario}`
      );
      mascotas.value = response.data;
    } catch (error) {
      console.error('Error al obtener las mascotas del propietario:', error);
    } finally {
      loading.value = false;
    }
  }

  function clearMascotas() {
    mascotas.value = [];
  }

  return { mascotas, loading, fetchMascotasPorPropietario, clearMascotas };
});

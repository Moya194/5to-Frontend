import { defineStore } from 'pinia';
import { api } from 'boot/axios'; // Suponiendo que tienes un archivo boot/axios.js

interface ConstanciaRegistro {
  id: string;
  mascota: string;
  cedula: string;
  barrio: string;
  direccion: string;
  fecha: string;
  clave: string;
  registrado: string;
  // Agrega las propiedades adicionales que necesites
}

export const useConstanciaRegistroStore = defineStore('constanciaRegistro', {
  state: () => ({
    constanciaRegistros: [] as ConstanciaRegistro[],
    isLoading: false,
    error: null as string | null,
  }),
  getters: {
    getConstanciaRegistros: (state) => state.constanciaRegistros,
  },
  actions: {
    async fetchConstanciaRegistros() {
      this.isLoading = true;
      try {
        const response = await api.get('/api/Mascotas/constanciaregistro'); // Utiliza la instancia de axios
        this.constanciaRegistros = response.data;
      } catch (error) {
        this.error = 'Error fetching constancia registros';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async createConstanciaRegistro(constanciaRegistro: ConstanciaRegistro) {
      this.isLoading = true;
      try {
        const response = await api.post('/api/Mascotas/constanciaregistro', constanciaRegistro);
        this.constanciaRegistros.push(response.data);
      } catch (error) {
        this.error = 'Error creating constancia registro';
        console.error(error); // Agregar console.error para debugging
      } finally {
        this.isLoading = false;
      }
    },
    async getConstanciaRegistroById(id: string) {
      this.isLoading = true;
      try {
        const response = await api.get(`/api/Mascotas/constanciaregistro/${id}`);
        return response.data;
      } catch (error) {
        this.error = 'Error fetching constancia registro';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async updateConstanciaRegistro(id: string, constanciaRegistro: ConstanciaRegistro) {
      this.isLoading = true;
      try {
        const response = await api.put(`/api/Mascotas/constanciaregistro/${id}`, constanciaRegistro);
        const index = this.constanciaRegistros.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.constanciaRegistros[index] = response.data;
        }
      } catch (error) {
        this.error = 'Error updating constancia registro';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteConstanciaRegistro(id: string) {
      this.isLoading = true;
      try {
        await api.delete(`/api/Mascotas/constanciaregistro/${id}`);
        this.constanciaRegistros = this.constanciaRegistros.filter((c) => c.id !== id);
      } catch (error) {
        this.error = 'Error deleting constancia registro';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
import { defineStore } from 'pinia';

export const useDatosGenerales = defineStore('formDatosGenerales', {
  state: () => ({
    nombre: '',
    telefono_fijo: '',
    cedula: '',
    // fecha: '',
    telefono: '',
    telefonoFijo: '',
    correo: '',
    ocupacion: '',
    apellido: '',
    direccion: '',
    zona: '',
  }),

  getters: {},
  actions: {},
});

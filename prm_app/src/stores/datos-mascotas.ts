import { defineStore } from 'pinia';
export const useDatosMascotas = defineStore('formDatosMascotas', {
  state: () => ({
    nombreMascotas: '',
    especie: '',
    colorMascotas: '',
    fechaNacimiento: '',
    sexo: '',
    edad: '',
    descripcion: '',
    raza: '',
    habitat: '',
    alimento: '',
    otroAlimento: '',
    obtencion: '',
    tenencia: '',
    reproductivo: '',
    defuncion: '',
    fechaDefuncion: '',
    motivoDefuncion: '',
  }),

  getters: {},
  actions: {},
});

import { defineStore } from 'pinia';

export const useAnalistaFauna = defineStore('analistaFauna', {
  state: () => ({
    mascota: '',
    cedula: '',
    barrio: '',
    direccion: '',
    fecha: '',
    clave: '',
    registrado: '',
  }),
  actions: {
    // setDatos(datos) {
    //   this.mascota = datos.mascota;
    //   this.cedula = datos.cedula;
    //   this.barrio = datos.barrio;
    //   this.direccion = datos.direccion;
    //   this.fecha = datos.fecha;
    //   this.clave = datos.clave;
    //   this.registrado = datos.registrado;
    // }
  }
});
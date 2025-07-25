import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
export const useFormulariosControl = defineStore('formulariosControl', {
  state: () => ({
    DatosGenerales: null,
    DatosMascotas: null,
    VacunacionMascotas: null,
    AnalistaFau: null,
  }),
  getters: {
    // getters vacíos por ahora
  },
  actions: {
    setDatosGenerales(DatosGenerales: any) {
      this.DatosGenerales = DatosGenerales;
    },
    setDatosMascotas(DatosMascotas: any) {
      this.DatosMascotas = DatosMascotas;
    },
    setVacunacionMascota(VacunacionMascota: any) {
      this.VacunacionMascotas = VacunacionMascota;
    },
    setAnalistaFau(AnalistaFau: any) {
      this.AnalistaFau = AnalistaFau;
    },

    guardarInformacionEnLocalStorage() {
      const listaFormularios: any = LocalStorage.getItem('Formulario') || [];

      const nuevaFormularios = {
        DatosGenerales: this.DatosGenerales,
        DatosMascotas: this.DatosMascotas,
        VacunacionMascotas: this.VacunacionMascotas,
        AnalistaFau: this.AnalistaFau,
      };
      listaFormularios.push(nuevaFormularios);
      localStorage.set('Formulario', listaFormularios);
    },
  },
});

export interface IMascotas {
  idMascotas: string;
  nombreMascotas: string;
  colorMascotas: string;
  especie: string;
  fechaNaciemiento: Date;
  sexo: string;
  edad: number;
  descripcion: string;
  raza: string;
  habitat: string;
  alimento: string;
  otroAlimento: string;
  obtencion: string;
  tenencia: string;
  reproductivo: string;
  defuncion: {
    idDefuncion: string;
    fechaDefuncion: string;
    motivoDefuncion: string;
  };
}
export interface IVacuna {
  idVacuna: string;
  vacunacion: string;
  observacion: string;
  vacunas: string;
}
export interface Iowner {
  DatosGenerales: {
    id: string;
    nombre: string;
    apellidos: string;
    direccion: string;
    ocupacion: string;
    cedula: string;
    telefono: number;
    telefonoFijo: number;
    zona: string;
    correo: string;
    mascotas: IMascotas[];
    vacuna: IVacuna[];
  };
}
export interface IownerModel extends Iowner {
  idUsuarios: string;
  idAnalistaFauna: string;
}

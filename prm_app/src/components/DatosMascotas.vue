<template>
  <q-page>
    <q-form
      @submit="formDatosMascotasSubmit"
      class="row"
      id="FormularioMascotas"
      @validation-error="(ref: any) =>ref.$el.scrollIntoView({ block: 'center', behavior: 'smooth' })"
    >
      <div class="col-6 q-mx-auto">
        <div class="text-weight-bolder text-h5">
          Datos Generales de la Mascota
        </div>
        <q-input
          type="text"
          v-model="datosMascotasStore.nombreMascotas"
          label="Nombre de la mascota"
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Coloque el nombre de la mascota',
            (val) =>
              /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ ]+$/.test(val) ||
              'Caracteres incorrectos (números o signos)',
          ]"
          class="col-12"
          ref="nombreRef"
        />
        <q-input
          type="text"
          v-model="datosMascotasStore.colorMascotas"
          label="Color del animal de compañia"
          class="col-12"
          ref="colorRef"
        />

        <q-select
          v-model="datosMascotasStore.especie"
          :options="optionsEspecie"
          label="Tipo del animal de compañia"
          emit-value
          map-options
          class="col-12"
          ref="especieRef"
        />
        <q-input
          type="date"
          v-model="datosMascotasStore.fechaNacimiento"
          label="Fecha de nacimiento"
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Coloque la fecha de nacimiento',
          ]"
          class="col-12 fecha-input"
          ref="fechaNacimientoRef"
        />
        <q-select
          v-model="datosMascotasStore.sexo"
          :options="optionsSexo"
          label="Genero del animal de compañia"
          emit-value
          map-options
          class="col-12"
          ref="sexoRef"
        />
        <q-input
          v-model="datosMascotasStore.edad"
          type="number"
          label="Edad del animal de compañia"
          class="col-12"
          ref="edadRef"
        />
        <q-input
          v-model="datosMascotasStore.descripcion"
          type="text"
          label="Descripción del animal de compañia"
          class="col-12"
          ref="descripcionRef"
        />
        <q-select
          v-model="datosMascotasStore.raza"
          :options="optionsRaza"
          label="Raza del animal de compañia"
          emit-value
          map-options
          class="col-12"
          ref="razaRef"
        />
        <q-select
          v-model="datosMascotasStore.habitat"
          :options="optionsHabitat"
          label="Habitat del animal de compañia"
          emit-value
          map-options
          class="col-12"
          ref="habitatRef"
        />
        <q-select
          v-model="datosMascotasStore.alimento"
          :options="optionsAlimento"
          label="Alimento del animal de compañia"
          emit-value
          map-options
          class="col-12"
          ref="alimentoRef"
        />
        <q-input
          v-if="datosMascotasStore.alimento === 'Otros'"
          v-model="datosMascotasStore.otroAlimento"
          label="Otros Alimentos"
          class="col-12"
          ref="otroAlimentoRef"
        />
        <q-select
          v-model="datosMascotasStore.obtencion"
          :options="optionsObtencion"
          label="Modo de obtención del animal de compañia"
          emit-value
          map-options
          class="col-12"
          ref="obtencionRef"
        />
        <p v-if="datosMascotasStore.obtencion !== ''">
          Seleccione "recogido" o "reubicado", si su mascota fue adoptada.
        </p>
        <q-select
          v-model="datosMascotasStore.tenencia"
          :options="optionsTenencia"
          label="Razón de Tenencia"
          emit-value
          map-options
          class="col-12"
          ref="tenenciaRef"
        />
        <q-select
          v-model="datosMascotasStore.reproductivo"
          :options="optionsReproductivo"
          label="Estado Reproductivo"
          emit-value
          map-options
          class="col-12"
          ref="reproductivoRef"
        />
        <p v-if="datosMascotasStore.obtencion !== ''">
          Entero: se refiere a que la mascota no ha sido esterilizada y puede
          reproducirse.
        </p>
        <q-select
          v-model="datosMascotasStore.defuncion"
          :options="optionsdefuncion"
          label="Tiene motivo de defuncion"
          emit-value
          map-options
          class="col-12"
          ref="defuncionRef"
        />
        <div v-if="datosMascotasStore.defuncion === 'Si'">
          <q-input
            v-model="datosMascotasStore.fechaDefuncion"
            type="date"
            label="Fecha de defunción"
            class="col-12"
            ref="fechaDefuncionRef"
          />
          <q-input
            v-model="datosMascotasStore.motivoDefuncion"
            type="text"
            label="Motivo de defunción"
            class="col-12"
            ref="motivoDefuncionRef"
          />
        </div>
        <td></td>
        <q-btn
          @click="formDatosMascotasSubmit"
          label="Continuar"
          color="primary"
          class="col-1 botton"
        />
      </div>
    </q-form>
  </q-page>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
// import { collection, addDoc } from 'firebase/firestore';
// import { db } from 'boot/firebase';
import { useQuasar } from 'quasar';
import { useDatosMascotas } from 'src/stores/datos-mascotas';
import { useFormulariosControl } from 'src/stores/formularios-control';
const emit = defineEmits(['submit']);
const $q = useQuasar();
const formulariosControl = useFormulariosControl();
const datosMascotasStore = useDatosMascotas();
const optionsEspecie = ref([
  { label: 'Gato', value: 'gato' },
  { label: 'Perro', value: 'perro' },
]);
const optionsSexo = ['Macho', 'Hembra'];
const optionsRaza = computed(() => {
  if (datosMascotasStore.especie === 'gato') {
    return [
      { label: 'Siamés', value: 'siames' },
      { label: 'Persa', value: 'persa' },
      { label: 'Maine Coon', value: 'Maine-Coon' },
      { label: 'Bengalí', value: 'bengalí' },
      { label: 'Sphynx', value: 'Sphynx' },
      { label: 'Ragdoll', value: 'Ragdoll' },
      { label: 'British Shorthair', value: 'British-Shorthair' },
      { label: 'Scottish Fold', value: 'Scottish-Fold' },
      { label: 'Sphinx', value: 'Sphinx' },
      { label: 'Angora Turco', value: 'Angora-Turco' },
      { label: 'Azul Ruso', value: 'Azul-Ruso' },
      { label: 'Somali', value: 'Somali' },
      { label: 'Manx', value: 'Manx' },
      { label: 'American Curl', value: 'American-Curl' },
      { label: 'Munchkin', value: 'Munchkin' },
      { label: 'Oriental', value: 'Oriental' },
      { label: 'Bombay', value: 'Bombay' },
      { label: 'Burmés', value: 'Burmes' },
      { label: 'Siamés Oriental', value: 'Siames-Oriental' },
      { label: 'Savannah', value: 'Savannah' },
    ];
  } else if (datosMascotasStore.especie === 'perro') {
    return [
      { label: 'Labrador Retriever', value: 'Labrador-Retriever' },
      { label: 'Pastor Alemán', value: 'pastor-aleman' },
      { label: 'Bulldog Francés', value: 'Bulldog-Francés' },
      { label: 'Caniche (Poodle)', value: 'Caniche-(Poodle)' },
      { label: ' Beagle', value: ' Beagle' },
      { label: 'Golden Retriever', value: 'golden-retriever' },
      { label: 'Rottweiler', value: 'Rottweiler' },
      { label: 'Boxer', value: 'Boxer' },
      { label: 'Yorkshire Terrier', value: 'Yorkshire-Terrier' },
      { label: 'Dálmata', value: 'Dálmata' },
      { label: 'Husky Siberiano', value: 'Husky-Siberiano' },
      { label: 'Pomerania', value: 'Pomerania' },
      { label: 'Border Collie', value: 'Border-Collie' },
      { label: 'Chihuahua', value: 'Chihuahua' },
      { label: 'Dachshund (Teckel)', value: 'Dachshund-(Teckel)' },
      { label: 'Bulldog Inglés', value: 'Bulldog-Inglés' },
      { label: 'Dóberman', value: 'Dóberman' },
      { label: 'Shih Tzu', value: 'Shih-Tzu' },
      { label: 'Australian Shepherd', value: 'Australian-Shepherd' },
      { label: 'Bichón Frisé', value: 'Bichón-Frisé' },
      { label: 'Mestizo', value: 'Mestizo' },
    ];
  } else {
    return [];
  }
});
const optionsAlimento = [
  { label: 'Balanceado', value: 'balanceado' },
  { label: 'Mixta', value: 'mixta' },
  { label: 'Comida casera', value: 'comidacasera' },
  { label: 'Otros', value: 'Otros' },
];
const optionsHabitat = ['Casa', 'Finca', 'Lote', 'Taller'];
const optionsObtencion = [
  'Recogido',
  'Regalado',
  'Comprado',
  'Reubicado',
  'Nacido en casa',
];
const optionsTenencia = [
  'Asistencia',
  'Compañia',
  'Reproduccion',
  'Terapia',
  'Seguridad',
];
const optionsReproductivo = [
  'Esterilizado',
  'En gestacion',
  'Entero',
  'Lactancia',
];
const optionsdefuncion = ['Si', 'No'];
function formDatosMascotasSubmit() {
  if (datosMascotasStore.nombreMascotas.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }
  if (datosMascotasStore.especie.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }
  if (datosMascotasStore.colorMascotas.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }
  if (datosMascotasStore.fechaNacimiento.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }
  if (datosMascotasStore.sexo.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }
  if (datosMascotasStore.edad.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }
  if (datosMascotasStore.descripcion.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }
  if (datosMascotasStore.raza.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }
  if (datosMascotasStore.habitat.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }
  if (datosMascotasStore.alimento.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }

  if (datosMascotasStore.obtencion.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }
  if (datosMascotasStore.tenencia.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }
  if (datosMascotasStore.reproductivo.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }
  if (datosMascotasStore.defuncion.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'write',
      icon: 'warning',
      message: 'No dejes el campo en blanco',
    });
  }

  formulariosControl.setDatosGenerales(datosMascotasStore.$state);
  emit('submit', true);
  formulariosControl.guardarInformacionEnLocalStorage();
}
//  const datosMascotasStore = ref({
//   nombre: '',
//   color: '',
//   especie: '',
//   fechaNacimiento: '',
//   sexo: '',
//   edad: '',
//   descripcion: '',
//   raza:'',
//   habitat:'',
//   alimento:'',
//   otroAlimento:'',
//   obtencion:'',
//   tenencia:'',
//   reproductivo:'',
//   defuncion:'',
//   fechaDefuncion:'',
//   motivoDefuncion:'',
// });
// const nombreRef = ref(null);
// const colorRef = ref(null);
// const especieRef = ref(null);
// const fechaNacimientoRef = ref(null);
// const sexoRef = ref(null);
// const edadRef = ref(null);
// const descripcionRef = ref(null);
// const razaRef = ref(null);
// const habitatRef= ref(null);
// const alimentoRef = ref(null);
// const otroAlimentoRef = ref(null);
// const obtencionRef = ref(null);
// const tenenciaRef = ref(null);
// const reproductivoRef= ref(null);
// const defuncionRef= ref(null);
// const fechaDefuncionRef=ref(null);
// const motivoDefuncionRef=ref(null);
// async function agregarMascota (){
//   if (
//     !nuevaMascota.value.nombre ||
//     !nuevaMascota.value.color ||
//     !nuevaMascota.value.especie ||
//     !nuevaMascota.value.fechaNacimiento ||
//     !nuevaMascota.value.sexo ||
//     !nuevaMascota.value.descripcion ||
//     !nuevaMascota.value.raza ||
//     !nuevaMascota.value.habitat ||
//     !nuevaMascota.value.alimento ||
//     !nuevaMascota.value.otroAlimento ||
//     !nuevaMascota.value.obtencion ||
//     !nuevaMascota.value.tenencia ||
//     !nuevaMascota.value.reproductivo ||
//     !nuevaMascota.value.defuncion ||
//     !nuevaMascota.value.fechaDefuncion ||
//     !nuevaMascota.value.motivoDefuncion
//   ) {
//     // Mostrar notificación de error
//     $q.notify({
//       type: 'negative',
//       message: 'Por favor, complete todos los campos antes de continuar.',
//     });
//     return;
//   }
//   console.log('MascotaRegistrada')
//   try{
//     const docRef = await addDoc(collection(db, 'mascotas'),nuevaMascota.value);
//     console.log('Document written with id ',docRef.id);
//   } catch (error) {
//     console.error('error adding document',error);
//   }
//   emit('submit', true);
// }
</script>
<style scoped>
.botton {
  padding: 10px 20px;
  margin-top: 20px;
}
</style>

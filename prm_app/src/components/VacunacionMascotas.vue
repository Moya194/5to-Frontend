<template>
  <q-page>
    <q-form
      @submit="formVacunacionSubmit"
      class="row"
      id="FormularioDatosMascotas"
      @validation-error="(ref: any) =>ref.$el.scrollIntoView({ block: 'center', behavior: 'smooth' })"
    >
      <div class="col-6 q-mx-auto">
        <div class="text-weight-bolder text-h5">
          Datos de la vacunacion de las Mascotas
        </div>
        <q-select
          v-model="vacunacionstore.vacunacion"
          :options="optionsvacunacion"
          label="Cuantas vacunas tienen"
          ref="vacunacionRef"
          emit-value
          map-options
          class="col-12"
        />
        <q-input
          v-if="vacunacionstore.vacunacion === 'Otros'"
          v-model="vacunacionstore.vacunas"
          label="Otras Vacunas"
          class="col-12"
          ref="vacunasRef"
        />
        <p v-if="datosMascotasStore.obtencion !== ''">
          *PVC: Se refiere a la vacuna contra el "Parvovirus Canino".
        </p>
        <q-input
          type="text"
          v-model="vacunacionstore.observacion"
          ref="observacionRef"
          placeholder="Observaciones"
        />
        <tr></tr>
        <q-btn
          @click="formVacunacionSubmit"
          label="Continuar"
          color="primary"
          class="col-12"
        />
      </div>
    </q-form>
  </q-page>
</template>
<script setup lang="ts">
import { useVacunacionMascota } from 'src/stores/vacunacion-mascota';
import { useDatosMascotas } from 'src/stores/datos-mascotas';
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
// import {db} from 'boot/firebase';
// import nuevaMascota from 'src/components/DatosMascotas.vue'
// import {collection, addDoc} from 'firebase/firestore';

const datosMascotasStore = useDatosMascotas();
const $q = useQuasar();
const vacunacionstore = useVacunacionMascota();

const optionsvacunacion = computed(() => {
  if (datosMascotasStore.especie === 'perro') {
    return [
      { label: 'No tiene', value: 'no-tiene' },
      { label: 'Rabia', value: 'rabia' },
      { label: 'Tripe', value: 'tripe' },
      { label: 'Pvc', value: 'pvc' },
      { label: 'Distemper', value: 'Distemper' },
      {
        label: 'Adenovirus canino tipo 1 y tipo 2 ',
        value: 'Adenovirus-canino-tipo-1-y-tipo-2',
      },
      { label: 'Traqueo bronquitis', value: 'La-Tos-de-las-perreras' },
      { label: 'Leptospirosis', value: 'Leptospirosis' },
      { label: 'Otros', value: 'Otros' },
    ];
  } else if (datosMascotasStore.especie === 'gato') {
    return [
      { label: 'No tiene', value: 'no-tiene' },
      { label: 'Rabia', value: 'rabia' },
      { label: 'Parvovirus', value: 'Parvovirus' },
      { label: 'Rinotraqueítis', value: 'Rinotraqueítis' },
      { label: 'Calicivirus', value: 'Calicivirus' },
      { label: 'Leucemia', value: 'Leucemia' },
      { label: 'Clamidia', value: 'Clamidia' },
      { label: 'Tripe', value: 'tripe' },
      { label: 'Otros', value: 'Otros' },
    ];
  } else {
    return [];
  }
});
function formVacunacionSubmit() {
  if (vacunacionstore.vacunacion.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'no Dejes el campo en blanco',
    });
  }
  if (vacunacionstore.observacion.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'no Dejes el campo en blanco',
    });
  }
  if (vacunacionstore.vacunas.length == 0) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'no Dejes el campo en blanco',
    });
  }
}

// const nuevaVacuna =ref({
//   vacunacion:'',
//   vacunas:'',
//   observacion:'',

// })
// const vacunacionRef=(null)
// const vacunasRef=(null)
// const observacionRef=(null)

// async function agregarVacunas (){
//   console.log('Vacunado')
//   try{
//     const docRef = await addDoc(collection(db, 'vacunas'),nuevaVacuna.value);
//     console.log('Document written with id ',docRef.id);
//   } catch (error) {
//     console.error('error adding document',error);
//   }}
</script>
<style scoped>
.botton {
  padding: 10px 20px;
  margin-top: 20px;
}
</style>

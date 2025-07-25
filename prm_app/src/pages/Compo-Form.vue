<template>
  <q-page class="bg-white text-center">
    <div class="text-weight-bolder text-h4">
      FORMULARIO DE REGISTRO DE MASCOTAS
    </div>
    <q-btn label="regresar" @click="goBack" class="q-mb-md" color="primary" />
    <DatosGenerales v-if="datosGeneralesf" @submit="datosGeneralesForm" />
    <DatosMascotas v-if="datosMascotasf" @submit="datosMascotasForm" />
    <VacunacionMascotas
      v-if="vacunacionMascotasf"
      @submit="vacunacionMascotasForm"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import DatosGenerales from 'src/components/DatosGenerales.vue';
import DatosMascotas from 'src/components/DatosMascotas.vue';
import VacunacionMascotas from 'src/components/VacunacionMascotas.vue';

const $q = useQuasar();
const datosGeneralesf = ref<boolean>(true);
const datosMascotasf = ref<boolean>(false);
const vacunacionMascotasf = ref<boolean>(false);

function datosGeneralesForm($ev: boolean) {
  datosGeneralesf.value = !datosGeneralesf.value;
  datosMascotasf.value = !datosMascotasf.value;
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

function datosMascotasForm($ev: boolean) {
  datosMascotasf.value = !datosMascotasf.value;
  vacunacionMascotasf.value = !vacunacionMascotasf.value;
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

function vacunacionMascotasForm($ev: boolean) {
  if ($ev) {
    $q.dialog({
      title: 'Confirmación',
      message: 'Mascota agregada correctamente',
    })
      .onOk(() => {
        window.location.reload();
      })

      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
        window.location.reload();
      });
  }
}

function goBack() {
  if (vacunacionMascotasf.value) {
    vacunacionMascotasf.value = !vacunacionMascotasf.value;
    datosMascotasf.value = !datosMascotasf.value;
  } else if (datosMascotasf.value) {
    datosMascotasf.value = !datosMascotasf.value;
    datosGeneralesf.value = !datosGeneralesf.value;
  }
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}
</script>

<template>
  <q-page>
    <q-form class="row" id="FormularioDatosGenerales">
      <div class="col-6 q-mx-auto">
        <q-input
          type="text"
          v-model="nuevoRegistro.tutor"
          label="Tutor/a del animal de compañia:"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Coloque el nombre de la dueña/o',
            (val) => /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ ]+$/.test(val) || 'Caracteres incorrectos (números o signos)',
          ]"
          class="col-12"
          ref="tutorRef"
        />
        <q-input
          type="text"
          v-model="nuevoRegistro.cedula"
          label="Número de Cedula:"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Coloque su Cédula',
            (val) => /^\d+$/.test(val) || 'Ingrese solo números',
            (val) => val.length == 10 || 'Cédula debe contener 10 números',
          ]"
          class="col-12"
          ref="cedulaRef"
        />
        <q-input
          type="text"
          v-model="nuevoRegistro.barrio"
          label="Barrio o Comunidad:"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Coloque el nombre',
            (val) => /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ ]+$/.test(val) || 'Caracteres incorrectos (números o signos)',
          ]"
          class="col-12"
          ref="barrioRef"
        />
        <q-input
          type="text"
          v-model="nuevoRegistro.direccion"
          label="Dirección:"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Coloque la dirección',
          ]"
          class="col-12"
          ref="direccionRef"
        />
        <q-input
          type="date"
          v-model="nuevoRegistro.fecha"
          label="Fecha"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Coloque la fecha de nacimiento',
          ]"
          class="col-12 fecha-input"
          ref="fechaRef"
        />
        <q-input
          type="text"
          v-model="nuevoRegistro.catastro"
          label="Clave Catastral:"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Coloque la clave catastral',
            (val) => /^[0-9]+$/.test(val) || 'Ingrese solo números',
          ]"
          class="col-12"
          ref="catastroRef"
        />
        <q-input
          type="text"
          v-model="nuevoRegistro.regispor"
          label="Registrado por:"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Coloque el nombre',
            (val) => /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ ]+$/.test(val) || 'Caracteres incorrectos (números o signos)',
          ]"
          class="col-12"
          ref="regisporRef"
        />
        <q-btn @click="agregarConstancia" label="Continuar" color="primary" class="col-12 botton" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { collection, addDoc } from 'firebase/firestore';
import { db } from 'boot/firebase';

// Define el estado inicial para un nuevo registro
const nuevoRegistro = ref({
  tutor: '',
  cedula: '',
  barrio: '',
  direccion: '',
  fecha: '',
  catastro: '',
  regispor: '',
});

const tutorRef = ref(null);
const cedulaRef = ref(null);
const barrioRef = ref(null);
const direccionRef = ref(null);
const fechaRef = ref(null);
const catastroRef = ref(null);
const regisporRef = ref(null);

const $q = useQuasar();

async function agregarConstancia() {
  // Verificar si todos los campos están llenos
  if (
    !nuevoRegistro.value.tutor ||
    !nuevoRegistro.value.cedula ||
    !nuevoRegistro.value.barrio ||
    !nuevoRegistro.value.direccion ||
    !nuevoRegistro.value.fecha ||
    !nuevoRegistro.value.catastro ||
    !nuevoRegistro.value.regispor
  ) {
    // Mostrar notificación de error
    $q.notify({
      type: 'negative',
      message: 'Por favor, complete todos los campos antes de continuar.',
    });
    return;
  }

  try {
    // Añadir el documento a Firebase
    const docRef = await addDoc(collection(db, 'constancia'), nuevoRegistro.value);
    console.log('Documento escrito con ID: ', docRef.id);

    // Mostrar notificación de éxito
    $q.notify({
      type: 'positive',
      message: 'Registro guardado exitosamente!',
    });

    // Reiniciar el formulario
    reiniciarFormulario();
  } catch (error) {
    console.error('Error al añadir el documento: ', error);
    // Mostrar notificación de error
    $q.notify({
      type: 'negative',
      message: 'Hubo un error al guardar el registro.',
    });
  }
}

// Función para reiniciar el formulario
function reiniciarFormulario() {
  nuevoRegistro.value = {
    tutor: '',
    cedula: '',
    barrio: '',
    direccion: '',
    fecha: '',
    catastro: '',
    regispor: '',
  };
}
</script>

<style scoped>
.botton {
  padding: 10px 20px;
  margin-top: 20px;
}
</style>

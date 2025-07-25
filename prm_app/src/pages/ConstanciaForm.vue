<template>
  <q-page padding>
    <div class="q-mx-auto" style="max-width: 800px">
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
        flat
        bordered
      >
        <q-step
          :name="1"
          title="Buscar Propietario"
          icon="search"
          :done="step > 1"
        >
          <p class="text-subtitle1">
            Busque y seleccione el propietario por su Cédula.
          </p>
          <q-select
            filled
            v-model="propietarioSeleccionado"
            use-input
            hide-selected
            fill-input
            input-debounce="500"
            label="Buscar por Cédula o Nombre"
            :options="usuarioStore.usuarios"
            @filter="buscarUsuario"
            option-value="Id"
            option-label="Cedula"
            :loading="usuarioStore.loading"
            @update:model-value="seleccionarPropietario"
          >
            <template v-slot:no-option>
              <q-item
                ><q-item-section class="text-grey"
                  >No se encontraron resultados.</q-item-section
                ></q-item
              >
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label
                    >{{ scope.opt.Nombre }}
                    {{ scope.opt.Apellido }}</q-item-label
                  >
                  <q-item-label caption
                    >Cédula: {{ scope.opt.Cedula }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-step>

        <q-step
          :name="2"
          title="Seleccionar Mascota"
          icon="pets"
          :done="step > 2"
        >
          <p v-if="propietarioSeleccionado" class="text-subtitle1">
            Elija una mascota de
            <span class="text-weight-bold">{{
              propietarioSeleccionado.Nombre
            }}</span
            >.
          </p>
          <q-inner-loading :showing="mascotasStore.loading">
            <q-spinner-dots size="50px" color="primary" />
          </q-inner-loading>

          <q-list
            v-if="!mascotasStore.loading && mascotasStore.mascotas.length"
            bordered
            separator
          >
            <q-item
              v-for="mascota in mascotasStore.mascotas"
              :key="mascota.id"
              clickable
              v-ripple
              @click="seleccionarMascota(mascota)"
            >
              <q-item-section>
                <q-item-label>{{ mascota.nombre }}</q-item-label>
                <q-item-label caption>Raza: {{ mascota.raza }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>
          </q-list>
          <div
            v-if="!mascotasStore.loading && !mascotasStore.mascotas.length"
            class="text-grey text-center q-pa-md"
          >
            Este propietario no tiene mascotas registradas.
          </div>
        </q-step>

        <q-step :name="3" title="Datos de la Constancia" icon="description">
          <p v-if="mascotaSeleccionada" class="text-subtitle1">
            Llene los datos para la mascota
            <span class="text-weight-bold">{{
              mascotaSeleccionada.nombre
            }}</span
            >.
          </p>
          <q-form @submit="onSubmit" class="q-gutter-y-md">
            <q-input
              filled
              v-model="formData.nombre"
              label="Nombre de la Constancia *"
              :rules="[(val) => !!val || 'Campo requerido']"
            />
            <q-input
              filled
              v-model="formData.fechaEntrega"
              label="Fecha de Entrega *"
              type="date"
              stack-label
              :rules="[(val) => !!val || 'Campo requerido']"
            />
            <q-input
              filled
              v-model="formData.responsable"
              label="Responsable"
            />
            <q-input filled v-model="formData.direccion" label="Dirección" />
            <q-input
              filled
              v-model="formData.barrioComunidad"
              label="Barrio / Comunidad"
            />
            <q-input
              filled
              v-model="formData.claveCatastral"
              label="Clave Catastral"
            />
            <q-input
              filled
              v-model="formData.cedula"
              label="Cédula del Responsable"
              readonly
            />
            <div class="row justify-end">
              <q-btn
                type="submit"
                label="Guardar Constancia"
                color="primary"
                :loading="constanciaStore.loading"
              />
            </div>
          </q-form>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation class="row q-gutter-sm">
            <q-btn
              v-if="step > 1"
              flat
              color="primary"
              @click="goBack"
              label="Atrás"
            />
            <q-btn
              v-if="step < 3"
              @click="$refs.stepper.next()"
              color="primary"
              label="Continuar"
              :disable="!isStepDone(step)"
            />
            <q-btn
              v-if="step > 1"
              @click="resetWizard"
              color="negative"
              flat
              label="Empezar de Nuevo"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUsuarioStore } from 'src/stores/usuario-store';
import { useMascotasStore } from 'src/stores/mascotas-store';
import { useConstanciaStore } from 'src/stores/constancia-store';

const usuarioStore = useUsuarioStore();
const mascotasStore = useMascotasStore();
const constanciaStore = useConstanciaStore();
const stepper = ref(null);

const step = ref(1);
const propietarioSeleccionado = ref(null);
const mascotaSeleccionada = ref(null);

const initialFormData = {
  nombre: '',
  fechaEntrega: new Date().toISOString().split('T')[0],
  responsable: '',
  direccion: '',
  barrioComunidad: '',
  claveCatastral: '',
  cedula: '',
};
const formData = ref({ ...initialFormData });

const isStepDone = computed(() => {
  return (currentStep) => {
    if (currentStep === 1) return !!propietarioSeleccionado.value;
    if (currentStep === 2) return !!mascotaSeleccionada.value;
    return false;
  };
});

function goBack() {
  if (step.value === 2) {
    propietarioSeleccionado.value = null;
    mascotasStore.clearMascotas();
  }
  if (step.value === 3) {
    mascotaSeleccionada.value = null;
  }
  stepper.value.previous();
}

async function buscarUsuario(val, update) {
  if (val.length < 2) {
    // Es importante llamar a update aquí también para limpiar
    update(() => {
      usuarioStore.clearUsuarios();
    });
    return;
  }

  await usuarioStore.buscarUsuariosPorCedula(val);

  // Le decimos a ESLint que ignore la siguiente línea
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  update(() => {});
}

// src/pages/ConstanciaForm.vue

async function seleccionarPropietario(usuario) {
  if (!usuario) return;
  propietarioSeleccionado.value = usuario;

  // Aquí está la clave:
  // Llama a la acción del store pasándole la Cédula del usuario seleccionado.
  await mascotasStore.fetchMascotasPorPropietario(usuario.Cedula);

  stepper.value.next(); // Avanza al siguiente paso
}

function seleccionarMascota(mascota) {
  mascotaSeleccionada.value = mascota;
  const prop = propietarioSeleccionado.value;
  formData.value.responsable = `${prop.Nombre || ''} ${
    prop.Apellido || ''
  }`.trim();
  formData.value.direccion = prop.Direccion || '';
  formData.value.cedula = prop.Cedula || '';
  stepper.value.next();
}

async function onSubmit() {
  try {
    const payload = { ...formData.value };
    await constanciaStore.createConstancia(
      mascotaSeleccionada.value.id,
      payload
    );
    resetWizard();
  } catch (error) {
    // El store ya notifica el error.
    console.error('Fallo el envío de la constancia:', error);
  }
}

function resetWizard() {
  step.value = 1;
  usuarioStore.clearUsuarios();
  propietarioSeleccionado.value = null;
  mascotaSeleccionada.value = null;
  mascotasStore.clearMascotas();
  formData.value = { ...initialFormData };
}
</script>

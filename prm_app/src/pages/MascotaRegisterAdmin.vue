<template>
  <q-page padding>
    <div class="q-mx-auto" style="max-width: 800px">
      <div class="text-h4 text-weight-bold text-primary q-mb-md">
        Registrar Mascota
      </div>

      <q-select
        filled
        v-model="usuarioSeleccionado"
        use-input
        hide-selected
        fill-input
        input-debounce="500"
        label="Buscar propietario por Cédula o Nombre"
        :options="usuariosEncontrados"
        @filter="buscarUsuario"
        option-value="Id"
        option-label="Cedula"
        :loading="buscandoUsuario"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No se encontraron resultados.
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label
                >{{ scope.opt.Nombre }} {{ scope.opt.Apellido }}</q-item-label
              >
              <q-item-label caption
                >Cédula: {{ scope.opt.Cedula }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-form
        v-if="usuarioSeleccionado"
        @submit="registrarMascota"
        class="q-mt-lg q-gutter-y-md"
      >
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">
              Datos de la Mascota para:
              <span class="text-weight-bold"
                >{{ usuarioSeleccionado.Nombre }}
                {{ usuarioSeleccionado.Apellido }}</span
              >
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="row q-col-gutter-md">
            <q-input
              class="col-12 col-sm-6"
              outlined
              v-model="mascota.nombre"
              label="Nombre de la mascota"
              :rules="[(val) => !!val || 'El nombre es requerido']"
            />
            <q-input
              class="col-12 col-sm-6"
              outlined
              v-model="mascota.raza"
              label="Raza"
              :rules="[(val) => !!val || 'La raza es requerida']"
            />
            <q-input
              class="col-12 col-sm-6"
              outlined
              v-model="mascota.color"
              label="Color"
            />
            <q-input
              class="col-12 col-sm-6"
              outlined
              v-model="mascota.fechaNacimiento"
              label="Fecha de Nacimiento"
              type="date"
              stack-label
              :rules="[(val) => !!val || 'La fecha es requerida']"
            />
            <q-input
              class="col-12"
              outlined
              v-model="mascota.descripcion"
              label="Descripción (señas particulares)"
              type="textarea"
            />
            <q-input
              class="col-12 col-sm-6"
              outlined
              v-model="mascota.habitat"
              label="Hábitat"
            />
            <q-input
              class="col-12 col-sm-6"
              outlined
              v-model="mascota.tipoAlimentacion"
              label="Tipo de Alimento"
            />
            <q-input
              class="col-12 col-sm-6"
              outlined
              v-model="mascota.obtencion"
              label="Modo de Obtención"
            />
            <q-input
              class="col-12 col-sm-6"
              outlined
              v-model="mascota.estadoReproductivo"
              label="Estado Reproductivo"
            />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-h6">Registros de Salud</div>
            <div class="row q-col-gutter-md q-mt-sm">
              <q-input
                class="col-12 col-md-6"
                outlined
                v-model="vacunaForm.nombreVacuna"
                label="Nombre de la Vacuna"
              />
              <q-input
                class="col-12 col-md-6"
                outlined
                v-model="vacunaForm.fechaVacuna"
                label="Fecha de Vacunación"
                type="date"
                stack-label
              />
              <q-input
                class="col-12 col-md-6"
                outlined
                v-model="vacunaForm.desparasitacionProducto"
                label="Producto de Desparasitación"
              />
              <q-input
                class="col-12 col-md-6"
                outlined
                v-model="vacunaForm.fechaDesparasitacion"
                label="Fecha de Desparasitación"
                type="date"
                stack-label
              />
              <q-input
                class="col-12"
                outlined
                v-model="vacunaForm.observacion"
                label="Observación General"
                type="textarea"
              />
            </div>
            <q-btn
              @click="agregarVacunaALista"
              label="Agregar Registro a la Lista"
              color="secondary"
              class="q-mt-md"
              unelevated
            />
          </q-card-section>

          <q-list
            v-if="vacunasAgregadas.length > 0"
            bordered
            separator
            class="q-ma-md"
          >
            <q-item-label header>Registros de salud por agregar</q-item-label>
            <q-item v-for="(item, index) in vacunasAgregadas" :key="index">
              <q-item-section>
                <q-item-label>{{
                  item.nombreVacuna || 'Sin vacuna'
                }}</q-item-label>
                <q-item-label caption
                  >Desparasitación:
                  {{ item.desparasitacionProducto || 'Ninguno' }}</q-item-label
                >
                <q-item-label caption
                  >Obs: {{ item.observacion || 'N/A' }}</q-item-label
                >
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="eliminarVacunaDeLista(index)"
                  flat
                  dense
                  round
                  icon="delete"
                  color="negative"
                />
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              type="submit"
              label="Guardar Mascota"
              color="primary"
              size="lg"
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { api, apiClient } from 'boot/axios';

const $q = useQuasar();

// Estado para la búsqueda de usuarios
const usuarioSeleccionado = ref(null);
const usuariosEncontrados = ref([]);
const buscandoUsuario = ref(false);

// Estado para los formularios
const mascota = ref({
  nombre: '',
  color: '',
  descripcion: '',
  habitat: '',
  raza: '',
  fechaNacimiento: '',
  obtencion: '',
  tipoAlimentacion: '',
  estadoReproductivo: '',
});
const vacunaForm = ref({
  nombreVacuna: '',
  fechaVacuna: '',
  desparasitacionProducto: '',
  fechaDesparasitacion: '',
  observacion: '',
});
const vacunasAgregadas = ref([]);

// Lógica de búsqueda para el Q-Select
async function buscarUsuario(val, update) {
  if (val.length < 2) {
    update(() => {
      usuariosEncontrados.value = [];
    });
    return;
  }
  buscandoUsuario.value = true;
  try {
    // Usamos la API de Express para buscar usuarios
    const response = await api.get(`/usuarios/${val}`);
    update(() => {
      usuariosEncontrados.value = Array.isArray(response.data)
        ? response.data
        : [response.data];
    });
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    $q.notify({ color: 'negative', message: 'Error al buscar propietario.' });
    update(() => {
      usuariosEncontrados.value = [];
    });
  } finally {
    buscandoUsuario.value = false;
  }
}

// Lógica para agregar/quitar registros de salud de la lista temporal
function agregarVacunaALista() {
  if (
    !vacunaForm.value.nombreVacuna &&
    !vacunaForm.value.desparasitacionProducto
  ) {
    $q.notify({
      color: 'warning',
      message:
        'Debe ingresar al menos un nombre de vacuna o producto de desparasitación.',
    });
    return;
  }
  vacunasAgregadas.value.push({ ...vacunaForm.value });
  // Limpiar el formulario de vacunas
  vacunaForm.value = {
    nombreVacuna: '',
    fechaVacuna: '',
    desparasitacionProducto: '',
    fechaDesparasitacion: '',
    observacion: '',
  };
  $q.notify({
    color: 'positive',
    message: 'Registro agregado a la lista.',
    position: 'top-right',
  });
}

function eliminarVacunaDeLista(index) {
  vacunasAgregadas.value.splice(index, 1);
  $q.notify({ color: 'info', message: 'Registro quitado de la lista.' });
}

// Lógica de envío principal
async function registrarMascota() {
  $q.loading.show({ message: 'Guardando registro...' });
  try {
    // 1. Preparar y enviar los datos de la mascota a la API de .NET
    const mascotaParaEnviar = {
      ...mascota.value,
      cedulaPropietario: usuarioSeleccionado.value.Cedula,
    };
    const responseMascota = await apiClient.post(
      '/mascotas',
      mascotaParaEnviar
    );
    const mascotaCreadaId = responseMascota.data.id;

    if (!mascotaCreadaId) {
      throw new Error('La API no devolvió un ID para la mascota creada.');
    }

    // 2. Enviar los registros de salud uno por uno
    for (const vacuna of vacunasAgregadas.value) {
      await apiClient.post(`/mascotas/${mascotaCreadaId}/vacunas`, vacuna);
    }

    $q.notify({
      type: 'positive',
      message: '¡Mascota y registros de salud guardados con éxito!',
    });
    resetFormularioCompleto();
  } catch (error) {
    console.error('Error en el proceso de registro:', error);
    $q.notify({
      type: 'negative',
      message: 'Hubo un problema durante el registro. Revisa la consola.',
    });
  } finally {
    $q.loading.hide();
  }
}

function resetFormularioCompleto() {
  mascota.value = {
    nombre: '',
    color: '',
    descripcion: '',
    habitat: '',
    raza: '',
    fechaNacimiento: '',
    obtencion: '',
    tipoAlimentacion: '',
    estadoReproductivo: '',
  };
  vacunaForm.value = {
    nombreVacuna: '',
    fechaVacuna: '',
    desparasitacionProducto: '',
    fechaDesparasitacion: '',
    observacion: '',
  };
  vacunasAgregadas.value = [];
  usuarioSeleccionado.value = null;
  usuariosEncontrados.value = [];
}
</script>

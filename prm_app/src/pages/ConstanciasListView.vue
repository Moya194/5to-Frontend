<template>
  <q-page padding>
    <div class="q-mx-auto" style="max-width: 1200px">
      <q-table
        title="Listado de Constancias"
        :rows="store.constancias"
        :columns="columns"
        row-key="id"
        v-model:pagination="store.pagination"
        :loading="store.loading"
        @request="onRequest"
        binary-state-sort
        flat
        bordered
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              @click="handleDelete(props.row.id, props.row.nombre)"
              flat
              dense
              round
              color="negative"
              icon="delete"
            >
              <q-tooltip>Eliminar Constancia</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useConstanciaStore } from 'src/stores/constancia-store';

const $q = useQuasar();
const store = useConstanciaStore();

// Definición de las columnas para la tabla
const columns = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre Constancia',
    align: 'left',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'mascota',
    label: 'Mascota',
    align: 'left',
    field: (row) => row.mascota?.nombre || 'N/A',
  },
  {
    name: 'propietario',
    label: 'Propietario',
    align: 'left',
    field: 'responsable',
    sortable: true,
  },
  {
    name: 'fecha',
    label: 'Fecha de Entrega',
    align: 'left',
    field: 'fechaEntrega',
    format: (val) => formatDate(val),
    sortable: true,
  },
  { name: 'actions', label: 'Acciones', align: 'center' },
];

// Función que se dispara cuando la tabla necesita nuevos datos (paginación, orden, etc.)
function onRequest(props) {
  store.fetchAllConstancias(props);
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-EC');
}

// Función para eliminar, ahora usando el diálogo de Quasar
function handleDelete(id, nombre) {
  $q.dialog({
    title: 'Confirmar Eliminación',
    message: `¿Estás seguro de que deseas eliminar la constancia "${nombre}"?`,
    cancel: true,
    persistent: true,
    ok: {
      label: 'Eliminar',
      color: 'negative',
      flat: true,
    },
    cancel: {
      label: 'Cancelar',
      flat: true,
    },
  }).onOk(() => {
    store.deleteConstancia(id);
  });
}

// Carga inicial de datos cuando el componente se monta
onMounted(() => {
  onRequest({ pagination: store.pagination });
});
</script>

<template>
    <q-page class="bg-white text-center">
      <div class="text-weight-bolder text-h4">Constacia Registros</div>
      <AnalistaFau v-if="analistaFauf" @submit="analistaFauForm"/>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useQuasar } from 'quasar';
  import AnalistaFau from 'src/components/Analista-Fau.vue';
  
  const $q = useQuasar();
  const analistaFauf = ref<boolean>(true);
  
  function analistaFauForm($ev: boolean) {
    if ($ev) {
      $q.notify({
        message: 'Constancia guardada correctamente',
        color: 'green',
        timeout: 2000,
        position: 'top'
      });
    }
  }
  </script>
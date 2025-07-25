<template>
  <q-page padding>
    <div class="q-mx-auto" style="max-width: 800px">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h4 text-weight-bold text-primary text-center">
            Perfil de Usuario
          </div>
        </q-card-section>

        <q-card-section v-if="authStore.userProfile">
          <q-list bordered separator>
            <q-item>
              <q-item-section>
                <q-item-label caption>ID</q-item-label>
                <q-item-label>{{ authStore.userProfile.id }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Nombre Completo</q-item-label>
                <q-item-label
                  >{{ authStore.userProfile.nombre }}
                  {{ authStore.userProfile.apellido }}</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Correo electrónico</q-item-label>
                <q-item-label>{{
                  authStore.userProfile.correo || 'No proporcionado'
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section v-else class="text-center text-grey">
          No se pudieron cargar los datos del perfil. Por favor, intenta iniciar
          sesión de nuevo.
        </q-card-section>

        <q-separator spaced />

        <q-card-actions align="center">
          <q-btn
            @click="editarPerfil"
            label="Editar Perfil"
            color="primary"
            icon="edit"
            unelevated
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth-store';
import { useQuasar } from 'quasar';

// Se obtiene acceso al almacén de autenticación y a las utilidades de Quasar
const authStore = useAuthStore();
const $q = useQuasar();

function editarPerfil() {
  // Aquí puedes implementar la lógica para editar, como abrir un diálogo
  $q.notify({
    message: 'Funcionalidad de editar perfil en construcción.',
    icon: 'build',
    color: 'info',
  });
}
</script>

<style scoped>
.text-h4 {
  margin-bottom: 1rem;
}
</style>

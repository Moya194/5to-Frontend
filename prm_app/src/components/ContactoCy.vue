<template>
  <div>
    <q-layout view="hHh Lpr fFf">
  <q-header elevated>
    <q-toolbar>
      <q-btn flat round dense icon="menu" @click="leftDrawerOpen =!leftDrawerOpen" />
      <q-toolbar-title>Alcaldía de Cayambe</q-toolbar-title>
    </q-toolbar>
  </q-header>

  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    bordered
    content-class="bg-grey-1"
  >
    <q-list>
      <q-item-label header>Menú</q-item-label>
      <q-item to="/guia-de-impuestos" exact>
        <q-item-section avatar>
          <q-icon name="fas fa-book" />
        </q-item-section>
        <q-item-section>Guía de Impuestos</q-item-section>
      </q-item>
      <q-item to="/servicios" exact>
        <q-item-section avatar>
          <q-icon name="fas fa-cogs" />
        </q-item-section>
        <q-item-section>Servicios</q-item-section>
      </q-item>
      <!--... -->
    </q-list>
  </q-drawer>

  <q-page-container>
    <router-view />
  </q-page-container>

  <q-footer elevated>
    <q-toolbar>
      <q-toolbar-title>Contacto</q-toolbar-title>
      <q-btn flat round dense icon="mail" href="mailto:info@gadipmc.gob.ec" />
      <q-btn flat round dense icon="phone" href="tel:(02) 236-1591" />
    </q-toolbar>
  </q-footer>
</q-layout>
  </div>
</template>

<script>
export default {
  name: 'MenuComponent'
}
</script>
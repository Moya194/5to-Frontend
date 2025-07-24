<template>
  <div id="app-layout">
    <!-- 
      Ventana #1: Nombrada 'sideMenu'.
      Aquí es donde el router colocará el componente SideMenu.
    -->
    <router-view name="sideMenu"></router-view>

    <!-- 
      Contenedor principal para el contenido de la página.
    -->
    <main class="main-content">
      <!-- 
        Ventana #2: Por defecto (sin nombre).
        Aquí es donde el router colocará los componentes principales 
        como HomeView, RegisterUser, etc.
      -->
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
// Para este layout principal, no se necesita lógica de script por ahora.
export default {
  name: 'App'
}
</script>

<style>
/* Estilos globales para que el layout funcione */
body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  background-color: #f4f7f6;
}

#app-layout {
  display: flex; /* Coloca el menú y el contenido uno al lado del otro */
}

.main-content {
  flex-grow: 1; /* Hace que el contenido principal ocupe todo el espacio restante */
  /* Dejamos un espacio a la izquierda para el SideMenu, que tiene un ancho de 250px */
  padding-left: 250px; 
  padding-top: 1rem;
  padding-right: 1rem;
  width: 100%;
  box-sizing: border-box;
}

/* Para pantallas pequeñas, el menú podría ocultarse y el contenido ocupar todo */
@media (max-width: 768px) {
  .main-content {
    padding-left: 1rem; /* Eliminamos el espacio del menú */
  }
}
</style>

<template>
    <div>
      <!-- Menú lateral -->
      <SideMenuUsuario @menu-toggle="handleMenuToggle" />
  
      <!-- Contenido principal -->
      <div class="escanearqr" :class="{ 'menu-collapsed': !isMenuOpen }">
        <div class="escanear-container">
          <h1>Escanear Código QR</h1>
  
          <!-- Botón para abrir el modal -->
          <button @click="openModal" class="scan-button">Escanear QR</button>
  
          <!-- Modal de Escaneo QR -->
          <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
              <qrcode-stream @decode="onDecode" @init="onInit" />
              <button @click="closeModal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import SideMenuUsuario from '@/components/SideMenuUsuario.vue';
  import { QrcodeStream } from 'vue-qrcode-reader';
  
  export default {
    name: 'EscanearQR',
    components: {
      SideMenuUsuario,
      QrcodeStream,
    },
    data() {
      return {
        isMenuOpen: true,
        isModalOpen: false, // Controla el modal
      };
    },
    methods: {
      handleMenuToggle(isOpen) {
        this.isMenuOpen = isOpen;
      },
      openModal() {
        this.isModalOpen = true;
      },
      closeModal() {
        this.isModalOpen = false;
      },
      onDecode(decodedString) {
        alert(`Código QR detectado: ${decodedString}`);
        this.closeModal(); // Cierra el modal después de leer el código
      },
      onInit(promise) {
        promise.catch(error => {
          alert('Error al iniciar la cámara: ' + error);
        });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos generales */
  .escanearqr {
    margin-left: 250px;
    padding: 2rem;
    min-height: 100vh;
    transition: margin-left 0.3s ease;
    background: #f8f9fa;
  }
  
  .escanearqr.menu-collapsed {
    margin-left: 0;
  }
  
  .escanear-container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    color: #333;
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  /* Botón para abrir el modal */
  .scan-button {
    background-color: #42b983;
    color: white;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .scan-button:hover {
    background-color: #37a56e;
  }
  
  /* Modal de escaneo */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background: #ff4747;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background: #e13b3b;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .escanearqr {
      margin-left: 0;
      padding: 1rem;
    }
  
    .escanear-container {
      padding: 1.5rem;
    }
  
    h1 {
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
    }
  }
  </style>
  
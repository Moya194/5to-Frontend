<template>
  <q-page>
    <q-input
      v-model="searchName"
      placeholder="Buscar por Nombre"
      filled
      clearable
      @input="filteredRows"
    />

    <div class="q-gutter-md">
      <q-card
        v-for="mascota in filteredRows"
        :key="mascota.id"
        class="q-mb-md q-card--bordered"
      >
        <q-card-section>
          <div class="text-h6">Datos Mascota</div>
          <div class="text-caption">Nombre: {{ mascota.nombre }}</div>
          <div class="text-caption">Especie: {{ mascota.especie }}</div>
          <div class="text-caption">Fecha de Nacimiento: {{ formatDate(mascota.fechaNacimiento) }}</div>
          <div class="text-caption">Raza: {{ mascota.raza }}</div>
          <div class="text-caption">Sexo: {{ mascota.sexo }}</div>
          <div class="text-caption">Edad: {{ mascota.edad }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            color="primary"
            @click="downloadPDF(mascota)"
          >
            Descargar PDF
          </q-btn>
          <q-btn
            flat
            color="negative"
            @click="confirmDelete(mascota)"
          >
            Eliminar
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Confirmar Eliminación</div>
        </q-card-section>

        <q-card-section>
          <p>
            ¿Estás seguro de que deseas eliminar el registro de {{ recordToDelete?.nombre }}?
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            v-close-popup
          />
          <q-btn
            flat
            label="Eliminar"
            color="negative"
            @click="deleteRecord"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { date } from 'quasar';
import { db } from 'src/boot/firebase';
import { jsPDF } from 'jspdf';

// Define la interfaz para los datos de cada mascota
interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  fechaNacimiento: string;
  raza: string;
  sexo: string;
  edad: string;
}

// Estado para los datos, tipado como una matriz de objetos Mascota
const mascotas = ref<Mascota[]>([]);
const deleteDialog = ref(false); // Estado para controlar la visibilidad del modal
const recordToDelete = ref<Mascota | null>(null); // Mascota a eliminar
const searchName = ref(''); // Estado para el valor de búsqueda

// Obtener datos de Firebase
const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'mascotas'));
    mascotas.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Mascota));
  } catch (error) {
    console.error('Error obteniendo documentos: ', error);
  }
};

// Formatear fecha
const formatDate = (val: string) => date.formatDate(val, 'DD/MM/YYYY');

// Función para descargar PDF
const downloadPDF = (mascota: Mascota) => {
  const doc = new jsPDF();
  doc.setFontSize(12);

  // Agregar texto estático
  doc.text("CONSTANCIA DE REGISTRO DE MASCOTAS.", 14, 10);
  doc.text("Nombre: " + mascota.nombre, 14, 20);
  doc.text("Especie: " + mascota.especie, 14, 30);
  doc.text("Fecha de Nacimiento: " + formatDate(mascota.fechaNacimiento), 14, 40);
  doc.text("Raza: " + mascota.raza, 14, 50);
  doc.text("Sexo: " + mascota.sexo, 14, 60);
  doc.text("Edad: " + mascota.edad, 14, 70);

  // Descargar el PDF
  doc.save(`constancia-${mascota.nombre}.pdf`);
};

// Función para abrir el modal de confirmación
const confirmDelete = (mascota: Mascota) => {
  recordToDelete.value = mascota;
  deleteDialog.value = true;
};

// Función para eliminar el registro
const deleteRecord = async () => {
  if (recordToDelete.value) {
    try {
      await deleteDoc(doc(db, 'mascotas', recordToDelete.value.id));
      mascotas.value = mascotas.value.filter(mascota => mascota.id !== recordToDelete.value?.id);
      deleteDialog.value = false;
      recordToDelete.value = null;
    } catch (error) {
      console.error('Error eliminando documento: ', error);
    }
  }
};

// Filtrar filas basadas en el valor de búsqueda del nombre
const filteredRows = computed(() => {
  if (!searchName.value) {
    return mascotas.value;
  }
  return mascotas.value.filter(mascota =>
    mascota.nombre.toLowerCase().includes(searchName.value.toLowerCase())
  );
});

// Llama a fetchData cuando el componente es montado
onMounted(fetchData);
</script>

<style scoped>
.q-card {
  max-width: 500px; /* Ajusta el ancho de la tarjeta según sea necesario */
}
</style>

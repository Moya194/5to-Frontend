<template>
  <q-page padding>
    <q-input
      v-model="searchCedula"
      placeholder="Buscar por Cédula"
      filled
      clearable
      @input="filteredRows"
    />

    <div class="q-gutter-md">
      <q-card
        v-for="row in filteredRows"
        :key="row.id"
        class="q-mb-md"
      >
        <q-card-section>
          <div class="text-h6">{{ row.tutor }}</div>
          <div class="text-subtitle1">Cédula: {{ row.cedula }}</div>
          <div class="text-caption">Barrio: {{ row.barrio }}</div>
          <div class="text-caption">Dirección: {{ row.direccion }}</div>
          <div class="text-caption">Fecha: {{ formatDate(row.fecha) }}</div>
          <div class="text-caption">Clave Catastral: {{ row.catastro }}</div>
          <div class="text-caption">Registrado por: {{ row.regispor }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            color="primary"
            @click="downloadPDF(row)"
          >
            Descargar PDF
          </q-btn>
          <q-btn
            flat
            color="negative"
            @click="confirmDelete(row)"
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
            ¿Estás seguro de que deseas eliminar el registro de {{ recordToDelete?.tutor }}?
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

// Define la interfaz para los datos de cada registro
interface Registro {
  id: string;
  tutor: string;
  cedula: string;
  barrio: string;
  direccion: string;
  fecha: string;
  catastro: string;
  regispor: string;
}

// Estado para los datos, tipado como una matriz de objetos Registro
const rows = ref<Registro[]>([]);
const deleteDialog = ref(false); // Estado para controlar la visibilidad del modal
const recordToDelete = ref<Registro | null>(null); // Registro a eliminar
const searchCedula = ref(''); // Estado para el valor de búsqueda

// Obtener datos de Firebase
const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'constancia'));
    rows.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Registro));
  } catch (error) {
    console.error('Error obteniendo documentos: ', error);
  }
};

// Formatear fecha
const formatDate = (val: string) => date.formatDate(val, 'DD/MM/YYYY');

// Función para descargar PDF
const downloadPDF = (row: Registro) => {
  const doc = new jsPDF();
  doc.setFontSize(12);

  // Agregar texto estático
  doc.text("CONSTANCIA DE REGISTRO DE MASCOTAS.", 14, 10);
  doc.text("Barrio/Comunidad: " + row.barrio, 14, 20);
  doc.text("Clave Catastral: " + row.catastro, 140, 20);
  doc.text("Dirección: " + row.direccion, 14, 30);
  doc.text("Fecha: " + formatDate(row.fecha), 140, 30);
  doc.text("El GADIP MUNICIPIO DE CAYAMBE a través de la Dirección de Ambiente damos constancia", 14, 40);
  doc.text("del registro de mascotas al Sr/Sra. " + row.tutor + " con N° de cédula " + row.cedula, 14, 50);
  doc.text("registrados por " + row.regispor, 14, 60);
  doc.text("_________________________", 14, 80);
  doc.text("Firma del propietario", 14, 85);
  doc.text("_________________________", 100, 80);
  doc.text("Firma del registrador", 100, 85);

  // Descargar el PDF
  doc.save(`constancia-${row.tutor}.pdf`);
};

// Función para abrir el modal de confirmación
const confirmDelete = (row: Registro) => {
  recordToDelete.value = row;
  deleteDialog.value = true;
};

// Función para eliminar el registro
const deleteRecord = async () => {
  if (recordToDelete.value) {
    try {
      await deleteDoc(doc(db, 'constancia', recordToDelete.value.id));
      rows.value = rows.value.filter(row => row.id !== recordToDelete.value?.id);
      deleteDialog.value = false;
      recordToDelete.value = null;
    } catch (error) {
      console.error('Error eliminando documento: ', error);
    }
  }
};

// Filtrar filas basadas en el valor de búsqueda de la cédula
const filteredRows = computed(() => {
  if (!searchCedula.value) {
    return rows.value;
  }
  return rows.value.filter(row =>
    row.cedula.toLowerCase().includes(searchCedula.value.toLowerCase())
  );
});

// Llama a fetchData cuando el componente es montado
onMounted(fetchData);
</script>

<style scoped>
.q-card {
  max-width: 400px; /* Opcional: Ajusta el ancho de la tarjeta */
}
</style>
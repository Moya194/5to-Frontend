<template>
  <q-page padding>
    <div class="q-mx-auto" style="max-width: 1200px">
      <h4 class="text-h4 text-weight-bold text-primary">Listado de Mascotas</h4>

      <q-table
        :rows="mascotas"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :filter="filter"
        flat
        bordered
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template v-slot:top>
          <q-input
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar mascota..."
            style="width: 300px"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              @click="generarCarnet(props.row)"
              label="Generar Carnet"
              color="positive"
              icon="badge"
              size="sm"
              unelevated
            />
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey q-gutter-sm q-pa-lg">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span> No hay mascotas registradas para mostrar. </span>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api, apiClient } from 'boot/axios';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

const $q = useQuasar();
const mascotas = ref([]);
const loading = ref(true);
const filter = ref('');

const columns = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre Mascota',
    align: 'left',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'propietario',
    label: 'Cédula Prop.',
    align: 'left',
    field: 'cedulaPropietario',
    sortable: true,
  },
  { name: 'raza', label: 'Raza', align: 'left', field: 'raza', sortable: true },
  { name: 'actions', label: 'Acción', field: 'actions', align: 'center' },
];

async function fetchMascotas() {
  loading.value = true;
  try {
    const response = await apiClient.get('/mascotas?includeRelated=true');
    mascotas.value = response.data;
  } catch (error) {
    console.error('Error al obtener las mascotas:', error);
    $q.notify({
      color: 'negative',
      message: 'No se pudieron cargar las mascotas.',
    });
  } finally {
    loading.value = false;
  }
}

// --- FUNCIÓN PRINCIPAL (sin cambios) ---
async function generarCarnet(mascota) {
  $q.loading.show({ message: 'Generando carnet...' });
  try {
    const propietario = await getPropietarioInfo(mascota.cedulaPropietario);
    const qrData = buildQrData(mascota, propietario);
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'L',
    });
    const doc = new jsPDF();
    buildPdfLayout(doc, mascota, propietario, qrCodeDataURL); // Esta función ahora es mucho más completa
    doc.save(`Carnet_${mascota.nombre || 'mascota'}.pdf`);
  } catch (err) {
    console.error('Error al generar el carnet:', err);
    $q.notify({ color: 'negative', message: 'No se pudo generar el carnet.' });
  } finally {
    $q.loading.hide();
  }
}
async function getPropietarioInfo(cedula) {
  const defaultPropietario = {
    Nombre: '[No encontrado]',
    Direccion: '[No disponible]',
    Telefono: '[No disponible]',
    Apellido: '',
  };
  if (!cedula) return defaultPropietario;
  try {
    const response = await api.get(`/usuarios/${cedula}`);
    return response.data && typeof response.data === 'object'
      ? response.data
      : defaultPropietario;
  } catch (error) {
    console.warn(
      `No se pudo obtener la info del propietario con cédula ${cedula}.`,
      error
    );
    return defaultPropietario;
  }
}

/**
 * CONSTRUYE EL TEXTO PARA EL QR (AHORA MÁS COMPLETO)
 */
function buildQrData(mascota, propietario) {
  let qrData = '--- MASCOTA ---\n';
  qrData += `Nombre: ${mascota.nombre || 'N/A'}\n`;
  qrData += `Raza: ${mascota.raza || 'N/A'}\n`;
  qrData += `Nacimiento: ${formatFecha(mascota.fechaNacimiento)}\n\n`;
  qrData += '--- PROPIETARIO ---\n';
  qrData += `Cédula: ${mascota.cedulaPropietario || 'N/A'}\n`;
  qrData += `Nombre: ${propietario.Nombre || ''} ${
    propietario.Apellido || ''
  }\n`;
  qrData += `Teléfono: ${propietario.Telefono || 'N/A'}\n\n`;
  qrData += '--- HISTORIAL DE SALUD ---\n';
  if (mascota.vacunas && mascota.vacunas.length > 0) {
    mascota.vacunas.forEach((vacuna) => {
      if (vacuna.nombreVacuna) {
        qrData += `- Vacuna: ${vacuna.nombreVacuna} (${formatFecha(
          vacuna.fechaVacuna
        )})\n`;
      }
      if (vacuna.desparasitacionProducto) {
        qrData += `- Desparasitación: ${
          vacuna.desparasitacionProducto
        } (${formatFecha(vacuna.fechaDesparasitacion)})\n`;
      }
    });
  } else {
    qrData += 'Sin registros de salud.\n';
  }
  return qrData;
}

/**
 * DIBUJA EL DISEÑO COMPLETO DEL PDF (VERSIÓN MEJORADA)
 */
function buildPdfLayout(doc, mascota, propietario, qrCodeDataURL) {
  // Encabezado
  doc.rect(10, 10, 190, 277);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CARNET DE IDENTIFICACIÓN Y SALUD ANIMAL', 105, 20, {
    align: 'center',
  });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('GOBIERNO AUTÓNOMO DESCENTRALIZADO DE CAYAMBE', 105, 28, {
    align: 'center',
  });
  doc.line(15, 35, 195, 35);

  // QR
  doc.addImage(qrCodeDataURL, 'PNG', 150, 40, 40, 40);

  // Datos de la Mascota
  doc.setFont('helvetica', 'bold');
  doc.text('Datos de la Mascota', 20, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Nombre: ${mascota.nombre || 'N/A'}`, 20, 49);
  doc.text(`Raza: ${mascota.raza || 'N/A'}`, 20, 56);
  doc.text(`Color: ${mascota.color || 'N/A'}`, 20, 63);
  doc.text(`F. Nacimiento: ${formatFecha(mascota.fechaNacimiento)}`, 20, 70);
  doc.text(
    `Estado Reproductivo: ${mascota.estadoReproductivo || 'N/A'}`,
    20,
    77
  );

  // Datos del Propietario
  doc.setFont('helvetica', 'bold');
  doc.text('Datos del Propietario', 20, 88);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cédula: ${mascota.cedulaPropietario || 'N/A'}`, 20, 95);
  doc.text(
    `Nombre: ${propietario.Nombre || ''} ${propietario.Apellido || ''}`,
    20,
    102
  );
  doc.text(
    `Dirección: ${propietario.Direccion || '[No disponible]'}`,
    20,
    109,
    { maxWidth: 120 }
  );
  doc.text(`Teléfono: ${propietario.Telefono || '[No disponible]'}`, 20, 116);

  doc.line(15, 122, 195, 122);

  // Historial de Salud (Tabla)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Historial de Salud', 20, 129);
  let yPosition = 136;

  if (mascota.vacunas && mascota.vacunas.length > 0) {
    mascota.vacunas.forEach((vacuna) => {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }
      let textLines = doc.splitTextToSize(vacuna.observacion || 'Ninguna.', 65);
      if (vacuna.nombreVacuna) {
        doc.setFont('helvetica', 'bold');
        doc.text('Vacuna:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${vacuna.nombreVacuna}`, 40, yPosition);
        doc.text(`Fecha: ${formatFecha(vacuna.fechaVacuna)}`, 100, yPosition);
        yPosition += 5;
      }
      if (vacuna.desparasitacionProducto) {
        doc.setFont('helvetica', 'bold');
        doc.text('Desparasitación:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${vacuna.desparasitacionProducto}`, 55, yPosition);
        doc.text(
          `Fecha: ${formatFecha(vacuna.fechaDesparasitacion)}`,
          100,
          yPosition
        );
        yPosition += 5;
      }
      doc.setFont('helvetica', 'bold');
      doc.text('Observaciones:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(textLines, 50, yPosition);
      yPosition += textLines.length * 5 + 5;
      doc.line(20, yPosition - 3, 190, yPosition - 3);
    });
  } else {
    doc.text('Sin registros de salud.', 20, yPosition);
  }

  // Pie de Página
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'DIRECCIÓN DE AMBIENTE - GADIPMC - ' + new Date().getFullYear(),
    105,
    285,
    { align: 'center' }
  );
}

function formatFecha(fecha) {
  if (!fecha) return 'N/A';
  return new Date(fecha).toLocaleDateString('es-EC'); // Formato de fecha local
}

onMounted(fetchMascotas);
</script>

<style scoped>
/* La mayoría de los estilos son manejados por Quasar,
   por lo que a menudo no se necesita mucho CSS personalizado. */
</style>

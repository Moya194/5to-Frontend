<template>
    <div class="app-container">
        <SideMenuUsuario />
        <div class="content">
            <h2>Listado de Mascotas Registradas</h2>

            <div v-if="loading" class="loading-message">
                <p>Cargando mascotas...</p>
                </div>
            <div v-if="error" class="error-message">
                <p>Error: {{ error }}</p>
                <button @click="fetchMascotas">Reintentar</button>
            </div>

            <table v-if="!loading && !error && mascotas.length > 0" class="mascotas-table">
                <thead>
                    <tr>
                        <th>Nombre de la Mascota</th>
                        <th>Cédula del Propietario</th>
                        <th>Raza</th>
                        <th>Color</th>
                        <th>F. Nacimiento</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="mascota in mascotas" :key="mascota.id">
                        <td>{{ mascota.nombre || 'N/A' }}</td>
                        <td>{{ mascota.cedulaPropietario || 'N/A' }}</td>
                        <td>{{ mascota.raza || 'N/A' }}</td>
                        <td>{{ mascota.color || 'N/A' }}</td>
                        <td>{{ formatFecha(mascota.fechaNacimiento) }}</td>
                        <td>
                            <button @click="generarCarnet(mascota)" class="btn-generar-carnet">Generar Carnet</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="!loading && !error && mascotas.length === 0" class="no-data-message">
                <p>No hay mascotas registradas.</p>
            </div>
        </div>
    </div>
</template>

<script>
import SideMenuUsuario from '@/components/SideMenuUsuario.vue';
import { jsPDF } from "jspdf";
import QRCode from 'qrcode';
import apiClient from '@/services/axios'; // Asegúrate que esta ruta a tu apiClient sea correcta
import userApiClient from '@/services/userApi';
export default {
    name: "MascotasRegistradas",
    components: {
        SideMenuUsuario,
    },
    data() {
        return {
            mascotas: [],
            loading: true,
            error: null,
        };
    },
    created() {
        this.fetchMascotas();
    },
    methods: {
        async fetchMascotas() {
            this.loading = true;
            this.error = null;
            try {
                // CORRECCIÓN 1: Asegurarse de que includeRelated sea 'true'
                const response = await apiClient.get('/mascotas?includeRelated=true');
                this.mascotas = response.data;
            } catch (err) {
                console.error('Error al obtener las mascotas registradas:', err);
                this.error = 'Error al obtener las mascotas. Intente más tarde.';
            } finally {
                this.loading = false;
            }
        },
        formatFecha(fecha) {
            if (!fecha) return 'No especificada';
            try {
                const d = new Date(fecha);
                if (isNaN(d.getTime())) return 'Fecha inválida';
                return d.toLocaleDateString();
            } catch (e) {
                return fecha;
            }
        },
        // Pega esta función completa en la sección 'methods' de tu componente Vue
async generarCarnet(mascota) {
    // Mensaje de depuración para ver qué datos recibe la función
    console.log("Iniciando generación de carnet para:", mascota);

    if (!mascota) {
        alert("Error: No se proporcionaron datos de la mascota.");
        return;
    }

    try {
        // --- PASO 1: OBTENER DATOS DEL PROPIETARIO ---
        let propietario = {
            Nombre: '[No encontrado]',
            Apellido: '',
            Telefono: '[No disponible]',
            DirecProfe: '[No disponible]'
            // Asegúrate de que tu API de usuarios devuelva estos campos
        };
        
        if (mascota.cedulaPropietario) {
            try {
                const response = await userApiClient.get(`/usuarios/${mascota.cedulaPropietario}`);
                if (response.data) {
                    propietario = Array.isArray(response.data) ? response.data[0] : response.data;
                }
            } catch (error) {
                console.warn(`No se pudo obtener la información del propietario con cédula ${mascota.cedulaPropietario}.`, error);
            }
        }

        // --- PASO 2: CONSOLIDAR TODOS LOS DATOS PARA EL CÓDIGO QR ---
        let qrData = `--- MASCOTA ---\n`;
        qrData += `Nombre: ${mascota.nombre || 'N/A'}\n`;
        qrData += `Raza: ${mascota.raza || 'N/A'}\n`;
        qrData += `Nacimiento: ${this.formatFecha(mascota.fechaNacimiento)}\n\n`;
        qrData += `--- PROPIETARIO ---\n`;
        qrData += `Cédula: ${mascota.cedulaPropietario || 'N/A'}\n`;
        qrData += `Nombre: ${(propietario.Nombre || '')} ${(propietario.Apellido || '')}\n`;
        qrData += `Dirección: ${(propietario.Direccion || 'N/A')}\n`;
        qrData += `Telefono: ${(propietario.Telefono || 'N/A')} \n\n`;
        qrData += `--- HISTORIAL DE SALUD ---\n`;
        if (mascota.vacunas && mascota.vacunas.length > 0) {
            mascota.vacunas.forEach(vacuna => {
                if (vacuna.nombreVacuna) {
                    qrData += `- Vacuna: ${vacuna.nombreVacuna} (${this.formatFecha(vacuna.fechaVacuna)})\n`;
                }
                if (vacuna.desparasitacionProducto) {
                    qrData += `- Desparasitación: ${vacuna.desparasitacionProducto} (${this.formatFecha(vacuna.fechaDesparasitacion)})\n`;
                }
            });
        } else {
            qrData += "Sin registros.\n";
        }

        // --- PASO 3: GENERAR LA IMAGEN DEL QR ---
        const qrCodeDataURL = await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'L', margin: 2 });
        
        // --- PASO 4: CONSTRUIR EL DOCUMENTO PDF ---
        const doc = new jsPDF();
        
        // Diseño del carnet
        doc.rect(10, 10, 190, 277);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("CARNET DE IDENTIFICACIÓN Y SALUD ANIMAL", 105, 20, { align: 'center' });
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("GOBIERNO AUTÓNOMO DESCENTRALIZADO DE CAYAMBE", 105, 28, { align: 'center' });
        doc.line(15, 35, 195, 35);

        // Añadir el QR
        doc.addImage(qrCodeDataURL, 'PNG', 150, 40, 40, 40);

        // Datos de la Mascota
        doc.setFont("helvetica", "bold");
        doc.text("Datos de la Mascota", 20, 42);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Nombre: ${mascota.nombre || 'N/A'}`, 20, 49);
        doc.text(`Raza: ${mascota.raza || 'N/A'}`, 20, 56);
        doc.text(`Color: ${mascota.color || 'N/A'}`, 20, 63);
        doc.text(`F. Nacimiento: ${this.formatFecha(mascota.fechaNacimiento)}`, 20, 70);
        doc.text(`Estado Reproductivo: ${mascota.estadoReproductivo || 'N/A'}`, 20, 77);

        // Datos del Propietario (usando la variable 'propietario' que obtuvimos)
        doc.setFont("helvetica", "bold");
        doc.text("Datos del Propietario", 20, 88);
        doc.setFont("helvetica", "normal");
        doc.text(`Cédula: ${mascota.cedulaPropietario || 'N/A'}`, 20, 95);
        doc.text(`Nombre: ${(propietario.Nombre || '')} ${(propietario.Apellido || '')}`, 20, 102);
        doc.text(`Dirección: ${propietario.Direccion || '[No disponible]'}`, 20, 109, { maxWidth: 120 });
        doc.text(`Teléfono: ${propietario.Telefono || '[No disponible]'}`, 20, 116);

        doc.line(15, 122, 195, 122);

        // Historial de Salud
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Historial de Salud", 20, 129);
        let yPosition = 136;
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Producto/Vacuna", 20, yPosition);
        doc.text("Fecha", 100, yPosition);
        doc.text("Observaciones", 130, yPosition);
        yPosition += 2;
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 4;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);

        if (mascota.vacunas && mascota.vacunas.length > 0) {
            mascota.vacunas.forEach(vacuna => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                let currentY = yPosition;
                let textLines = [];
                
                if (vacuna.nombreVacuna) {
                    doc.text(vacuna.nombreVacuna, 20, currentY);
                    doc.text(this.formatFecha(vacuna.fechaVacuna), 100, currentY);
                }
                if (vacuna.desparasitacionProducto) {
                    let yOffset = vacuna.nombreVacuna ? 5 : 0;
                    doc.text(vacuna.desparasitacionProducto + " (Desp.)", 20, currentY + yOffset);
                    doc.text(this.formatFecha(vacuna.fechaDesparasitacion), 100, currentY + yOffset);
                }

                let obsText = `Obs: ${vacuna.observacion || 'Ninguna.'}`;
                textLines = doc.splitTextToSize(obsText, 65);
                doc.text(textLines, 130, currentY);
                
                let blockHeight = Math.max(12, textLines.length * 4);
                yPosition += blockHeight;

                doc.setLineDashPattern([1, 1]);
                doc.line(20, yPosition - 2, 190, yPosition - 2);
                doc.setLineDashPattern([]);
            });
        } else {
            doc.text("Sin registros de salud.", 20, yPosition);
        }

        // Pie de Página
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("DIRECCIÓN DE AMBIENTE - GADIPMC - " + new Date().getFullYear(), 105, 285, { align: 'center' });

        // --- PASO 5: GUARDAR EL PDF ---
        doc.save(`Carnet_${mascota.nombre || 'desconocido'}.pdf`);

    } catch (err) {
        console.error('Error al generar el carnet:', err);
        alert("No se pudo generar el carnet. Revise la consola del navegador para más detalles.");
    }
}
    }
};
</script>

<style scoped>
/* Tus estilos existentes aquí */
.app-container {
    display: flex;
    height: 100vh;
}

.content {
    margin-left: 250px; /* Ajusta según el ancho de tu SideMenuUsuario */
    padding: 20px;
    width: 100%;
    overflow-y: auto;
}

.mascotas-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.mascotas-table th,
.mascotas-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
}

.mascotas-table th {
    background-color: #42b983;
    color: white;
    font-weight: 600;
}

.mascotas-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.mascotas-table tr:hover {
    background-color: #f1f1f1;
}

.btn-generar-carnet {
    background-color: #4CAF50; /* Verde */
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-generar-carnet:hover {
    background-color: #45a049;
}

.loading-message, .error-message, .no-data-message {
    text-align: center;
    padding: 20px;
    font-size: 1.1em;
    color: #666;
}

.error-message {
    color: #d32f2f;
}
</style>
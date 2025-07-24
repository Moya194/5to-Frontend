<template>
    <div class="register-user">
        <div class="sidebar-area">
            <Menul />
        </div>

        <div class="content">
            <header>
                <h1>Registrar Mascota</h1>
            </header>
            
            <div class="search-container">
                <input v-model="cedulaBusqueda" type="text" placeholder="Buscar usuario por cédula..."
                    @input="handleInput" class="search-input" />
                <div v-if="usuariosEncontrados.length > 0" class="usuario-result">
                    <ul>
                        <li v-for="(usuario, index) in usuariosEncontrados" :key="index"
                            @click="seleccionarUsuario(usuario)">
                            <template v-if="usuario">
                                {{ usuario.Nombre }} {{ usuario.Apellido }} - Cédula: {{ usuario.Cedula }}
                            </template>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div v-if="mostrarFormulario" class="mascota-form">
                <h2>Registrar Mascota para: {{ usuarioSeleccionado ? `${usuarioSeleccionado.Nombre} ${usuarioSeleccionado.Apellido}` : '' }}</h2>
                <form @submit.prevent="registrarMascota">
                    <label for="nombre">Nombre de la mascota:</label>
                    <input v-model="mascota.nombre" type="text" id="nombre" required />

                    <label for="color">Color:</label>
                    <input v-model="mascota.color" type="text" id="color" />

                    <label for="raza">Raza:</label>
                    <input v-model="mascota.raza" type="text" id="raza" required/>

                    <label for="fechaNacimiento">Fecha de Nacimiento:</label>
                    <input v-model="mascota.fechaNacimiento" type="date" id="fechaNacimiento" required/>
                    
                    <label for="descripcion">Descripción:</label>
                    <textarea v-model="mascota.descripcion" id="descripcion"></textarea>

                    <label for="habitat">Hábitat:</label>
                    <input v-model="mascota.habitat" type="text" id="habitat" />

                    <label for="tipoAlimentacion">Tipo de Alimento:</label>
                    <input v-model="mascota.tipoAlimentacion" type="text" id="tipoAlimentacion" />

                    <label for="obtencion">Obtención:</label>
                    <input v-model="mascota.obtencion" type="text" id="obtencion" />

                    <label for="estadoReproductivo">Estado Reproductivo:</label>
                    <input v-model="mascota.estadoReproductivo" type="text" id="estadoReproductivo" placeholder="Ej: Esterilizado, Activo" />
                    
                    <div class="vacunas-container">
                        <h3>Registros de Salud (Vacunas y Desparasitaciones)</h3>
                        
                        <label for="vacunaNombre">Nombre de la Vacuna:</label>
                        <input v-model="vacunaForm.nombreVacuna" type="text" id="vacunaNombre" placeholder="Ej: Parvovirus, Rabia" />

                        <label for="fechaVacuna">Fecha de Vacunación:</label>
                        <input v-model="vacunaForm.fechaVacuna" type="date" id="fechaVacuna" />

                        <label for="desparasitacion">Producto de Desparasitación:</label>
                        <input v-model="vacunaForm.desparasitacionProducto" type="text" id="desparasitacion" placeholder="Ej: Drontal, Frontline" />

                        <label for="fechaDesparasitacion">Fecha de Desparasitación:</label>
                        <input v-model="vacunaForm.fechaDesparasitacion" type="date" id="fechaDesparasitacion" />
                        
                        <label for="observacion">Observación General:</label>
                        <textarea v-model="vacunaForm.observacion" id="observacion" placeholder="Observación/descripción (opcional)"></textarea>
                        
                        <button type="button" @click="agregarVacunaALista">Agregar Registro a la Lista</button>
                        
                        <ul v-if="vacunasAgregadas.length > 0">
                            <h4>Registros por agregar:</h4>
                            <li v-for="(itemVacuna, index) in vacunasAgregadas" :key="index">
                                <template v-if="itemVacuna">
                                    <div>
                                        <strong>{{ itemVacuna.nombreVacuna || 'N/A' }}</strong> ({{ itemVacuna.fechaVacuna || 'Sin fecha' }}) <br/>
                                        <small>Desparasitación: {{ itemVacuna.desparasitacionProducto || 'Ninguno' }} ({{ itemVacuna.fechaDesparasitacion || 'Sin fecha' }})</small> <br/>
                                        <small>Obs: {{ itemVacuna.observacion || '(Sin observación)' }}</small>
                                    </div>
                                    <button type="button" @click="eliminarVacunaDeLista(index)">Quitar</button>
                                </template>
                            </li>
                        </ul>
                    </div>
                    <button type="submit">Guardar Mascota</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import Menul from '@/components/SideMenu';
// import SideMenu from '@/components/SideMenuUsuario.vue';

import apiClient from '@/services/axios'; // Asegúrate que la ruta a tu apiClient sea correcta

export default {
    components: {
        Menul
    },
    data() {
        return {
            cedulaBusqueda: "",
            usuariosEncontrados: [],
            usuarioSeleccionado: null,
            mostrarFormulario: false,
            timeoutId: null,
            mascota: {
                nombre: "",
                color: "",
                descripcion: "",
                habitat: "",
                raza: "",
                fechaNacimiento: "",
                obtencion: "",
                tipoAlimentacion: "",
                estadoReproductivo: ""
            },
            // MODELO DE VACUNA ACTUALIZADO
            vacunaForm: {
                nombreVacuna: "", // CORREGIDO: Usar 'nombreVacuna' para coincidir con el backend
                fechaVacuna: "",
                desparasitacionProducto: "",
                fechaDesparasitacion: "",
                observacion: ""
            },
            vacunasAgregadas: []
        };
    },
    methods: {
        debounceSearch(func, wait) {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(func, wait);
        },

        handleInput() {
            this.debounceSearch(this.buscarUsuario, 300);
        },

        async buscarUsuario() {
            if (this.cedulaBusqueda.trim().length > 0) {
                try {
                    const response = await fetch(`http://localhost:34568/api/usuarios/${this.cedulaBusqueda.trim()}`);
                    if (!response.ok) {
                        this.usuariosEncontrados = [];
                        if (response.status !== 404) {
                            throw new Error(`Error HTTP: ${response.status}`);
                        }
                        return;
                    }
                    const data = await response.json();
                    this.usuariosEncontrados = Array.isArray(data) ? data : (data ? [data] : []);
                     if (this.usuariosEncontrados.length === 0 && response.status === 200) {
                        Swal.fire('No encontrado', 'No se encontraron usuarios con esa cédula.', 'info');
                    }
                } catch (error) {
                    console.error("Error al buscar el usuario:", error);
                    this.usuariosEncontrados = [];
                    Swal.fire('Error de Búsqueda', 'No se pudo comunicar con el servicio de usuarios.', 'error');
                }
            } else {
                this.usuariosEncontrados = [];
            }
        },

        seleccionarUsuario(usuario) {
            this.usuarioSeleccionado = usuario;
            this.cedulaBusqueda = `${usuario.Nombre || ''} ${usuario.Apellido || ''} - Cédula: ${usuario.Cedula || ''}`;
            this.usuariosEncontrados = [];
            this.mostrarFormulario = true;
        },

        validarFormularioMascota() {
            const camposRequeridos = ['nombre', 'raza', 'fechaNacimiento'];
            for (const campo of camposRequeridos) {
                if (!this.mascota[campo] || this.mascota[campo].trim() === "") {
                    Swal.fire('Campos incompletos', `El campo '${campo}' de la mascota es requerido.`, 'warning');
                    return false;
                }
            }
            if (!this.usuarioSeleccionado || !this.usuarioSeleccionado.Cedula) {
                Swal.fire('Propietario no seleccionado', 'Debe buscar y seleccionar un propietario.', 'warning');
                return false;
            }
            return true;
        },

        async registrarMascota() {
    // 1. Validar que los datos de la mascota y el propietario estén completos.
    if (!this.validarFormularioMascota()) return;

    // 2. Mostrar un mensaje de "Cargando..." para el usuario.
    Swal.fire({
        title: 'Guardando Mascota...',
        text: 'Por favor espere.',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    // 3. Preparar el objeto de la mascota para enviar a la API.
    const mascotaParaEnviar = {
        nombre: this.mascota.nombre,
        color: this.mascota.color || null,
        descripcion: this.mascota.descripcion || null,
        habitat: this.mascota.habitat || null,
        raza: this.mascota.raza,
        fechaNacimiento: this.mascota.fechaNacimiento ? new Date(this.mascota.fechaNacimiento).toISOString() : null,
        obtencion: this.mascota.obtencion || null,
        tipoAlimentacion: this.mascota.tipoAlimentacion || null,
        estadoReproductivo: this.mascota.estadoReproductivo || null,
        cedulaPropietario: this.usuarioSeleccionado.Cedula
    };

    try {
        // 4. Enviar la petición para crear la mascota.
        const responseMascota = await apiClient.post("/mascotas", mascotaParaEnviar);

        // 5. Verificar que la mascota se creó correctamente y que la API devolvió su ID.
        if (responseMascota.status === 201 && responseMascota.data && responseMascota.data.id) {
            const mascotaCreadaId = responseMascota.data.id;
            let mensajeExito = `La mascota '${mascotaParaEnviar.nombre}' ha sido registrada con ID: ${mascotaCreadaId}.`;

            // 6. Si hay vacunas en la lista, proceder a guardarlas.
            if (this.vacunasAgregadas.length > 0) {
                Swal.update({ text: 'Mascota registrada. Registrando vacunas...' });
                let vacunasExitosas = 0;

                // 7. Iterar sobre cada vacuna que el usuario agregó a la lista.
                for (const vacuna of this.vacunasAgregadas) {
                    try {
                        // 8. Preparar el objeto para la vacuna. ¡ESTE ES EL PASO MÁS IMPORTANTE PARA DEPURAR!
                        const vacunaParaEnviar = {
                                    nombreVacuna: vacuna.nombreVacuna, // CORREGIDO: de 'nombre' a 'nombreVacuna'
                                    fechaVacuna: vacuna.fechaVacuna || null,
                                    desparasitacionProducto: vacuna.desparasitacionProducto || null,
                                    fechaDesparasitacion: vacuna.fechaDesparasitacion || null,
                                    observacion: vacuna.observacion || null
                                };

                        // ---> PUNTO DE DEPURACIÓN 1: Imprimir el objeto que se va a enviar.
                        console.log("Enviando vacuna (Payload):", JSON.stringify(vacunaParaEnviar, null, 2));
                        
                        const url = `/mascotas/${mascotaCreadaId}/vacunas`;
                        
                        // ---> PUNTO DE DEPURACIÓN 2: Imprimir la URL del endpoint.
                        console.log("Llamando al endpoint:", url);

                        // 9. Enviar la petición POST para crear el registro de la vacuna.
                        await apiClient.post(url, vacunaParaEnviar);
                        vacunasExitosas++;

                    } catch (errorVacuna) {
                        // ---> PUNTO DE DEPURACIÓN 3: Si una vacuna falla, se imprime el error.
                        console.error(`Error al registrar el registro de salud '${vacuna.nombre}':`, errorVacuna);
                    }
                }
                mensajeExito += ` Se intentaron registrar ${this.vacunasAgregadas.length} registros de salud, ${vacunasExitosas} fueron exitosos.`;
            }

            await Swal.fire('¡Registro Completo!', mensajeExito, 'success');
            this.resetFormularioCompleto(); // Limpiar todo el formulario
        } else {
            throw new Error('Respuesta inesperada del servidor al crear mascota.');
        }
    } catch (error) {

                console.error("Error en el proceso de registro:", error);
                let errorMessage = 'Hubo un problema durante el registro.';
                if (error.response && error.response.data) {
                    if (error.response.data.errors) {
                        errorMessage = "Errores de validación: \n";
                        const validationErrors = error.response.data.errors;
                        for (const key in validationErrors) {
                            errorMessage += `- ${validationErrors[key].join(', ')}\n`;
                        }
                    } else if (error.response.data.title && error.response.status === 400) {
                        errorMessage = error.response.data.title;
                    } else if (typeof error.response.data === 'string') {
                        errorMessage = error.response.data;
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }
                await Swal.fire('Error de Registro', errorMessage, 'error');
            } finally {
                if (Swal.isLoading()) {
                    Swal.close();
                }
            }
        },

        validarFormularioVacuna() {
            if (!this.vacunaForm.nombreVacuna || this.vacunaForm.nombreVacuna.trim() === "") { // CORREGIDO: chequear 'nombreVacuna'
                Swal.fire('Campo incompleto', 'Por favor complete al menos el nombre de la vacuna.', 'warning');
                return false;
            }
            return true;
        },

        agregarVacunaALista() {
            if (!this.validarFormularioVacuna()) return;
            this.vacunasAgregadas.push({ ...this.vacunaForm });
            this.vacunaForm = { // CORREGIDO: Resetear el formulario con 'nombreVacuna'
                nombreVacuna: "",
                fechaVacuna: "",
                desparasitacionProducto: "",
                fechaDesparasitacion: "",
                observacion: ""
            };
            Swal.fire({ position: 'top-end', icon: 'success', title: 'Registro agregado a la lista', showConfirmButton: false, timer: 1500 });
        },

        eliminarVacunaDeLista(index) {
            this.vacunasAgregadas.splice(index, 1);
            Swal.fire('Eliminado', 'El registro ha sido quitado de la lista.', 'info');
        },

        resetFormularioCompleto() {
            this.mascota = {
                nombre: "", color: "", descripcion: "", habitat: "", raza: "",
                fechaNacimiento: "", obtencion: "", tipoAlimentacion: "", estadoReproductivo: ""
            };
            // RESET COMPLETO DE VACUNAS ACTUALIZADO
            this.vacunaForm = { // CORREGIDO: Resetear con 'nombreVacuna'
                nombreVacuna: "",
                fechaVacuna: "",
                desparasitacionProducto: "",
                fechaDesparasitacion: "",
                observacion: ""
            };
            this.vacunasAgregadas = [];
            this.cedulaBusqueda = "";
            this.usuariosEncontrados = [];
            this.usuarioSeleccionado = null;
            this.mostrarFormulario = false;
        }
    },
    beforeUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
};
</script>

<style scoped>
.register-user {
    display: flex;
    flex-direction: row;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

.sidebar-area {
    width: 280px;
    flex-shrink: 0;
    height: 100vh;
    overflow-y: auto;
    background-color: #f8f9fa;
    border-right: 1px solid #dee2e6;
}

.content {
    flex-grow: 1;
    height: 100vh;
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
}

header h1 {
    text-align: center;
    color: #333;
    margin-top: 0;
    margin-bottom: 20px;
}

.search-container {
    margin-bottom: 20px;
    position: relative;
}

.search-input {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.usuario-result {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    border-top: none;
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.usuario-result ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.usuario-result li {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
}
.usuario-result li:last-child {
    border-bottom: none;
}

.usuario-result li:hover {
    background-color: #f0f0f0;
}

.mascota-form {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-top: 20px;
}

.mascota-form h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #495057;
}

.mascota-form label {
    display: block;
    margin-top: 10px; /* Espacio antes de cada label */
    margin-bottom: 6px;
    font-weight: 600;
    color: #495057;
}

.mascota-form input[type="text"],
.mascota-form input[type="date"],
.mascota-form select,
.mascota-form textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px; /* Espacio reducido para agrupar label+input */
    border: 1px solid #ced4da;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 0.95em;
}

.mascota-form input[type="text"]:focus,
.mascota-form input[type="date"]:focus,
.mascota-form select:focus,
.mascota-form textarea:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.mascota-form textarea {
    resize: vertical;
    min-height: 80px;
}

.mascota-form button[type="submit"],
.mascota-form button[type="button"] {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    margin-right: 10px;
    transition: background-color 0.15s ease-in-out;
}

.mascota-form button[type="submit"]:hover,
.mascota-form button[type="button"]:hover {
    background-color: #218838;
}

.vacunas-container {
    border: 1px solid #e9ecef;
    padding: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
    background-color: #f8f9fa;
}
.vacunas-container h3, .mascota-form h3, .vacunas-container h4 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #343a40;
}
.vacunas-container input[type="text"],
.vacunas-container input[type="date"],
.vacunas-container textarea {
    margin-bottom: 10px; 
}
.vacunas-container ul {
    list-style-type: none;
    padding-left: 0; 
}
.vacunas-container li {
    padding: 10px; 
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px; /* Espacio entre el texto y el botón */
}
.vacunas-container li:last-child {
    border-bottom: none;
}

.vacunas-container li div {
    line-height: 1.4; /* Mejora la legibilidad del texto en la lista */
}

.vacunas-container li button[type="button"] {
    background-color: #dc3545;
    padding: 5px 10px;
    font-size: 0.8em;
    flex-shrink: 0; /* Evita que el botón se encoja */
}
.vacunas-container li button[type="button"]:hover {
    background-color: #c82333;
}
</style>
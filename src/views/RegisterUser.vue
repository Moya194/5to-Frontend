<template>
    <div class="register-user">
        <menul /> <!-- Menú lateral -->
        <div class="content">
            <header>
                <h1>Registro de Usuarios</h1>
                <p>Gestiona el registro de usuarios en el sistema.</p>
            </header>

            <section class="actions">
                <button @click="abrirModal">Registrar Usuario</button>
                <input type="text" v-model="busqueda" placeholder="Buscar usuario..." class="search-input" />
            </section>
            <section class="info">
                <h2>Usuarios Registrados</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Dirección</th>
                            <th>Ocupación</th>
                            <th>Cédula</th>
                            <th>Teléfono</th>
                            <th>Teléfono Fijo</th>
                            <th>Correo</th>
                            <th>Tipo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(usuario, index) in usuariosFiltrados" :key="usuario.Id">
                            <td>{{ usuario.Nombre }}</td>
                            <td>{{ usuario.Apellido }}</td>
                            <td>{{ usuario.Direccion }}</td>
                            <td>{{ usuario.Ocupacion }}</td>
                            <td>{{ usuario.Cedula }}</td>
                            <td>{{ usuario.Telefono }}</td>
                            <td>{{ usuario.TelefonoFijo }}</td>
                            <td>{{ usuario.Correo }}</td>
                            <td>{{ usuario.Tipo }}</td>
                            <td>
                                <button @click="editarUsuario(index)">
                                    <i class='bx bx-pencil'></i> </button>
                                <button @click="eliminarUsuario(usuario.Id)">
                                    <i class='bx bx-trash'></i>
                                </button>
                                <button @click="verUsuario(usuario)">
                                    <i class='bx bx-show'></i>
                                </button>
                            </td>

                            <td>
                                <button @click="editarUsuario(index)">
                                    <i class="fas fa-pencil-alt"></i>
                                </button>
                                <button @click="eliminarUsuario(usuario.Id)">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button @click="verUsuario(usuario)">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>

                        </tr>

                    </tbody>
                </table>
            </section>

            <!-- Modal para registrar/editar usuario -->
            <div v-if="mostrarModal" class="modal">
                <div class="modal-content">
                    <span class="close" @click="cerrarModal">&times;</span>
                    <h2>{{ esEdicion ? 'Editar Usuario' : 'Registrar Usuario' }}</h2>
                    <form @submit.prevent="guardarUsuario" class="form-grid">
                        <div class="form-group">
                            <label for="nombre">Nombre:</label>
                            <input type="text" id="nombre" v-model="nuevoUsuario.nombre" required />
                        </div>
                        <div class="form-group">
                            <label for="apellido">Apellido:</label>
                            <input type="text" id="apellido" v-model="nuevoUsuario.apellido" required />
                        </div>
                        <div class="form-group">
                            <label for="direccion">Dirección:</label>
                            <input type="text" id="direccion" v-model="nuevoUsuario.direccion" required />
                        </div>
                        <div class="form-group">
                            <label for="ocupacion">Ocupación:</label>
                            <input type="text" id="ocupacion" v-model="nuevoUsuario.ocupacion" required />
                        </div>
                        <div class="form-group">
                            <label for="cedula">Cédula:</label>
                            <input type="text" id="cedula" v-model="nuevoUsuario.cedula" required />
                        </div>
                        <div class="form-group">
                            <label for="telefono">Teléfono:</label>
                            <input type="text" id="telefono" v-model="nuevoUsuario.telefono" required />
                        </div>
                        <div class="form-group">
                            <label for="telefonoFijo">Teléfono Fijo:</label>
                            <input type="text" id="telefonoFijo" v-model="nuevoUsuario.telefonoFijo" />
                        </div>
                        <div class="form-group">
                            <label for="correo">Correo:</label>
                            <input type="email" id="correo" v-model="nuevoUsuario.correo" required />
                        </div>
                        <div class="form-group">
                            <label for="tipo">Tipo:</label>
                            <select id="tipo" v-model="nuevoUsuario.tipo" required>
                                <option value="Administrador">Administrador</option>
                                <option value="Usuario">Usuario</option>
                            </select>
                        </div>
                        <div class="form-group full-width">
                            <button type="submit">{{ esEdicion ? 'Actualizar' : 'Guardar' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Menul from '@/components/SideMenu';
import Swal from 'sweetalert2';

export default {
    name: 'RegisterUser',
    components: {
        Menul
    },
    data() {
        return {
            usuarios: [],
            nuevoUsuario: {
                id: null,
                nombre: '',
                apellido: '',
                direccion: '',
                ocupacion: '',
                cedula: '',
                telefono: '',
                telefonoFijo: '',
                correo: '',
                tipo: ''
            },
            mostrarModal: false,
            busqueda: '',
            esEdicion: false
        };
    },
    computed: {
        usuariosFiltrados() {
            return this.usuarios.filter(usuario => {
                if (!usuario || !usuario.Nombre) return false; // Nota la mayúscula en Nombre
                return usuario.Nombre.toLowerCase().includes((this.busqueda || '').toLowerCase()) ||
                    usuario.Cedula.includes(this.busqueda || ''); // Nota la mayúscula en Cedula
            });
        }
    },
    methods: {
        async cargarUsuarios() {
            try {
                const response = await fetch('http://localhost:34568/api/usuarios');
                const data = await response.json();
                console.log('Usuarios cargados:', data); // Verifica en la consola del navegador
                this.usuarios = data;
            } catch (error) {
                Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
            }
        },
        abrirModal() {
            this.mostrarModal = true;
            this.esEdicion = false;
        },
        cerrarModal() {
            this.mostrarModal = false;
            this.nuevoUsuario = {
                id: null,
                nombre: '',
                apellido: '',
                direccion: '',
                ocupacion: '',
                cedula: '',
                telefono: '',
                telefonoFijo: '',
                correo: '',
                tipo: ''
            };
        },
        async guardarUsuario() {
            try {
                const url = this.esEdicion
                    ? `http://localhost:34568/api/usuarios/${this.nuevoUsuario.id}`
                    : 'http://localhost:34568/api/usuarios';
                const method = this.esEdicion ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.nuevoUsuario)
                });

                if (response.ok) {
                    Swal.fire('Éxito', this.esEdicion ? 'Usuario actualizado' : 'Usuario registrado', 'success');
                    this.cerrarModal();
                    this.cargarUsuarios();
                } else {
                    Swal.fire('Error', 'Hubo un problema al guardar el usuario', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al guardar el usuario', 'error');
            }
        },
        editarUsuario(index) {
            this.nuevoUsuario = { ...this.usuarios[index] };
            this.mostrarModal = true;
            this.esEdicion = true;
        },
        async eliminarUsuario(id) {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'No podrás revertir esto',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar'
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:34568/api/usuarios/${id}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
                        this.cargarUsuarios();
                    } else {
                        Swal.fire('Error', 'Hubo un problema al eliminar el usuario', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Hubo un problema al eliminar el usuario', 'error');
                }
            }
        },
        verUsuario(usuario) {
            Swal.fire({
                title: 'Detalles del Usuario',
                html: `
            <p><strong>Nombre:</strong> ${usuario.nombre}</p>
            <p><strong>Apellido:</strong> ${usuario.apellido}</p>
            <p><strong>Cédula:</strong> ${usuario.cedula}</p>
            <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
            <p><strong>Correo:</strong> ${usuario.correo}</p>
          `,
                icon: 'info'
            });
        }
    },
    mounted() {
        this.cargarUsuarios();
    }
};
</script>
<style scoped>
* {
    font-family: 'Montserrat', sans-serif;
}

.register-user {
    display: flex;
}

.content {
    margin-left: 250px;
    padding: 20px;
    width: 100%;
}

header {
    text-align: center;
    margin-bottom: 20px;
}

h1 {
    font-size: 2rem;
    color: #42b983;
}

.actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
}

button {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #36976b;
}

.search-input {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.info {
    text-align: center;
}

/* Agregamos un contenedor que permita desplazamiento horizontal */
.table-container {
    width: 100%;
    overflow-x: auto;
    margin-top: 20px;
}

table {
    width: 100%;
    min-width: 600px;
    /* Evita que la tabla se colapse en pantallas pequeñas */
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    border: 1px solid #ddd;
}

th {
    background-color: #42b983;
    color: white;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 90%;
    max-width: 800px;
    overflow-y: auto;
    max-height: 90vh;
}

.close {
    float: right;
    cursor: pointer;
    font-size: 1.5rem;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

label {
    margin-bottom: 5px;
    font-weight: bold;
}

input,
select {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 600px) {
    .form-grid {
        grid-template-columns: 1fr;
    }

    /* Mejora el comportamiento de la tabla en pantallas pequeñas */
    .table-container {
        margin-top: 10px;
    }

    table {
        min-width: 320px;
        /* Hace que la tabla sea más accesible en dispositivos más pequeños */
    }

    th,
    td {
        font-size: 14px;
        /* Reducimos el tamaño de las celdas para que no se vean tan grandes */
    }
}
</style>

<template>
    <div>
        <SideMenuUsuario @menu-toggle="handleMenuToggle" />
    
        <div class="mismascotas" :class="{ 'menu-collapsed': !isMenuOpen }">
            <div class="mascotas-container">
                <h1>Mis Mascotas</h1>
                <div v-if="loading" class="loading">
                    <div class="loading-spinner"></div>
                    <span>Cargando...</span>
                </div>
                <div v-else-if="error" class="error-message">
                    <p> {{ error }} </p>
                </div>
                <div v-else-if="mascotas.length === 0" class="no-mascotas">
                    <p>No tienes mascotas registradas.</p>
                </div>
                <div v-else class="mascotas-list">
                    <div v-for="mascota in mascotas" :key="mascota.id" class="mascota-card">
                        <div class="mascota-avatar">
                            <img :src="mascota.imagenPlaceholder || '/ruta/a/imagen/por/defecto.jpg'" alt="Mascota" />
                        </div>
                        <div class="mascota-info">
                            <h2>{{ mascota.nombre }}</h2>
                            <p><strong>Raza:</strong> {{ mascota.raza || 'No especificado' }}</p>
                            <p><strong>Color:</strong> {{ mascota.color || 'No especificado' }}</p>
                            <p><strong>Estado Reproductivo:</strong> {{ mascota.estadoReproductivo || 'No especificado' }}</p>
                            <p><strong>Fecha de Nacimiento:</strong> {{ formatFecha(mascota.fechaNacimiento) }}</p>
                            <p><strong>Descripción:</strong> {{ mascota.descripcion || 'Sin descripción' }}</p>
                            <p><strong>Tipo de Alimentación:</strong> {{ mascota.tipoAlimentacion || 'No especificado' }}</p>
                            <p><strong>Obtención:</strong> {{ mascota.obtencion || 'No especificado' }}</p>
                            <p><strong>Cédula Propietario:</strong> {{ mascota.cedulaPropietario }}</p>
                            
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script>
import Cookies from 'js-cookie';
import SideMenuUsuario from '@/components/SideMenuUsuario.vue';
import apiClient from '@/services/axios'; // Asegúrate que la ruta a tu apiClient sea correcta

export default {
    name: 'MisMascotas',
    components: {
        SideMenuUsuario,
    },
    data() {
        return {
            mascotas: [],
            loading: true,
            error: null, // Para manejar errores de API
            isMenuOpen: true,
            cedulaDelPropietarioLogueado: null, // DEBES OBTENER ESTO DE ALGUNA MANERA (ej. cookies, store, otra API call)
        };
    },
    async created() {
        // Asume que obtienes la cédula del propietario aquí.
        // Por ejemplo, si la cédula también está en una cookie:
        this.cedulaDelPropietarioLogueado = Cookies.get('CedulaPropietario'); // O la forma que tengas para obtenerla

        if (this.cedulaDelPropietarioLogueado) {
            await this.obtenerMascotas();
        } else {
            this.error = "No se pudo identificar la cédula del propietario para cargar las mascotas.";
            this.loading = false;
            // Podrías redirigir al login o mostrar un mensaje más prominente
            console.error("CedulaPropietario no encontrada para el usuario logueado.");
        }
    },
    methods: {
        handleMenuToggle(isOpen) {
            this.isMenuOpen = isOpen;
        },
        async obtenerMascotas() {
            this.loading = true;
            this.error = null;
            if (!this.cedulaDelPropietarioLogueado) {
                this.error = "Cédula del propietario no disponible.";
                this.loading = false;
                return;
            }
            try {
                // Llamada a tu nueva API usando apiClient y el filtro
                const response = await apiClient.get(`/mascotas?cedulaPropietario=${this.cedulaDelPropietarioLogueado}&includeRelated=false`);
                // includeRelated=true si quieres cargar vacunas, constancias, etc. con la mascota
                
                this.mascotas = response.data;
            } catch (err) {
                console.error('Error al obtener las mascotas:', err);
                this.error = 'Error al obtener las mascotas. Intente más tarde.';
                // Manejo de error más específico si la API devuelve detalles
                if (err.response && err.response.data && err.response.data.message) {
                    this.error = err.response.data.message;
                } else if (err.message) {
                    this.error = err.message;
                }
            } finally {
                this.loading = false;
            }
        },
        formatFecha(fecha) {
            if (!fecha) return 'No especificada';
            try {
                // Asume que la fecha viene en formato ISO (ej: "2023-05-15T00:00:00")
                const d = new Date(fecha);
                // Comprueba si la fecha es válida
                if (isNaN(d.getTime())) {
                    return 'Fecha inválida';
                }
                return d.toLocaleDateString(); // Formato local (ej: 15/05/2023)
            } catch (e) {
                console.error("Error formateando fecha: ", fecha, e);
                return fecha; // Devuelve la fecha original si hay error
            }
        }
    },
};
</script>
    
<style scoped>
/* Tus estilos de .mismascotas, .mascotas-container, etc. permanecen aquí */
/* Añadido para mensajes de error o no mascotas */
.error-message, .no-mascotas {
    text-align: center;
    padding: 20px;
    font-size: 1.2em;
    color: #777;
}

.mismascotas {
    margin-left: 250px; /* Ajusta según el ancho de tu SideMenuUsuario */
    padding: 2rem;
    min-height: 100vh;
    transition: margin-left 0.3s ease;
    background: #f8f9fa; /* Un fondo suave para la página */
}

.mismascotas.menu-collapsed {
    margin-left: 60px; /* Ajusta según el ancho de tu SideMenuUsuario colapsado */
}

.mascotas-container {
    max-width: 1200px; /* Un poco más de ancho para tarjetas */
    margin: 0 auto;
    background: transparent; /* Quitar fondo blanco si mismascotas ya tiene uno */
    border-radius: 0; /* Quitar si no se necesita */
    padding: 0; /* Quitar padding si las tarjetas lo manejan */
    box-shadow: none; /* Quitar sombra si no se necesita */
}

h1 {
    color: #343a40; /* Color de texto más oscuro */
    font-size: 2.2rem; /* Ligeramente más grande */
    margin-bottom: 2.5rem; /* Más espacio debajo del título */
    text-align: center;
    font-weight: 600;
}

.mascotas-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* Tarjetas un poco más anchas */
    gap: 2rem;
}

.mascota-card {
    display: flex;
    flex-direction: column; /* Elementos de la tarjeta en columna */
    background-color: #fff;
    border-radius: 10px; /* Bordes más suaves */
    padding: 1.5rem; /* Más padding interno */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Sombra más sutil y moderna */
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    overflow: hidden; /* Para que el contenido no se desborde de los bordes redondeados */
}

.mascota-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.mascota-avatar {
    width: 120px; /* Tamaño del avatar */
    height: 120px;
    border-radius: 50%;
    overflow: hidden; /* Para asegurar que la imagen quede redonda */
    margin: 0 auto 1.5rem auto; /* Centrado y con espacio debajo */
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    flex-shrink: 0;
}

.mascota-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Asegura que la imagen cubra el área sin distorsionarse */
}

.mascota-info {
    text-align: left; /* Alineación a la izquierda para mejor legibilidad */
    width: 100%;
}

.mascota-info h2 {
    color: #495057;
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
    font-weight: 600;
}

.mascota-info p {
    color: #6c757d;
    font-size: 0.95rem;
    margin-bottom: 0.4rem; /* Menos espacio entre párrafos */
    line-height: 1.6;
}
.mascota-info p strong {
    color: #495057; /* Color más oscuro para los títulos de campo */
}


.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; /* Centrar el spinner */
    gap: 1rem;
    padding: 3rem; /* Más padding */
    font-size: 1.2em;
    color: #555;
}

.loading-spinner {
    width: 50px; /* Spinner más grande */
    height: 50px;
    border: 5px solid #e9ecef; /* Color de borde más suave */
    border-top: 5px solid #5cb85c; /* Color principal (verde) */
    border-radius: 50%;
    animation: spin 0.8s linear infinite; /* Animación un poco más rápida */
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .mismascotas {
        margin-left: 0; /* O el ancho del menú colapsado si tienes uno */
        padding: 1rem;
    }

    .mascotas-container {
        padding: 1rem; /* Ajustar padding para móviles */
    }

    h1 {
        font-size: 1.8rem; /* Título más pequeño en móviles */
        margin-bottom: 1.5rem;
    }

    .mascotas-list {
        /* grid-template-columns: 1fr; Una columna en móviles */
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Ajustar minmax para móviles */
        gap: 1.5rem;
    }
    .mascota-card {
        padding: 1rem;
    }
    .mascota-avatar {
        width: 100px;
        height: 100px;
        margin-bottom: 1rem;
    }
    .mascota-info h2 {
        font-size: 1.25rem;
    }
    .mascota-info p {
        font-size: 0.9rem;
    }
}
</style>
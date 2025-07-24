import apiClient from '../services/axios'; 
import userApiClient from '../services/userApi'// Importamos el cliente Axios para la API de Veterinaria

/**
 * El servicio de mascotas encapsula todas las llamadas a la API
 * relacionadas con la entidad Mascota.
 */
export default {
  /**
   * Obtiene una lista de todas las mascotas.
   * @returns {Promise} La promesa de Axios con la lista de mascotas.
   */
  getMascotas() {
    return apiClient.get('/mascotas');
  },

  /**
   * Obtiene los detalles de una única mascota por su ID.
   * Esta es la función que usa tu formulario de Constancia.
   * Asume que la API devuelve la mascota con su propietario anidado.
   * @param {string | number} id - El ID de la mascota.
   * @returns {Promise} La promesa de Axios con los datos de la mascota.
   */
  getMascota(id) {
    return apiClient.get(`/mascotas/${id}`);
  },

  /**
   * Crea una nueva mascota.
   * @param {object} mascotaData - Los datos de la mascota a crear.
   * @returns {Promise} La promesa de Axios.
   */
  createMascota(mascotaData) {
    return apiClient.post('/mascotas', mascotaData);
  },

  /**
   * Actualiza una mascota existente.
   * @param {string | number} id - El ID de la mascota a actualizar.
   * @param {object} mascotaData - Los nuevos datos para la mascota.
   * @returns {Promise} La promesa de Axios.
   */
  updateMascota(id, mascotaData) {
    return apiClient.put(`/mascotas/${id}`, mascotaData);
  },

  /**
   * Elimina una mascota.
   * @param {string | number} id - El ID de la mascota a eliminar.
   * @returns {Promise} La promesa de Axios.
   */
  deleteMascota(id) {
    return apiClient.delete(`/mascotas/${id}`);
  },
  getMascotasPorUsuarioId(usuarioId) {
    // Usa el cliente de la API de usuarios y el endpoint correcto
    return userApiClient.get(`/mascotas-usuario/${usuarioId}`);
},
};
import apiClient from '../services/axios'; // Usamos el mismo cliente de la API de Veterinaria

/**
 * El servicio de constancias encapsula todas las llamadas a la API
 * relacionadas con la entidad Constancia.
 */
export default {
  /**
   * Obtiene una constancia específica por su ID.
   * @param {string | number} constanciaId - El ID de la constancia.
   * @returns {Promise} La promesa de Axios.
   */
  getConstanciaById(constanciaId) {
    return apiClient.get(`/constancias/${constanciaId}`);
  },

  /**
   * Crea una nueva constancia para una mascota.
   * @param {string | number} mascotaId - El ID de la mascota a la que pertenece la constancia.
   * @param {object} constanciaData - Los datos de la nueva constancia.
   * @returns {Promise} La promesa de Axios.
   */
  createConstanciaForMascota(mascotaId, constanciaData) {
    // Nota cómo la URL coincide con la lógica de tu API (recurso anidado)
    return apiClient.post(`/mascotas/${mascotaId}/constancias`, constanciaData);
  },

  /**
   * Actualiza una constancia existente.
   * @param {string | number} constanciaId - El ID de la constancia a actualizar.
   * @param {object} constanciaData - Los nuevos datos para la constancia.
   * @returns {Promise} La promesa de Axios.
   */
  updateConstancia(constanciaId, constanciaData) {
    return apiClient.put(`/constancias/${constanciaId}`, constanciaData);
  },
  getAllConstancias() {
  // Este endpoint debe devolver un array de constancias desde tu API de Veterinaria (C#)
  return apiClient.get('/constancias'); 
},
deleteConstanciaById(id) {
    // Asume que tu API tiene un endpoint DELETE /constancias/{id}
    return apiClient.delete(`/constancias/${id}`);
  },
};
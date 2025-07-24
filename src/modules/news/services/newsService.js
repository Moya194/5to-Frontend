import apiClient from '@/services/newsServices'; // Importamos nuestra instancia configurada de Axios

export const newsService = {
  /**
   * Obtiene la lista de noticias y notificaciones.
   * @param {object} params - Parámetros para la API (ej. paginación, filtros).
   * Ej: { page: 1, limit: 10, type: 'alerta' }
   * @returns {Promise<object>} Una promesa que resuelve a un objeto con { items: [], total: 0 } o { error: true }
   */
  async getNews(params = {}) {
    try {
      // Asumimos que tu endpoint para noticias es '/news' o '/noticias'
      // ¡Ajusta '/news' al endpoint correcto de tu API!
      const response = await apiClient.get('/news', { params });

      // Validación básica de la respuesta esperada de la API.
      // Supongamos que tu API devuelve un objeto con una propiedad 'items' (array)
      // y opcionalmente 'total' para paginación.
      if (response.data && Array.isArray(response.data.items)) {
        return {
          items: response.data.items, // El array de noticias/notificaciones
          total: response.data.total || response.data.items.length // Cantidad total para paginación
        };
      } else {
        // Si la estructura no es la esperada, loguea un error y devuelve una estructura de error.
        console.error('Respuesta inesperada de la API de noticias:', response.data);
        return { items: [], total: 0, error: true, message: 'Respuesta inesperada de la API.' };
      }
    } catch (error) {
      console.error('Error al obtener noticias desde newsService:', error);
      // Devolvemos un objeto de error para que el store pueda manejarlo.
      return { items: [], total: 0, error: true, message: error.message || 'Error de conexión.' };
    }
  },

  /**
   * Obtiene el detalle de una noticia/notificación específica por su ID.
   * @param {string|number} id - El ID de la noticia/notificación.
   * @returns {Promise<object|null>} Una promesa que resuelve al objeto de la noticia o null si hay error/no se encuentra.
   */
  async getNewsById(id) {
    if (!id) {
      console.warn('Se intentó obtener una noticia sin ID.');
      return null;
    }
    try {
      // ¡Ajusta '/news/${id}' al endpoint correcto de tu API!
      const response = await apiClient.get(`/news/${id}`);

      // Validación básica: ¿La API devolvió datos?
      if (response.data) {
        return response.data; // El objeto de la noticia/notificación
      } else {
        // Podría ser un 404 manejado como data vacía, o un error.
        console.warn(`No se encontraron datos para la noticia con ID: ${id}`);
        return null;
      }
    } catch (error) {
      console.error(`Error al obtener la noticia ${id} desde newsService:`, error);
      return null; // Devolvemos null para indicar que no se pudo obtener.
    }
  }

  // --- Futuras funciones que podrías necesitar ---
  // async createNews(newsData) { ... }
  // async updateNews(id, newsData) { ... }
  // async deleteNews(id) { ... }
  // async markNewsAsReadOnServer(id) { ... } // Si el backend maneja el estado de "leído"
};
// src/modules/news/store/newsStore.js
import { defineStore } from 'pinia';
import { newsService } from '../services/newsService'; // Tu servicio de noticias

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsItems: [], // Aquí guardaremos la lista de noticias/notificaciones
    totalNews: 0, // Para la paginación
    currentNewsItem: null, // Para cuando se vea el detalle de una noticia
    isLoading: false, // Para mostrar indicadores de carga en la UI
    error: null, // Para manejar errores y mostrarlos en la UI

    // Filtros y paginación (puedes expandir esto)
    pagination: {
      currentPage: 1,
      itemsPerPage: 10, // Puedes ajustar este valor por defecto
    },
    // Podríamos tener más filtros aquí, ej: filterByType: null

    // Para manejar el estado de "visto" en el cliente (mejora cuando roles estén listos)
    seenNewsIds: new Set(JSON.parse(localStorage.getItem('newsApp_seenNews_v1') || '[]')),

    // --- PREPARACIÓN PARA ROLES ---
    // Asumimos que el rol del usuario actual se obtendrá de un store de autenticación global eventualmente.
    // Por ahora, podemos simularlo o fijarlo para desarrollo:
    currentUserRole: 'admin', // O 'common_user', o null hasta que se cargue.
                               // Cambia esto para probar diferentes vistas.
  }),

  getters: {
    /**
     * Devuelve las noticias filtradas según el rol del usuario actual.
     * Este getter se adaptará completamente cuando la API envíe targetRoles.
     */
    filteredNewsItems: (state) => {
      if (!state.newsItems || state.newsItems.length === 0) {
        return [];
      }

      // --- LÓGICA DE ROLES (A AJUSTAR EL LUNES) ---
      // Si el usuario es 'admin', por ahora le mostramos todo.
      if (state.currentUserRole === 'admin') {
        return state.newsItems;
      }

      // Cuando 'targetRoles' esté disponible y sea un array en cada item:
      // return state.newsItems.filter(item => {
      //   if (!item.targetRoles || item.targetRoles.length === 0) {
      //     return true; // Si no tiene roles definidos, se muestra a todos (o tu lógica por defecto)
      //   }
      //   // Comprobar si el rol del usuario actual está en targetRoles
      //   // o si targetRoles incluye 'all' o un rol público.
      //   return item.targetRoles.includes(state.currentUserRole) || item.targetRoles.includes('all');
      // });

      // Por ahora, si no es admin, y no tenemos la lógica de targetRoles, mostramos todo (o filtramos por un rol común por defecto)
      // ESTO ES TEMPORAL HASTA QUE TENGAS targetRoles DESDE LA API:
      return state.newsItems.filter(item => {
          // Ejemplo temporal: si un item tiene targetRoles (aunque sea un string JSON por ahora)
          // y no podemos parsearlo o no está el rol, lo ocultamos si no es admin
          if (item.TargetRolesJson && typeof item.TargetRolesJson === 'string') {
            try {
                const roles = JSON.parse(item.TargetRolesJson);
                return roles.includes(state.currentUserRole) || roles.includes('all');
            } catch (e) {
                // Si no se puede parsear, ¿mostrar o no? Por defecto, si no es admin, no mostrar.
                return false; 
            }
          }
          // Si no hay TargetRolesJson, por ahora lo mostramos si el usuario es 'common_user' o 'all'.
          // Ajusta esta lógica temporal según necesites.
          return state.currentUserRole === 'common_user' || state.currentUserRole === 'all'; 
      });
    },

    // Ejemplo de un getter para notificaciones "nuevas" (no vistas)
    newNotificationsCount: (state) => {
      // Filtra los items que no están en seenNewsIds
      // Podrías añadir más lógica, ej: que también sean de tipo 'notificacion'
      return state.newsItems.filter(item => !state.seenNewsIds.has(item.id)).length;
    },

    // Getter para saber si hay un ítem cargado en currentNewsItem
    hasCurrentNewsItem: (state) => !!state.currentNewsItem,
  },

  actions: {
    /**
     * Obtiene las noticias desde el servicio y actualiza el estado.
     */
    async fetchNews() {
      this.isLoading = true;
      this.error = null;
      try {
        const params = {
          page: this.pagination.currentPage,
          limit: this.pagination.itemsPerPage,
          // Aquí podrías añadir más parámetros para el servicio si tienes filtros activos
          // ej: type: this.filterByType
          // Si el backend filtra por rol basado en el token del usuario, no necesitas pasar 'role' aquí.
          // Si necesitas pasar el rol explícitamente (menos común para GETs de listas):
          // role: this.currentUserRole 
        };

        const response = await newsService.getNews(params);

        if (response && !response.error) {
          // Asumimos que 'TargetRolesJson' viene de la API tal como está en la BD.
          // Lo ideal sería que la API ya lo devuelva parseado como un array 'targetRoles'.
          // Si no, lo parseamos aquí (o mejor aún, en el newsService).
          this.newsItems = response.items.map(item => {
            let parsedTargetRoles = [];
            if (item.TargetRolesJson && typeof item.TargetRolesJson === 'string') {
              try {
                parsedTargetRoles = JSON.parse(item.TargetRolesJson);
              } catch (e) {
                console.error(`Error parseando TargetRolesJson para item ${item.id}:`, e);
                // Dejar parsedTargetRoles como array vacío o manejar el error como prefieras
              }
            } else if (Array.isArray(item.targetRoles)) { // Si la API ya lo envía parseado
                parsedTargetRoles = item.targetRoles;
            }
            return {
              ...item, // Mantenemos todos los campos originales
              targetRoles: parsedTargetRoles, // Nuevo campo con el array parseado
            };
          });
          this.totalNews = response.total;
        } else {
          this.error = response.message || 'No se pudieron cargar las noticias.';
          this.newsItems = [];
          this.totalNews = 0;
        }
      } catch (err) { // Error no controlado por el servicio (ej. de red si el servicio no lo manejó)
        this.error = 'Ocurrió un error inesperado al obtener noticias.';
        this.newsItems = [];
        this.totalNews = 0;
        console.error("Error en fetchNews action:", err);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Obtiene el detalle de una noticia específica.
     * @param {string|number} newsId
     */
    async fetchNewsDetail(newsId) {
      this.isLoading = true;
      this.error = null;
      this.currentNewsItem = null; // Limpiar el item actual
      try {
        const item = await newsService.getNewsById(newsId);
        if (item) {
          // Similar al fetchNews, parsear TargetRolesJson si es necesario
          let parsedTargetRoles = [];
          if (item.TargetRolesJson && typeof item.TargetRolesJson === 'string') {
            try {
              parsedTargetRoles = JSON.parse(item.TargetRolesJson);
            } catch (e) {
              console.error(`Error parseando TargetRolesJson para item ${item.id}:`, e);
            }
          } else if (Array.isArray(item.targetRoles)) {
            parsedTargetRoles = item.targetRoles;
          }
          this.currentNewsItem = { ...item, targetRoles: parsedTargetRoles };
          this.markNewsAsSeen(newsId); // Marcar como vista al cargar el detalle
        } else {
          this.error = 'No se encontró la noticia o notificación.';
        }
      } catch (err) {
        this.error = 'Error al cargar el detalle de la noticia.';
        console.error("Error en fetchNewsDetail action:", err);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Acción para marcar una noticia como vista.
     * @param {string|number} newsId
     */
    markNewsAsSeen(newsId) {
      this.seenNewsIds.add(newsId);
      localStorage.setItem('newsApp_seenNews_v1', JSON.stringify(Array.from(this.seenNewsIds)));
    },

    /**
     * Cambia la página actual y vuelve a cargar las noticias.
     * @param {number} page
     */
    changePage(page) {
      if (page > 0) {
        this.pagination.currentPage = page;
        this.fetchNews(); // Vuelve a cargar noticias para la nueva página
      }
    },

    /**
     * Placeholder para una acción que cambie el rol del usuario (para desarrollo/pruebas)
     * @param {string} newRole
     */
    setCurrentUserRole_dev(newRole) {
        this.currentUserRole = newRole;
        // Opcionalmente, podrías querer recargar las noticias si el filtrado es por API
        // this.fetchNews(); 
        // O simplemente dejar que los getters reactivos actualicen la vista si el filtrado es en cliente.
    }
  }
});
<template>
  <div class="news-list-container">
    <div v-if="newsStore.isLoading" class="loading-state">
      <p>Cargando noticias... ⏳</p>
      </div>

    <div v-else-if="newsStore.error" class="error-state">
      <p>😟 {{ newsStore.error }}</p>
      <button @click="retryFetchNews">Intentar de nuevo</button>
    </div>

    <div v-else-if="!filteredNewsItems || filteredNewsItems.length === 0" class="empty-state">
      <p>📭 No hay noticias o notificaciones para mostrar en este momento.</p>
      </div>

    <div v-else class="news-list">
      <NewsItem
        v-for="item in filteredNewsItems"
        :key="item.id"
        :item="item"
        @view-detail="handleViewDetail"
      />
    </div>

    <div v-if="newsStore.totalNews > 0 && newsStore.totalNews > newsStore.pagination.itemsPerPage" class="pagination-controls">
      <button 
        @click="changePage(newsStore.pagination.currentPage - 1)" 
        :disabled="newsStore.pagination.currentPage <= 1 || newsStore.isLoading">
        Anterior
      </button>
      <span>
        Página {{ newsStore.pagination.currentPage }} de {{ totalPages }}
      </span>
      <button 
        @click="changePage(newsStore.pagination.currentPage + 1)" 
        :disabled="newsStore.pagination.currentPage >= totalPages || newsStore.isLoading">
        Siguiente
      </button>
    </div>

    <NewsDetailModal
      v-if="selectedNewsId"
      :news-id="selectedNewsId"
      @close="selectedNewsId = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useNewsStore } from '@/modules/news/store/newsStore';
import NewsItem from './NewsItem.vue';
import NewsDetailModal from './NewsDetailModal.vue'; // Opcional, si usas modal

const newsStore = useNewsStore();
const selectedNewsId = ref(null); // Para el modal de detalle

// Usar el getter del store para obtener las noticias filtradas
const filteredNewsItems = computed(() => newsStore.filteredNewsItems);

// Calcular el total de páginas para la paginación
const totalPages = computed(() => {
  if (newsStore.totalNews === 0 || newsStore.pagination.itemsPerPage === 0) {
    return 1;
  }
  return Math.ceil(newsStore.totalNews / newsStore.pagination.itemsPerPage);
});

// Llamar a la acción para obtener noticias cuando el componente se monta
onMounted(() => {
  if (newsStore.newsItems.length === 0) { // Solo cargar si no hay noticias ya (evita recargas innecesarias)
    newsStore.fetchNews();
  }
});

const retryFetchNews = () => {
  newsStore.fetchNews();
};

const handleViewDetail = (newsId) => {
  selectedNewsId.value = newsId;
  // No es necesario llamar a fetchNewsDetail aquí si el modal lo hace por sí mismo
  // newsStore.fetchNewsDetail(newsId); // Esto se haría dentro de NewsDetailModal
};

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    newsStore.changePage(page); // Llama a la acción del store para cambiar de página
  }
};

// // --- Para probar el cambio de rol (desarrollo) ---
// // Puedes llamar a esta función desde las DevTools de Vue o un botón temporal
// const simulateRoleChange = (newRole) => {
//   newsStore.setCurrentUserRole_dev(newRole);
//   // El getter 'filteredNewsItems' debería actualizarse automáticamente.
//   // Si el filtrado por rol es en backend, necesitarías llamar a newsStore.fetchNews() aquí.
// };
// Ejemplo para probar: setTimeout(() => simulateRoleChange('common_user'), 5000);
</script>

<style scoped>
.news-list-container {
  /* Estilos que ya tenías o nuevos */
}
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 30px 15px;
  margin: 20px 0;
  border-radius: 8px;
  background-color: #f8f9fa;
  color: #6c757d;
}
.error-state {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
.error-state button {
  margin-top: 10px;
  padding: 8px 15px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}
.error-state button:hover {
  background-color: #0056b3;
}
.news-list {
  /* Estilos para la lista */
}
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
.pagination-controls button {
  margin: 0 10px;
  padding: 8px 12px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
}
.pagination-controls button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.pagination-controls span {
  margin: 0 10px;
  font-size: 0.9em;
  color: #333;
}
</style>
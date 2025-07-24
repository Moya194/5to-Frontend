<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal" 
       role="dialog" aria-modal="true" :aria-labelledby="modalTitleId">
    <div class="modal-content">
      <button @click="closeModal" class="modal-close-button" aria-label="Cerrar detalle">×</button>

      <div v-if="newsStore.isLoading" class="modal-loading">Cargando detalle... ⏳</div>
      <div v-else-if="newsStore.error && !newsStore.hasCurrentNewsItem" class="modal-error">
        😟 {{ newsStore.error || 'No se pudo cargar el detalle de la noticia.' }}
      </div>
      <article v-else-if="newsStore.hasCurrentNewsItem" class="news-detail">
        <header class="news-detail__header">
          <h2 :id="modalTitleId" class="news-detail__title">
            <span v-if="newsStore.currentNewsItem.isUrgent" class="urgent-indicator" aria-label="Urgente">🔥 </span>
            {{ newsStore.currentNewsItem.title }}
          </h2>
          <p class="news-detail__meta">
            <time :datetime="newsStore.currentNewsItem.publicationDate">
              Publicado: {{ formatDate(newsStore.currentNewsItem.publicationDate) }}
            </time>
            <span v-if="newsStore.currentNewsItem.lastModifiedDate && newsStore.currentNewsItem.lastModifiedDate !== newsStore.currentNewsItem.publicationDate"
                  class="news-detail__modified-date">
              (Actualizado: {{ formatDate(newsStore.currentNewsItem.lastModifiedDate) }})
            </span>
            <span v-if="newsStore.currentNewsItem.type" class="news-detail__type">
              Tipo: {{ formatType(newsStore.currentNewsItem.type) }}
            </span>
            <span v-if="newsStore.currentNewsItem.author" class="news-detail__author">
              Por: {{ newsStore.currentNewsItem.author }}
            </span>
          </p>
        </header>

        <img v-if="newsStore.currentNewsItem.imageUrl" 
             :src="newsStore.currentNewsItem.imageUrl" 
             :alt="`Imagen para ${newsStore.currentNewsItem.title}`" 
             class="news-detail__image"/>

        <div class="news-detail__full-content" v-if="newsStore.currentNewsItem.content" 
             v-html="sanitizeHtml(newsStore.currentNewsItem.content)">
        </div>
        <p v-else class="news-detail__no-content">No hay contenido detallado disponible para mostrar.</p>

        <div v-if="newsStore.currentNewsItem.fullNewsUrl" class="news-detail__external-link-section">
          <p>Para más información, visita el enlace original:</p>
          <a :href="newsStore.currentNewsItem.fullNewsUrl" target="_blank" rel="noopener noreferrer"
             class="news-detail__external-link">
            {{ newsStore.currentNewsItem.fullNewsUrl }} 🔗
          </a>
        </div>
        
        <div v-if="newsStore.currentNewsItem.attachments && newsStore.currentNewsItem.attachments.length > 0" class="news-detail__attachments">
          <h4>Adjuntos:</h4>
          <ul>
            <li v-for="attachment in newsStore.currentNewsItem.attachments" :key="attachment.id || attachment.fileName">
              <a :href="attachment.url" target="_blank" rel="noopener noreferrer">{{ attachment.fileName }}</a>
            </li>
          </ul>
        </div>

      </article>
      <div v-else class="modal-error">No hay información para mostrar.</div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, watch, computed, onUnmounted } from 'vue';
import { useNewsStore } from '@/modules/news/store/newsStore';
// Para sanitizar HTML si el contenido viene de una fuente no confiable o WYSIWYG
// import DOMPurify from 'dompurify'; // Necesitarías instalarlo: npm install dompurify

const props = defineProps({
  newsId: {
    type: [String, Number],
    default: null
  }
});

const emit = defineEmits(['close']);
const newsStore = useNewsStore();
const isOpen = ref(false);
const modalTitleId = computed(() => `news-detail-title-${props.newsId || 'modal'}`);

// Observa cambios en newsId para abrir el modal y cargar datos
watch(() => props.newsId, (newId) => {
  if (newId) {
    isOpen.value = true;
    newsStore.fetchNewsDetail(newId); // Llama a la acción del store para cargar el detalle
    document.body.style.overflow = 'hidden'; // Evita scroll del fondo
  } else {
    isOpen.value = false;
    document.body.style.overflow = '';
  }
});

const closeModal = () => {
  isOpen.value = false;
  document.body.style.overflow = '';
  emit('close'); // Emite evento para que el padre pueda resetear el newsId
};

// Sanitizar HTML (¡IMPORTANTE si usas v-html con contenido de usuario!)
const sanitizeHtml = (htmlContent) => {
  // return DOMPurify.sanitize(htmlContent); // Descomenta si usas DOMPurify
  return htmlContent; // Sin sanitizar - ¡CUIDADO! Solo si confías 100% en la fuente del HTML
};

// Formateadores (puedes moverlos a un composable si los usas en más sitios)
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
     if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch(e) { return 'Fecha inválida'; }
};

const formatType = (type) => {
  if (!type) return '';
  const typeMap = {
    'general': 'Noticia General',
    'alerta': 'Alerta',
    'evento': 'Evento',
    'aviso_sistema': 'Aviso del Sistema'
  };
  return typeMap[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
};

// Limpiar el overflow del body cuando el componente se desmonte, por si acaso
onUnmounted(() => {
  document.body.style.overflow = '';
});

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegúrate de que esté por encima de otros contenidos */
  padding: 20px; /* Espacio para que el modal no toque los bordes en pantallas pequeñas */
}

.modal-content {
  background-color: white;
  padding: 25px 30px;
  border-radius: 10px;
  max-width: 800px; /* Ancho máximo del modal */
  width: 95%;
  max-height: 90vh; /* Altura máxima, permite scroll interno */
  overflow-y: auto;
  position: relative;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

.modal-close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2em; /* Tamaño del ícono de cierre */
  line-height: 1;
  cursor: pointer;
  color: #888;
  padding: 5px;
}
.modal-close-button:hover {
  color: #333;
}

.modal-loading, .modal-error {
  text-align: center;
  padding: 40px 20px;
  font-size: 1.1em;
  color: #555;
}
.modal-error {
  color: #c0392b;
}

.news-detail__header {
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  padding-bottom: 15px;
}

.news-detail__title {
  font-size: 1.8em; /* Título más grande en el modal */
  margin-top: 0;
  margin-bottom: 10px;
  color: #2c3e50;
}

.news-detail__meta {
  font-size: 0.9em;
  color: #7f8c8d;
  display: flex;
  flex-wrap: wrap; /* Permite que los elementos meta se ajusten */
  gap: 8px 15px; /* Espacio vertical y horizontal entre elementos meta */
}
.news-detail__meta span {
  display: inline-block;
}
.news-detail__modified-date {
  font-style: italic;
}
.news-detail__type, .news-detail__author {
  /* Estilos específicos si los necesitas */
}

.news-detail__image {
  width: 100%;
  max-height: 350px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.news-detail__full-content {
  line-height: 1.7;
  color: #333;
  margin-bottom: 25px;
}
/* Estilos para contenido HTML dentro de v-html */
.news-detail__full-content :deep(p) { /* Usa :deep para estilizar contenido de v-html */
  margin-bottom: 1em;
}
.news-detail__full-content :deep(h3) {
  font-size: 1.4em;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}
.news-detail__full-content :deep(ul),
.news-detail__full-content :deep(ol) {
  padding-left: 20px;
  margin-bottom: 1em;
}

.news-detail__no-content {
  color: #777;
  font-style: italic;
}

.news-detail__external-link-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed #ddd;
}
.news-detail__external-link-section p {
  margin-bottom: 5px;
  font-size: 0.9em;
  color: #555;
}
.news-detail__external-link {
  color: #2980b9;
  text-decoration: none;
  word-break: break-all; /* Para URLs largas */
}
.news-detail__external-link:hover {
  text-decoration: underline;
}

.news-detail__attachments {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed #ddd;
}
.news-detail__attachments h4 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1em;
  color: #444;
}
.news-detail__attachments ul {
  list-style: none;
  padding-left: 0;
}
.news-detail__attachments li a {
  color: #2980b9;
  text-decoration: none;
}
.news-detail__attachments li a:hover {
  text-decoration: underline;
}
</style>
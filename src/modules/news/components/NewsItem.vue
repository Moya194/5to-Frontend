<template>
  <article :class="['news-item', { 'news-item--urgent': item.isUrgent, 'news-item--new': isNewItem }]"
           @click="handleItemClick"
           role="listitem"
           tabindex="0"
           @keydown.enter="handleItemClick"
           @keydown.space="handleItemClick"
           :aria-labelledby="`news-title-${item.id}`"
           :aria-describedby="`news-summary-${item.id}`">

    <div class="news-item__header">
      <h3 :id="`news-title-${item.id}`" class="news-item__title">
        <span v-if="item.isUrgent" class="urgent-indicator" aria-label="Urgente">🔥 </span>
        <span v-if="isNewItem" class="new-indicator" aria-label="Nuevo">🆕 </span>
        {{ item.title }}
      </h3>
      <p class="news-item__meta">
        <time :datetime="item.publicationDate">{{ formatDate(item.publicationDate) }}</time>
        <span v-if="item.type" class="news-item__type">{{ formatType(item.type) }}</span>
      </p>
    </div>

    <div class="news-item__body">
      <img v-if="item.imageUrl" :src="item.imageUrl" :alt="`Imagen para ${item.title}`" class="news-item__image"/>
      <p :id="`news-summary-${item.id}`" class="news-item__summary">{{ item.summary }}</p>
    </div>

    <div class="news-item__actions">
      <button @click.stop="emitViewDetail" class="news-item__button-detail">
        Ver detalle
      </button>
      <a v-if="item.fullNewsUrl" :href="item.fullNewsUrl" target="_blank" rel="noopener noreferrer"
         class="news-item__external-link" @click.stop>
        Leer más (externo) 🔗
      </a>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useNewsStore } from '@/modules/news/store/newsStore';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['view-detail']);

const newsStore = useNewsStore();

// Determina si el ítem es "nuevo" (no ha sido visto por el usuario)
const isNewItem = computed(() => {
  // Asumimos que item.id existe y es el identificador único
  return !newsStore.seenNewsIds.has(props.item.id);
});

// Formatea la fecha para mostrarla de forma legible
const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  try {
    const date = new Date(dateString);
    // Verifica si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    return date.toLocaleDateString(undefined, { // 'es-EC' para formato específico si quieres
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch (e) {
    console.error("Error formateando fecha:", dateString, e);
    return 'Fecha no disponible';
  }
};

// Formatea el tipo para mostrarlo (puedes expandir esto)
const formatType = (type) => {
  if (!type) return '';
  // Podrías tener un mapeo más elaborado para los tipos si vienen en un formato crudo
  const typeMap = {
    'general': 'Noticia General',
    'alerta': 'Alerta',
    'evento': 'Evento',
    'aviso_sistema': 'Aviso del Sistema'
    // Añade más tipos según tu API
  };
  return typeMap[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
};

const emitViewDetail = () => {
  emit('view-detail', props.item.id);
};

const handleItemClick = () => {
  // Si hay un enlace externo primario, quizás no quieras emitir 'view-detail'
  // o podrías tener una lógica diferente. Por ahora, siempre emite.
  emitViewDetail();
};

</script>

<style scoped>
.news-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #fff;
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.news-item:hover,
.news-item:focus-within { /* :focus-within para accesibilidad con teclado */
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  transform: translateY(-3px);
}

.news-item__header {
  margin-bottom: 12px;
}

.news-item__title {
  font-size: 1.3em; /* Ajusta según tu diseño */
  margin-top: 0;
  margin-bottom: 6px;
  color: #2c3e50; /* Un azul oscuro o el color principal de tu tema */
}

.urgent-indicator, .new-indicator {
  font-weight: bold;
  margin-right: 4px;
}
.urgent-indicator {
  color: #e74c3c; /* Rojo para urgente */
}
.new-indicator {
  color: #3498db; /* Azul para nuevo */
}

.news-item__meta {
  font-size: 0.85em;
  color: #7f8c8d; /* Gris suave */
  display: flex;
  align-items: center;
  gap: 12px; /* Espacio entre fecha y tipo */
}

.news-item__type {
  background-color: #ecf0f1; /* Fondo claro para el tipo */
  color: #34495e; /* Texto oscuro para el tipo */
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  text-transform: capitalize;
}

.news-item__body {
  flex-grow: 1; /* Permite que el cuerpo crezca y empuje las acciones hacia abajo */
}

.news-item__image {
  width: 100%;
  max-height: 200px; /* Ajusta según necesites */
  object-fit: cover; /* Para que la imagen cubra el espacio sin distorsionarse */
  border-radius: 6px;
  margin-bottom: 12px;
}

.news-item__summary {
  font-size: 1em;
  color: #555;
  line-height: 1.6;
  margin-bottom: 16px;
  /* Para limitar el número de líneas (opcional, requiere más CSS o JS) */
  /* display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; */
}

.news-item__actions {
  display: flex;
  gap: 10px; /* Espacio entre botones/enlaces */
  align-items: center; /* Alinea verticalmente si tienen diferentes alturas */
  margin-top: auto; /* Empuja las acciones al final si el ítem es flex-column */
}

.news-item__button-detail,
.news-item__external-link {
  padding: 8px 15px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.news-item__button-detail {
  background-color: #3498db; /* Azul principal o tu color de acción */
  color: white;
  border: none;
}
.news-item__button-detail:hover {
  background-color: #2980b9; /* Un azul más oscuro */
}

.news-item__external-link {
  background-color: transparent;
  color: #27ae60; /* Verde o tu color para enlaces secundarios */
  border: 1px solid #27ae60;
}
.news-item__external-link:hover {
  background-color: #27ae60;
  color: white;
}
</style>
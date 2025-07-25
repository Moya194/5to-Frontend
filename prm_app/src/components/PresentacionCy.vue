<template>
  <q-page>
    <img
      src="~assets/Imagen1.png"
      alt="Imagen del integrante"
      class="hero-image"
    />
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-6 text-content">
          <h2 class="text-weight-medium">
            ¡Bienvenidos al Registro de Mascotas del Municipio de Cayambe!
          </h2>
          <p>
            Es un honor para nosotros presentar esta iniciativa en colaboración
            con el Instituto Tecnológico Nelson Torres, destinada a mejorar la
            calidad de vida de nuestras queridas mascotas y fortalecer el
            vínculo entre la comunidad y sus animales de compañía.
          </p>
          <p>
            En Cayambe, reconocemos la importancia de nuestras mascotas como
            miembros valiosos de nuestras familias. Este registro no solo nos
            permitirá mantener un control adecuado y responsable sobre nuestros
            animales, sino también fomentar el bienestar animal y la convivencia
            armónica en nuestra comunidad.
          </p>
          <p>
            A través de esta plataforma, cada ciudadano tendrá la oportunidad de
            registrar a sus mascotas, asegurando que reciban el cuidado
            necesario y facilitando la identificación en caso de pérdida.
            Además, promoveremos campañas de vacunación, esterilización y
            adopción, buscando siempre el bienestar integral de nuestros amigos
            de cuatro patas.
          </p>
          <p>
            Agradecemos al Instituto Tecnológico Superior Nelson Torres por su
            invaluable apoyo y compromiso en este proyecto. Juntos, trabajamos
            para construir un Cayambe más seguro y amigable para todos los seres
            vivos que lo habitan.
          </p>
          <p>
            ¡Gracias por ser parte de este esfuerzo y por cuidar a quienes nos
            brindan su amor incondicional!
          </p>
          <p>
            Atentamente,<br />
            Departamento de Ambiente del Municipio de Cayambe<br />
            YoruProgramer del Instituto Tecnológico Superior Nelson Torres
          </p>
        </div>
        <div class="col-12 col-md-6">
          <!-- Aquí puedes añadir una imagen si es necesario -->
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-4" v-for="card in cards" :key="card.title">
          <div class="card">
            <div class="row items-center q-mb-md">
              <div class="col-4">
                <img :src="card.image" :alt="card.title" class="card-image" />
              </div>
              <div class="col-8">
                <div v-for="info in card.info" :key="info" class="text-h6">
                  {{ info }}
                </div>
                <div>{{ card.role }}</div>
                <div>{{ card.department }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const cards = [
  {
    title: 'Equipo 1',
    image: '~assets/ds.png',
    info: [
      'Andres Ramon Moya Tocagon',
      'Jean Jairo De La Cruz Carrillo',
      'Lisbeth Ariana Esmeraldas Castillo',
      'Eymi Joselin Flores Farinango',
      'Fredy Javier Inga Remache',
    ],
    role: 'Yoru Programer',
    department: 'Desarrollo de Software',
  },
  {
    title: 'Equipo 2',
    image: '~assets/5856.png',
    info: [
      'BRAYAN GUSTAVO AYALA IGUAGO',
      'ARACELY LISBETH CHAMORRO CHAMORRO',
      'LUIS OSWALDO FLORES CAZA',
      'KEVIN ANDERSON QUISHPE PEREZ',
    ],
    role: '',
    department: 'Administracion de Empresas',
  },
  {
    title: 'Equipo 3',
    image: '~assets/5856.png',
    info: [
      'grupo de diseño',
      'grupo de diseño',
      'grupo de diseño',
      'grupo de diseño',
    ],
    role: '',
    department: 'Diseño Grafico y Multimedia',
  },
];
</script>

<style scoped>
.hero-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 20px;
}

.container {
  padding: 40px;
  margin: 40px auto;
  max-width: 1200px;
}

.text-content {
  padding: 20px;
}

.text-content h2 {
  margin-top: 0;
  color: #2c3e50;
}

.text-content p {
  line-height: 1.6;
  color: #34495e;
}

.card {
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.card:hover {
  transform: scale(1.05);
}

.card-image {
  height: 120px;
  width: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>

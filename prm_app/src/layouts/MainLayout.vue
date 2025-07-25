<template>
  <q-layout view="hHh Lpr lFf" >
    <q-header elevated class="bg-primary text-white" >
      <q-toolbar >
        <q-btn
          flat
          dense
          round
          icon="las la-bars"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
         Animales de compañia
        </q-toolbar-title>
        <q-btn
        outline rounded
      label="Iniciar Sesión"
      color="red-1"
      icon="las la-user-alt"
      @click="handleLogin"
    />
          <q-btn flat round dense icon="more_vert" @onClick="handleSocialMedia">
    <q-menu
      anchor="bottom left"
      self="top left"
      :offset="[10, 10]"
    >
      <q-list>
        <q-item clickable v-close-popup @click="openFacebook('https://www.facebook.com/GADIPCayambe')">
          <q-item-section avatar>
            <q-icon name="lab la-facebook-f" />
          </q-item-section>
          <q-item-section>Facebook</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="openYoutube('https://www.youtube.com/channel/UCI929DvdBepU89DG8JcEnKg')">
          <q-item-section avatar>
            <q-icon name="lab la-youtube" />
          </q-item-section>
          <q-item-section>YouTube</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="openInstagram('https://www.instagram.com/GADIPCayambe?fbclid=IwAR0eNhHcV6Z8MY81N6F_ARD3Om2Oqu800FicbRa6OHErL3Ms_P41APOiFgw')">
          <q-item-section avatar>
            <q-icon name="lab la-instagram" />
          </q-item-section>
          <q-item-section>Instagram</q-item-section>
        </q-item>     
      </q-list>
    </q-menu>
  </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered    
    >
    <img src="~assets/mas.png" alt="Imagen de inicio" class="header-image" style="height: 150px; width: 150px; margin-left: 70px">
      <q-list>
        <q-item-label
          header
        >
      <div class="text-color-grey-10">MENU</div>
        </q-item-label>
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import EssentialLink from '../components/EssentialLink.vue'; // Asegúrate de que esté en el mismo directorio
const $router = useRouter();

interface EssentialLinkProps {
  title: string;
  caption?: string;
  icon?: string;
  link?: string;
}

const linksList: EssentialLinkProps[] = [
 
{
    title: ' Home',
    caption: '',
    icon: 'las la-home',
    link: 'home'
  },
 
 
  {
    title: 'Formulario',
    caption: '',
    icon: 'las la-strikethrough',
    link: 'compo'
  },
  {
    title: 'Carnet de la Costancia',
    caption: '',
    icon: 'las la-paw',
    link: 'tabla'
  },
  {
    title: 'Constancia registros' , 
    caption: '',
    icon: 'las la-folder',
    link: 'constacia'
  },
  {
    title: 'Carnet de los animales de compañia' , 
    caption: '',
    icon: 'las la-id-card',
    link: 'carnet'
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value =!leftDrawerOpen.value;
}

const handleSocialMedia = (link: string) => {
  // Mostrar menú (no hace falta implementar nada aquí)
  window.open(link, '_blank');
  
}
function openFacebook(url: string) {
   window.open(url, '_blank')
 }
 function openYoutube(url: string) {
  window.open(url, '_blank');
}
 function openInstagram(url: string) {
   window.open(url,'_blank' )
 }
 async function handleLogin() {
  await $router.push({ name: 'login' });
}

</script>
<style scoped>
.bg-primary {
  background-color: #9ca8bb; /* Change this to your desired color */
}

.text-white {
  color: white;
}
</style>
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, // Esto asegura que ciertas dependencias sean transpiladas

  // Configuración para producción y desarrollo
  publicPath: process.env.NODE_ENV === 'production' ? '/your-production-path/' : '/',

  // Configuración del servidor de desarrollo
  devServer: {
    allowedHosts: ['misistema.local'], // Permite el host 'misistema.local'
    host: '0.0.0.0', // Escuchar en todas las interfaces de red para accesibilidad desde otros dispositivos
    port: 34567, // Usar un puerto diferente al del backend para evitar conflictos
    proxy: {
      '/api': {
        target: 'http://localhost:34567', // Este es el puerto de tu backend, asegúrate de que esté correcto
        changeOrigin: true,
        secure: false, // Para evitar problemas con HTTPS (si es que no usas HTTPS)
      },
    },
  },
})

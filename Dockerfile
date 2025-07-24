# Paso 1: Usar una imagen base oficial de Node.js. 'alpine' es una versión ligera.
FROM node:18-alpine

# Paso 2: Crear y definir el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Paso 3: Copiar los archivos de dependencias. Esto aprovecha el caché de Docker.
COPY package*.json ./

# Paso 4: Instalar solo las dependencias de producción
RUN npm install --production

# Paso 5: Copiar el resto del código fuente de la aplicación
COPY . .

# Paso 6: Exponer el puerto en el que corre la aplicación
EXPOSE 34568

# Paso 7: El comando para iniciar la aplicación cuando se inicie el contenedor
CMD [ "node", "app.js" ]
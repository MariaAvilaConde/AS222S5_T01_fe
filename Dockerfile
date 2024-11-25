# Imagen base de Node.js
FROM node:18-alpine as build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Construye la aplicación Angular en modo producción
RUN npm run build --configuration=production

# Usa una imagen de servidor (por ejemplo, Nginx) para servir la app
FROM nginx:alpine

# Copia los archivos compilados al contenedor de Nginx
COPY --from=build /app/dist/OpenAi /usr/share/nginx/html

# Expone el puerto
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]

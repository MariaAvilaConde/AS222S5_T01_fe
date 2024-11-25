# Usar una imagen base con Node.js 18+
FROM node:18

# Crear y configurar el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero (mejor caché)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación en modo producción
RUN npm run build --configuration=production

# Exponer el puerto
EXPOSE 4200

# Comando por defecto para iniciar la aplicación (opcional)
CMD ["npm", "start"]

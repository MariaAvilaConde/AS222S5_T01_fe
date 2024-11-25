# Usar una imagen base con Node.js 18+
FROM node:18

# Crear y configurar el directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto al contenedor
COPY package*.json ./
COPY . .

# Instalar dependencias
RUN npm install

# Construir la aplicación en modo producción
RUN npm run build --configuration=production

# Exponer el puerto
EXPOSE 4200

# Comando por defecto para iniciar la aplicación (opcional)
CMD ["npm", "start"]

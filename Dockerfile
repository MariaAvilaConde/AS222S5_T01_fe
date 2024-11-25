FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g @angular/cli@latest
RUN npm run build --configuration=production

FROM nginx:alpine

COPY --from=build /app/dist/TheGame /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

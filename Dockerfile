FROM node:20.17.0

RUN mkdir -p /app

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

RUN npm run 

EXPOSE 4200

ENTRYPOINT ["npm", "start"]

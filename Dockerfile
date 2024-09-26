FROM node:16-alpine

WORKDIR /adameds-rekam-medis
COPY package.json .
RUN npm install
COPY . .
CMD npm start

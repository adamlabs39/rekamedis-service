FROM node:16-alpine

WORKDIR /adameds-igd
COPY package.json .
RUN npm install
COPY . .
CMD npm start

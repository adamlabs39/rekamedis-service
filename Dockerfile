FROM node:16-alpine

WORKDIR /adameds-rekam-medis
ENV APPLICATION_HOST=0.0.0.0
ENV APPLICATION_PORT=8087
COPY package.json .
RUN npm install
COPY . .
EXPOSE $APPLICATION_PORT/tcp
CMD ["npm", "run", "start"]

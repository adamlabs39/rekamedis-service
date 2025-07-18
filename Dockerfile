FROM node:16-alpine

WORKDIR /adameds-rekam-medis
ENV APPLICATION_HOST=0.0.0.0
ENV APPLICATION_PORT=8087
COPY . .
RUN npm install
RUN npm install -g @infisical/cli
EXPOSE $APPLICATION_PORT/tcp
CMD ["sh", "-c", "infisical run --env=development -- npm run start"]

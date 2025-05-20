FROM node:current-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG BACKEND_PORT=3001
ENV BACKEND_PORT=${BACKEND_PORT}
EXPOSE ${BACKEND_PORT}

CMD ["npm", "start"]
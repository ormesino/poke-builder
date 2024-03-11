FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run prisma:generate

EXPOSE 3000

RUN npx prisma migrate dev --name init

CMD [ "node", "dist/main.js" ]
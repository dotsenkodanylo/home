FROM node:18-alpine3.16

WORKDIR /home

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD npm run start
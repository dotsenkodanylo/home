FROM node:18-alpine3.16

WORKDIR /home

COPY . .

EXPOSE 3000

CMD npm run start
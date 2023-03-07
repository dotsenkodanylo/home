FROM node:18-alpine3.16

WORKDIR /workdir

ADD . /workdir

RUN npm install

RUN npm run build

EXPOSE 3000

CMD npm run start
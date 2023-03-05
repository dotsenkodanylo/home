FROM node:16

WORKDIR /workdir

RUN apk update && apk add git

RUN git clone https://github.com/dotsenkodanylo/home

WORKDIR /workdir/home

RUN npm ci

RUN npm run build

EXPOSE 3000

CMD npm run start
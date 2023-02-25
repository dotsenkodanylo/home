FROM node:18-alpine3.16

WORKDIR /workdir

RUN git clone https://github.com/dotsenkodanylo/home

RUN npm install

RUN npm run build

EXPOSE 3000

CMD npm run start
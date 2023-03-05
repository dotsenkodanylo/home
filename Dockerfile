FROM node:18-alpine3.16

WORKDIR /workdir

ADD . /workdir

RUN npm config set "@fortawesome:registry" https://npm.fontawesome.com/

RUN npm config set "//npm.fontawesome.com/:_authToken" "063F231E-EA81-4649-A982-B992DB5510AF"

RUN npm install

RUN npm run build

EXPOSE 3000

CMD npm run start
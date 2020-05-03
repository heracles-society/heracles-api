FROM node:12-alpine as builder
LABEL AUTHOR "Avik Sarkar <sayavik@gmail.com>"

RUN mkdir /app
RUN chown -R node:node /app
WORKDIR /app

ADD package.json .
ADD yarn.lock .
RUN yarn install

ADD . .
RUN yarn build

EXPOSE 80
USER node
CMD [ "node", "./dist/main" ]

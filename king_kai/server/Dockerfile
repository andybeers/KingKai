FROM node:4.8.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY . /usr/src/app
RUN npm install && npm cache clean

CMD [ "npm", "start" ]

FROM node:4.8.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY dev-package.json /usr/src/app/
RUN mv dev-package.json package.json
RUN npm install && npm cache clean
COPY . /usr/src/app
RUN mv dev-package.json package.json

CMD [ "npm", "start" ]

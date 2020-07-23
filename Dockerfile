FROM node:12.18.2

USER node

WORKDIR /home/node

COPY package*.json ./

RUN npm i -g @adonisjs/cli && npm install

COPY . .

EXPOSE 3333

CMD ["node", "./build/server.js"]
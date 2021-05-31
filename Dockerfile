FROM node:16

WORKDIR /root/bot

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

CMD [ "node", "index.js"]
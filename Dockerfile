FROM node:16

WORKDIR /root/bot

COPY . .

RUN npm install

RUN npx prisma generate

CMD node index.js

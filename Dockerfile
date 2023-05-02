FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

VOLUME ["/app"]

COPY . .

EXPOSE 80

CMD ["npm", "start"]

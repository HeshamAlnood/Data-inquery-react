FROM node:14

WORKDIR /data-inquery-rct

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm run dev" ]  


 
FROM node:16

WORKDIR /app

COPY package*.json .

 

RUN npm install --legacy-peer-deps


ADD styles  .

ADD Components  .

ADD Methods  .

ADD pages  .

ADD dist  .

ADD my-uploads .



EXPOSE 3000

CMD ["npm","run","dev"]


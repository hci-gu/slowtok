FROM node:18

COPY . /app

WORKDIR /app

RUN yarn install --production

EXPOSE 4000

CMD yarn start
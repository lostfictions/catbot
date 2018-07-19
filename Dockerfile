FROM node:10.6

MAINTAINER s

WORKDIR /code

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . ./
RUN yarn build

ENV NODE_ENV=production
ENV DEBUG=*
ENTRYPOINT yarn start

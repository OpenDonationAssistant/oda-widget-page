FROM node:latest AS build
WORKDIR /build

COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY .env .env
COPY .env.production .env.production
COPY .npmrc .npmrc
COPY public/ public
COPY src/ src

RUN npm install --legacy-peer-deps
RUN npm run build

FROM httpd:2.4-alpine
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
WORKDIR /usr/local/apache2/htdocs/
COPY --from=build /build/build/ .

FROM node:20 AS build
WORKDIR /build
ARG gpr_token

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY .env .env
COPY .env.production .env.production
COPY .npmrc .npmrc
COPY public/ public
COPY src/ src

RUN echo "//npm.pkg.github.com/:_authToken=${gpr_token}" > ~/.npmrc
RUN npm ci
RUN npm run build

FROM httpd:2.4-alpine
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
WORKDIR /usr/local/apache2/htdocs/
COPY --from=build /build/build/ .

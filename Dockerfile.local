##
# Production Dockerfile
##

###
# Base image declaration
###
FROM node:18.10-alpine AS base

ENV APPDIR /app

WORKDIR ${APPDIR}/shared

COPY shared/package*.json ./
RUN npm ci

COPY shared ./
RUN npm run build

###
# Client build stage
###
FROM base AS client-build

WORKDIR ${APPDIR}/client

COPY client/package*.json ./
RUN npm ci

COPY client ./
RUN npm run build

###
# Server build stage
###
FROM base AS server-build

WORKDIR ${APPDIR}/server

COPY server/package*.json ./
RUN npm ci

COPY server ./
RUN npm run build
RUN rm -r src

###
# Main image build
###
FROM base AS main

WORKDIR ${APPDIR}/server

COPY --from=server-build ${APPDIR}/server ./
COPY --from=client-build ${APPDIR}/client/dist ./static

ENV TZ=Europe/Helsinki

CMD npm run db-migrate:prod && npm start

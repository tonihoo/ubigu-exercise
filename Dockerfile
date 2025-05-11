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
FROM node:18.10-alpine AS main

ENV APPDIR /app
ENV NODE_ENV=production
ENV SERVER_PORT=8080
ENV TZ=Europe/Helsinki

WORKDIR ${APPDIR}/server

# Copy package.json and install only production dependencies
COPY --from=server-build ${APPDIR}/server/package*.json ./
RUN npm ci --only=production

# Copy built applications
COPY --from=server-build ${APPDIR}/server ./
COPY --from=client-build ${APPDIR}/client/dist ./static

# Expose the port that Azure App Service expects
EXPOSE 8080

# Add health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/v1/health || exit 1

# Add script to create DB if it doesn't exist
RUN echo '#!/bin/sh \n\
if [ "$PG_DATABASE" != "postgres" ]; then \n\
  echo "Checking if database $PG_DATABASE exists..." \n\
  PGPASSWORD=$PG_PASS psql -h $PG_HOST -U $PG_USER -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '"'"'$PG_DATABASE'"'"'" | grep -q 1 || \
  PGPASSWORD=$PG_PASS psql -h $PG_HOST -U $PG_USER -d postgres -c "CREATE DATABASE $PG_DATABASE" \n\
  echo "Database $PG_DATABASE created or already exists" \n\
fi \n\
npm run db-migrate:prod && npm start' > /app/server/start.sh && chmod +x /app/server/start.sh

CMD ["/app/server/start.sh"]

FROM node:12-alpine

RUN apk --no-cache upgrade \
 && apk --no-cache add \
    chromium \
    python3 \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
 && rm -rf /var/cache/apk/*

WORKDIR /opt/testcafe/docker/

COPY docker/package.json package.json
COPY testcafe/framework/reporter/testcafe-reporter-allure testcafe/framework/reporter/testcafe-reporter-allure
COPY allure.config.js allure.config.js
RUN npm install && npm cache clean --force

RUN adduser --disabled-password testcafe
USER testcafe

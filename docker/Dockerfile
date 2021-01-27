FROM circleci/node:12-browsers

USER root
RUN npm install -g ts-node
RUN mkdir /runner && chown circleci:circleci /runner

WORKDIR /runner

COPY --chown=circleci:circleci docker/package.json package.json
COPY --chown=circleci:circleci testcafe/framework/reporter/testcafe-reporter-allure testcafe/framework/reporter/testcafe-reporter-allure
COPY --chown=circleci:circleci allure.config.js allure.config.js

USER circleci

RUN npm install && npm cache clean --force

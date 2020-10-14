FROM rhendricksen/testcafe-chrome-nodejs

USER root
RUN mkdir /app && chown chrome:chrome /app
# Create seperate volume for node_modules folder
#VOLUME /app/node_modules

WORKDIR /app

COPY --chown=chrome:chrome docker/package.json package.json
COPY --chown=chrome:chrome testcafe/framework/reporter/testcafe-reporter-allure testcafe/framework/reporter/testcafe-reporter-allure
COPY --chown=chrome:chrome allure.config.js allure.config.js

USER chrome

RUN npm install && npm cache clean --force

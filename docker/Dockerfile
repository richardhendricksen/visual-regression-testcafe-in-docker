FROM alpine:edge

ENV ALPINE_REPOS="\
 --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing/\
 --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/\
 --repository http://dl-cdn.alpinelinux.org/alpine/edge/main/\
 --repository http://dl-cdn.alpinelinux.org/alpine/v3.11/community/\
 --repository http://dl-cdn.alpinelinux.org/alpine/v3.11/main/\
"

RUN apk --no-cache $ALPINE_REPOS upgrade && \
 apk --no-cache $ALPINE_REPOS add \
 libevent nodejs yarn npm chromium firefox-esr xwininfo xvfb dbus eudev ttf-freefont fluxbox procps build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev

WORKDIR /opt/testcafe/docker/

COPY docker/package.json package.json
COPY docker/yarn.lock yarn.lock
COPY doc-allure-config.js doc-allure-config.js
COPY testcafe/framework/reporter/testcafe-reporter-allure testcafe/framework/reporter/testcafe-reporter-allure
RUN yarn install --lockfile && yarn cache clean --force

COPY docker/testcafe-docker.sh testcafe-docker.sh
RUN chmod +x /opt/testcafe/docker/testcafe-docker.sh

RUN adduser -D testcafe
USER testcafe

EXPOSE 1337 1338
ENTRYPOINT ["/opt/testcafe/docker/testcafe-docker.sh"]

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
 libevent nodejs npm chromium firefox-esr xwininfo xvfb dbus eudev ttf-freefont fluxbox procps build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev

COPY testcafe-docker.sh /opt/testcafe/docker/testcafe-docker.sh
COPY package.json /opt/testcafe/docker/code/package.json

WORKDIR /opt/testcafe/docker/code/

RUN npm install && \
 npm cache clean --force && \
 chmod +x /opt/testcafe/docker/testcafe-docker.sh

RUN adduser -D testcafe

USER testcafe

EXPOSE 1337 1338
ENTRYPOINT ["/opt/testcafe/docker/testcafe-docker.sh"]

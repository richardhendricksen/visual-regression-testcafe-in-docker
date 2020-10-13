FROM node:12

RUN echo "deb http://http.debian.net/debian/ stretch main contrib non-free" > /etc/apt/sources.list \
 && echo "deb http://http.debian.net/debian/ stretch-updates main contrib non-free" >> /etc/apt/sources.list \
 && echo "deb http://security.debian.org/ stretch/updates main contrib non-free" >> /etc/apt/sources.list \
 && echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections \
 && apt-get -qq update && apt-get -y -qq --no-install-recommends install \
    ca-certificates \
    ttf-mscorefonts-installer \
    fonts-roboto \
    fonts-noto-cjk \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-kacst \
    fonts-freefont-ttf \
    fonts-thai-tlwg \
    fonts-indic \
    fonts-liberation \
    fontconfig \
    unzip \
    locales \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    libgbm-dev \
    libappindicator1 \
    libnss3 \
    xdg-utils \
    wget \
    curl \
 && rm -rf /var/lib/apt/lists/*

# Install chrome
RUN cd /tmp \
 && wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
 && dpkg -i google-chrome-stable_current_amd64.deb;

WORKDIR /opt/testcafe/docker/

COPY docker/package.json package.json
COPY testcafe/framework/reporter/testcafe-reporter-allure testcafe/framework/reporter/testcafe-reporter-allure
COPY allure.config.js allure.config.js
RUN npm install && npm cache clean --force

RUN useradd testcafe
USER testcafe

CMD ["/bin/bash"]

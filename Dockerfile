# See README.md for build/run examples
From node:9.3.0

MAINTAINER rene@arcdynamic.com

#Update/install required packages

RUN mkdir -p /opt/app

COPY package.json /opt/app/.
COPY package-lock.json /opt/app/.
RUN cd /opt/app;npm install

#Build JS
COPY . /opt/app/.
RUN cd /opt/app;NODE_ENV=production npx webpack -p

WORKDIR /opt/app

#Tar up files required to run server
RUN  cd /opt/app;tar -czf client-vg-website.tar.gz ./node_modules ./public ./config.production.json ./config.f3labs.json ./server.js ./version.json ./src/site-index.js

EXPOSE 8080

### Final setup
CMD ["npm", "start"]

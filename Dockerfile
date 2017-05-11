FROM node:7.9.0-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV GM_API_BASE_URL "http://api.gomake.io"

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
RUN npm install -g gulp

# Bundle app source
COPY gulpfile.babel.js /usr/src/app
COPY src /usr/src/app/src

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
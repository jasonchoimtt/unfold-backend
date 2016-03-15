FROM node:4.4-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python make g++ && \
    rm -rf /var/lib/apt/lists/*

ENV APP_ROOT /usr/lib/app


RUN mkdir -p $APP_ROOT
WORKDIR $APP_ROOT

COPY package.json $APP_ROOT/
# Split it to avoid OOM =(
RUN npm install bcrypt || (cat npm-debug.log && false)
RUN npm install || (cat npm-debug.log && false)

COPY . $APP_ROOT/

RUN npm run lint
RUN npm run build

RUN rm -rf src

RUN npm prune --production && \
    npm cache clean && \
    rm -rf /tmp/npm* && \
    apt-get purge -y --auto-remove python make g++

ENV NODE_ENV production
EXPOSE 3000
CMD [ "node", "lib/index.js" ]

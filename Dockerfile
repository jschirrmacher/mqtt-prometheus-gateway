FROM node:18-alpine as build
WORKDIR /app
ADD . /app

RUN npm ci && \
    npm run build && \
    rm -rf /app/node_modules && \
    npm ci --omit=dev && \
    mkdir /build && \
    mv /app/node_modules /app/dist/* /build && \
    mv /app/package.json /build

FROM node:18-alpine
WORKDIR /app
USER node
COPY --from=build /build /app

ENV NODE_ENV=production

CMD ["node", "."]

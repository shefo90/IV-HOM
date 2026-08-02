# The public site: build the SPA, then serve it with nginx.
#
# Replaces the previous single-stage `serve dist -s` image. nginx also
# reverse-proxies /api to the api service and serves /media and /content.json
# straight off the content volume, so the public read path never touches
# Python and keeps working with the API container stopped.

FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/iv_proxy.conf /etc/nginx/iv_proxy.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

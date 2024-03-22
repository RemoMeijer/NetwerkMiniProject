FROM node:latest as build

WORKDIR /dist/src/app

RUN npm cache clean --force
COPY . .
RUN npm ci
RUN npm run build --prod

FROM nginx:latest as ngi

COPY --from=build /dist/src/app/dist/front-end-client/browser /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80

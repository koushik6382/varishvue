# build stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./vue-nginx.conf /etc/nginx/nginx.conf
EXPOSE 4009
CMD ["nginx", "-g", "daemon off;"]
# build stage
FROM node:16 as build-stage

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# production stage
FROM nginx:1.24.0 as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
FROM node:16 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN HOST=http://k6e106.p.ssafy.io PORT=1234 npx y-websocket

FROM nginx:stable-alpine
EXPOSE 80
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/build  /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

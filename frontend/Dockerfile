FROM node:lts-slim as frontend_builder
WORKDIR /app
COPY package* ./
RUN npm ci
COPY vite.config.js index.html ./
COPY src ./src
COPY public ./public
RUN npm run build


FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend_builder /app/dist /app

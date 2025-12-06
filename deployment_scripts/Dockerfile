# Simple static site image for the SPA build output
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Default build-time envs (override via build args)
ARG VITE_API_BASE="https://barber-flow-production-c531.up.railway.app"
ARG VITE_ENV="production"
ENV VITE_API_BASE=${VITE_API_BASE} \
    VITE_ENV=${VITE_ENV}

RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

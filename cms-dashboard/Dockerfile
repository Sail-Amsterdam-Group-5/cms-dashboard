# Step 1: Build the application
FROM node:23 AS builder
WORKDIR /cms-dashboard
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Step 2: Set up the production environment
FROM nginx
COPY --from=builder /cms-dashboard/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
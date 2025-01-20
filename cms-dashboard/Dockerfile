# Dockerfile
FROM nginx:latest

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /cms-dashboard

COPY ./dist .

EXPOSE 8080:8080

CMD ["nginx", "-g", "daemon off;"]
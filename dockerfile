FROM nginx:1.23-alpine
COPY dist/portal /usr/share/nginx/html
COPY pages/  /usr/share/nginx/html/pages/
COPY nginx.conf /etc/nginx/conf.d/default.conf




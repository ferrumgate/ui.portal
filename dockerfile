FROM nginx:1.23-alpine

COPY dist/portal /usr/share/nginx/html
COPY pages/  /usr/share/nginx/html/pages/
COPY nginx.conf /etc/nginx/conf.d/default.conf
#RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /etc/nginx/conf.d /var/log/nginx
#RUN touch /var/run/nginx.pid && \
#    chown -R nginx:nginx /var/run/nginx.pid
#USER nginx
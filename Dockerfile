#Launch poc - after building the project
FROM nginx:alpine

LABEL maintainer="Baptiste Hubert <baptiste.hubert@inria.fr>"
LABEL org.opencontainers.image.vendor COAST

COPY conf/nginx/nginx.conf /etc/nginx/nginx.conf
COPY conf/nginx/nginx.ssl.conf /etc/nginx/nginx.ssl.conf
COPY conf/nginx/nginx.mimetypes.conf /etc/nginx/nginx.mimetypes.conf
COPY dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
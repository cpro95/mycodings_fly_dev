FROM caddy:alpine

# Caddyfile만 복사
COPY Caddyfile /etc/caddy/Caddyfile

# /srv 디렉토리 생성 (Volume 마운트 포인트)
RUN mkdir -p /srv

# 포트 노출
EXPOSE 8080

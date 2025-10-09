# Caddy를 실행할 최종 이미지만 필요합니다.
FROM caddy:alpine

# Caddyfile을 복사합니다.
COPY Caddyfile /etc/caddy/Caddyfile

# 포트를 노출합니다.
EXPOSE 8080

# 로컬에서 미리 빌드된 public 폴더의 내용물을
# Caddy가 서비스할 /srv 디렉터리로 복사합니다.
COPY public /srv

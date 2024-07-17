FROM caddy:2.8-builder AS builder

RUN xcaddy build \
  --with github.com/caddy-dns/namecheap 

FROM caddy:2.8

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
COPY ./.env ./
COPY ./Caddyfile ./
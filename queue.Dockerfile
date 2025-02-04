FROM node:lts-alpine as queue
WORKDIR /queue
COPY ./package*.json ./
COPY ./tsconfig.json ./
COPY ./svelte.config.js ./
COPY ./vite.config.ts ./
COPY ./.env.production ./.env
COPY ./graphile.config.js ./
COPY ./ca-certificate.crt ./
COPY ./graphileworker.crontab ./
COPY ./src/tasks ./src/tasks
COPY ./project.inlang ./project.inlang
RUN npm ci --omit dev
ENV NODE_OPTIONS=--max_old_space_size=1800
CMD ["npx", "--yes", "graphile-worker"]
#CMD ["sh", "-c", "set -o allexport; while IFS= read -r line; do case $line in ''|\#*) ;; *) export $line;; esac; done < .env; set +o allexport; npx --yes graphile-worker -c $DATABASE_URL"]


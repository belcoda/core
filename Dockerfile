FROM node:lts-alpine as build
WORKDIR /app
COPY ./package*.json ./
COPY ./tsconfig.json ./
COPY ./svelte.config.js ./
COPY ./vite.config.ts ./
COPY ./.env.production ./.env
RUN npm install --force
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=1800
RUN npm run build

FROM node:lts-alpine AS production
COPY --from=build /app/build .
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .
COPY --from=build /app/.env.production .env
RUN npm ci --omit dev --force
RUN npm i dotenv --force
EXPOSE 3000
CMD ["npm", "run", "start:production"]
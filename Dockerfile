FROM node:lts-alpine as build
WORKDIR /app
COPY ./package*.json ./
COPY ./tsconfig.json ./
COPY ./svelte.config.js ./
COPY ./vite.config.ts ./
COPY ./.env.production ./.env
COPY ./project.inlang ./project.inlang
RUN npm install
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=1800
RUN npm run build

FROM node:lts-alpine AS production
COPY --from=build /app/build .
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .
COPY --from=build /app/.env.production .env
RUN npm ci --omit dev
RUN npm i dotenv
EXPOSE 3000
CMD ["npm", "run", "start:production"]
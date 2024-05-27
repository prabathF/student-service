# Build Stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Nest.js App Running Stage
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

RUN npm ci --omit=dev

RUN chown -R node:node /app

USER node

EXPOSE 3002

CMD ["npm", "run", "start:prod"]

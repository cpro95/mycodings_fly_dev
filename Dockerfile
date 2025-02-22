# base node image
FROM node:20-alpine AS base

# Install openssl for Prisma
# RUN apt-get update && apt-get install -y openssl
RUN apk update && apk add --no-cache openssl

# Install all node_modules, including dev dependencies
FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Setup production node_modules
FROM base AS production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Build the app
FROM base AS build

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
ARG GITHUB_REPOSITORY
ENV GITHUB_REPOSITORY=$GITHUB_REPOSITORY
ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

COPY prisma .
RUN npx prisma generate

COPY . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

ARG GITHUB_REPOSITORY
ENV GITHUB_REPOSITORY=$GITHUB_REPOSITORY
ENV NODE_ENV=production

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY . .

CMD ["npm", "run", "start"]

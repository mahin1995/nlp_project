# Stage 1: Build the TypeScript code
FROM node:23 AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Run compiled code
FROM node:23
WORKDIR /app

# Copy only what's needed to run the app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/model ./model
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/.env ./
COPY --from=builder /app/src/utils/newsIntents.json  ./dist/utils/newsIntents.json

# Expose your backend port
EXPOSE 5000

# Start the app
CMD ["node", "dist/index.js"]

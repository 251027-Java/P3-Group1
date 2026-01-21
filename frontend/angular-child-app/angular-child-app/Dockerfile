# ---------- Stage 1: Dependencies ----------
FROM node:18-alpine AS deps

WORKDIR /app

# Copy only dependency files for caching
COPY package*.json ./

# Install dependencies
RUN npm ci


# ---------- Stage 2: Development ----------
FROM node:18-alpine

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code (will be overridden by volume in dev)
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# Start Angular dev server
CMD ["npm", "start"]

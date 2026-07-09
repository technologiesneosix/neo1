# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY packages/shared/package.json packages/shared/

# Install dependencies
RUN npm ci --only=production && \
    cd packages/shared && \
    npm ci --only=production && \
    cd ../..

# Copy source code
COPY . .

# Build shared package
RUN npm run build --workspace=packages/shared

# Build backend
RUN npm run build --workspace=backend

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY packages/shared/package.json packages/shared/

# Install production dependencies
RUN npm ci --only=production && \
    cd packages/shared && \
    npm ci --only=production && \
    cd ../..

# Copy built shared package
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

# Copy built backend
COPY --from=builder /app/backend/dist ./backend/dist

# Create logs directory
RUN mkdir -p logs

EXPOSE 5000

CMD ["npm", "run", "backend:start"]

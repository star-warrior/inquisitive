FROM node:22-alpine

WORKDIR /app

# Copy root config and package files for workspaces support
COPY package.json tsconfig.base.json ./
COPY backend/package.json ./backend/

# Install backend dependencies
RUN npm install --workspace=backend --legacy-peer-deps

# Copy source code and config
COPY tsconfig.base.json ./
COPY backend ./backend

WORKDIR /app/backend

# Expose Express server port
EXPOSE 3000

# Run in hot-reload watch development mode
CMD ["npm", "run", "dev"]

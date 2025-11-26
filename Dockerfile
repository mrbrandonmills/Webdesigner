# Railway Dockerfile for Campaign Automation
# This bypasses nixpacks entirely and runs only the automation scripts

FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production=false

# Copy automation scripts and content
COPY scripts/ ./scripts/
COPY tsconfig.json ./tsconfig.json

# Create logs directory
RUN mkdir -p logs

# Install tsx globally for TypeScript execution
RUN npm install -g tsx

# Start the watchdog (which starts the daemon)
CMD ["tsx", "scripts/automation/watchdog.ts"]

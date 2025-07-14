# Use official Node.js image
FROM node:20.9.0-alpine

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm ci

# Build the agent
RUN npm run build

# Expose port (Mastra serves on 8080 by default)
EXPOSE 8080

# Start the agent
CMD ["npm", "start"]

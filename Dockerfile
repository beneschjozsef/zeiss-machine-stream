# Stage 1: Build the Next.js application
FROM node:20 AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Serve the static files using `serve`
FROM node:20 AS runner

WORKDIR /app

# Install `serve` globally
RUN npm install -g serve@latest

# Copy the exported files from the builder stage
COPY --from=builder /app/out /app/out

# Set the command to serve the static files
CMD ["serve", "-s", "out"]

EXPOSE 3000

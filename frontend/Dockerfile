# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app

# Copy the entire contents of the frontend folder into the container's /app directory
# This ensures package.json, tsconfig.json, vite.config.ts, and the src folder are all present.
COPY frontend/ .

# Install dependencies (they are now in the correct spot)
RUN npm install

# Build the application for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx page
RUN rm -rf ./*

# Copy the build output from the build stage
COPY --from=build /app/dist .

# Copy the custom Nginx configuration
# This path is correct because the COPY . above included nginx.conf in the frontend dir
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]

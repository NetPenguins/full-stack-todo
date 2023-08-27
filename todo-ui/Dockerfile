# Use the official Node.js 14 image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY todo-ui/package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY todo-ui/ ./

# Build the app
RUN npm run build

# Use a lighter image for the production build
FROM nginx:alpine

# Copy the built app to the Nginx directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]


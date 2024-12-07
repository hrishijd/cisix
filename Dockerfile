# Use the official Node.js 22 image as a base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the application port (default 3000 for Node.js apps)
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]

# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port your application runs on
EXPOSE 5000

# Define the command to run your application
CMD ["node", "index.js"]


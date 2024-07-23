# Use the official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Install jest-environment-jsdom separately
RUN npm install jest-environment-jsdom --save-dev

# Expose the port that the app runs on
EXPOSE 8080

#Choose one of the below alternatives to run in development or test mode.

# Command to run the tests with explicit Jest config
#CMD ["npm", "test"]

# Command to run the application in development mode
CMD ["npm", "run", "dev"]
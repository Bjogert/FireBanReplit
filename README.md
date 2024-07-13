Getting Started: 

Dependencies:

#Install Docker on your potato.
https://www.docker.com/products/docker-desktop/

#Install npm, Vite, and Node.js for your operating system according to the instructions at:

https://nodejs.org/en/download/package-manager

# Navigate to the project directory
cd path/to/your/FireBanReplit

# Ensure you are on the main branch
git checkout main
(first time? git clone https://github.com/Bjogert/FireBanReplit.git
cd FireBanReplit)

# Pull the latest changes from the remote repository
git pull origin main

# Open the project in VS Code
code .

# Build Docker image
docker build -t fire-ban-checker .

# Run Docker container
docker run -p 8080:8080 fire-ban-checker

# Open the application in a browser

# Navigate to http://localhost:8080

How to Start the App without Docker: 
Run the following command in the terminal:

npm run build 

npm run dev

When you see the following output:

VITE v5.3.1 ready in 497 ms

➜  Local:   http://localhost:8080/FireBanReplit/
➜  Network: use --host to expose
➜  Press 'H' + 'Enter' to show help
Ctrl-click or copy the local HTTP link to your browser and you will be directed to the FireBanreplit site.

Only local network work because of.. reasons. 
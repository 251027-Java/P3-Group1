FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies (includes @angular/cli)
RUN npm install

# Copy source code
COPY . .

EXPOSE 4200

<<<<<<< HEAD
CMD ["npm", "start"]
=======
CMD ["npm", "start"]
>>>>>>> 6a4c4fbeb03105b02781ff1d1dde318d359f3cc7

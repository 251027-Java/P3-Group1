FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies (includes @angular/cli)
RUN npm install

# Copy source code
COPY . .

EXPOSE 4200

CMD ["npm", "start"]

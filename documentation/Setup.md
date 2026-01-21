# Setup & Deployment Guide

## Prerequisites

**Required**: Docker 20.10+, Docker Compose 2.0+, Java JDK 17+, Maven 3.8+, Node.js 18+, npm 9+

**System Requirements**: Minimum 8 GB RAM, 20 GB disk, 2 CPU cores. Recommended: 16 GB RAM, 50 GB disk, 4+ CPU cores

## Local Development Setup

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd P3-Group1

# Start all services
docker-compose up -d
```

### Manual Start (Development)

**Infrastructure:**
```bash
docker-compose up -d zookeeper kafka postgres
```

**Backend Services:**
```bash
# Terminal 1: Eureka
cd backend/eureka-server/eureka-server && ./mvnw spring-boot:run

# Terminal 2: API Gateway
cd backend/api-gateway/gateway && ./mvnw spring-boot:run

# Terminal 3: React Service
cd backend/React-spring-backend && ./mvnw spring-boot:run

# Terminal 4: Angular Service
cd backend/Angular-spring-backend && ./mvnw spring-boot:run
```

**Frontend:**
```bash
# React MFE
cd frontend/react-child-app/P3-react-child-app && npm install && npm run dev

# Angular MFE
cd frontend/angular-child-app/angular-child-app && npm install && npm start
```

### Access Points

- React Frontend: http://localhost:3000
- Angular Frontend: http://localhost:4200
- API Gateway: http://localhost:8080
- Eureka: http://localhost:8761
- Swagger UI: http://localhost:8081/swagger-ui.html

## Production Deployment

### AWS EC2 Setup

**EC2 Instance #1 (Application Server)**
- Instance: t3.large+, Ubuntu 22.04 LTS
- Ports: 22, 80, 443, 8080, 8081, 8082, 8761, 3000, 4200
- Storage: 50 GB minimum

```bash
# Install Docker
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Deploy
git clone <repository-url> && cd P3-Group1
cp docker-compose.prod.yml docker-compose.yml
docker-compose up -d
```

**EC2 Instance #2 (Build & Monitoring)**
- Instance: t3.medium+, Ubuntu 22.04 LTS
- Ports: 22, 8080 (Jenkins), 5601 (Kibana), 9200 (Elasticsearch)

```bash
# Install Jenkins
sudo apt update && sudo apt install openjdk-17-jdk -y
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update && sudo apt install jenkins -y
sudo systemctl start jenkins && sudo systemctl enable jenkins

# Setup ELK Stack
cd P3-Group1/elk && docker-compose up -d
```

Access: Jenkins `http://<ec2-ip>:8080`, Kibana `http://<ec2-ip>:5601`

## Environment Configuration

**Backend**: Edit `application.properties` files with database URLs, Kafka bootstrap servers, and Eureka service URLs.

**Frontend**: Create `.env` files:
- React MFE: `VITE_API_URL=http://localhost:8080`, `VITE_WS_URL=ws://localhost:8080`
- Angular MFE: `NG_API_URL=http://localhost:8080`

**Docker**: Set environment variables in `docker-compose.yml` or `.env` file for production.

## Database Setup

```bash
# Create databases
docker exec -it postgres psql -U dev_user -d postgres -c "CREATE DATABASE fleet_platform; CREATE DATABASE fleet2;"
```

Spring Boot auto-creates tables on first startup. For production, use Flyway migrations: `cd backend/React-spring-backend && ./mvnw flyway:migrate`

## Troubleshooting

**Port Conflicts**: `sudo lsof -i :8080 && sudo kill -9 <PID>` or change port in `application.properties`

**Docker Issues**: `docker-compose down -v && docker system prune -a && docker-compose build --no-cache && docker-compose up -d`

**Database Connection**: Use `postgres` as hostname in Docker, `localhost` for local. Reset: `docker-compose down -v && docker-compose up -d postgres`

**Service Registration**: Check Eureka at http://localhost:8761. Restart services in order: Eureka → API Gateway → Backend services

## Development Commands

```bash
# Tests
cd backend/React-spring-backend && ./mvnw test
cd frontend/react-child-app/P3-react-child-app && npm test

# Build
cd backend/React-spring-backend && ./mvnw clean package -DskipTests
cd frontend/react-child-app/P3-react-child-app && npm run build

# Docker
docker-compose build [service-name]  # Specific service
docker-compose build                  # All services
```

## Monitoring

ELK Stack: `cd elk && docker-compose up -d`. Configure Logstash and Filebeat configs. Access Kibana at http://localhost:5601


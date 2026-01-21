# =========================
# STAGE 1: Build (compile + verify)
# =========================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies first
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn -B clean package -DskipTests


# =========================
# STAGE 2: Development
# =========================
FROM maven:3.9.6-eclipse-temurin-21 AS dev
WORKDIR /app

# Copy project files (will be overridden by volume in dev)
COPY pom.xml .
COPY src ./src

EXPOSE 8080

# Run Spring Boot in dev mode
CMD ["mvn", "spring-boot:run"]

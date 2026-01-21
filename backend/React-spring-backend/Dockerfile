# Use Maven + JDK image for dev
FROM maven:3.9.6-eclipse-temurin-21

# Set working directory
WORKDIR /app

# Copy pom.xml first to cache dependencies
COPY pom.xml .

# Pre-download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Expose Spring Boot port
EXPOSE 8080

# Run the app in dev mode
CMD ["mvn", "spring-boot:run"]

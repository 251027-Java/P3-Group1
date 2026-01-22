# Use Maven + JDK image for dev
FROM maven:3.9.6-eclipse-temurin-21

# Set working directory
WORKDIR /app

# Copy only pom.xml first for dependency caching
COPY pom.xml .

# Pre-download dependencies
RUN mvn dependency:go-offline

# Copy the source code
COPY src ./src

# Expose Spring Boot port
EXPOSE 8080

# Command to run the app in dev mode
CMD ["mvn", "spring-boot:run"]
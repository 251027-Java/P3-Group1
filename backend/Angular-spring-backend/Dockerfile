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
<<<<<<< HEAD
CMD ["mvn", "spring-boot:run"]
=======
CMD ["mvn", "spring-boot:run"]
>>>>>>> 6a4c4fbeb03105b02781ff1d1dde318d359f3cc7

# Use Maven + JDK image for dev
FROM maven:3.9.6-eclipse-temurin-21

# Set working directory
WORKDIR /app

<<<<<<< HEAD
# Copy only pom.xml first for dependency caching
=======
# Copy pom.xml first to cache dependencies
>>>>>>> 6a4c4fbeb03105b02781ff1d1dde318d359f3cc7
COPY pom.xml .

# Pre-download dependencies
RUN mvn dependency:go-offline

<<<<<<< HEAD
# Copy the source code
=======
# Copy source code
>>>>>>> 6a4c4fbeb03105b02781ff1d1dde318d359f3cc7
COPY src ./src

# Expose Spring Boot port
EXPOSE 8080

<<<<<<< HEAD
# Command to run the app in dev mode
CMD ["mvn", "spring-boot:run"]
=======
# Run the app in dev mode
CMD ["mvn", "spring-boot:run"]
>>>>>>> 6a4c4fbeb03105b02781ff1d1dde318d359f3cc7

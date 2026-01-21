# Build stage
FROM eclipse-temurin:21-noble AS build
WORKDIR /app

COPY ./ ./
RUN ./mvnw dependency:go-offline
RUN ./mvnw package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine AS run
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

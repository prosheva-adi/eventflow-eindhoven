FROM gradle:8-jdk21 AS build
WORKDIR /app
COPY . .
RUN gradle bootJar -x test

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/backend.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
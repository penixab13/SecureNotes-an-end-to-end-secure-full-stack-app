# Stage 1: Build the application using Maven
FROM maven:3.9-eclipse-temurin-21 AS build

# Set the working directory inside the container
WORKDIR /workspace/app

# Copy the Maven project file first to leverage Docker layer caching
COPY pom.xml .
COPY backend/pom.xml ./backend/

# Copy the rest of the backend source code
COPY backend/src ./backend/src

# Build the application, skipping tests for faster builds (optional)
# Crucially, this builds the JAR inside the container using the copied source
RUN mvn -f pom.xml clean package -DskipTests -pl backend -am

# Stage 2: Create the final image using OpenJDK JRE
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the built JAR file from the 'build' stage
# Adjust the JAR filename if your artifactId/version is different
COPY --from=build /workspace/app/backend/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

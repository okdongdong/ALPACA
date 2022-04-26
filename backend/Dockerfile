FROM openjdk:11-jdk
ARG JAR_FILE=build/libs/bfc-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
EXPOSE 8443
ENTRYPOINT ["java","-jar","app.jar","--spring.config.name=application-prod"]

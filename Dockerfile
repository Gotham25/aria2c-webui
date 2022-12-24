FROM timbru31/java-node:8-jre AS builder
RUN apt-get update -y && apt-get install -y bzip2
WORKDIR /app
COPY . .
RUN ./gradlew installDependencies
RUN ./gradlew build

FROM node:current-alpine
RUN apk --no-cache add ca-certificates curl tar bzip2 gzip vim bash
RUN addgroup -S appgroup && adduser -S aria2 -G appgroup
WORKDIR /app
COPY --from=builder /app/aria2-backend/ .
RUN chown -R aria2:appgroup /app
USER aria2
RUN rm -rf node_modules package-lock.json && npm install
EXPOSE 3000
CMD [ "npm", "start" ]


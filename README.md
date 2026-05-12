# getting-started

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: <https://quarkus.io/>.

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:

```shell script
./gradlew quarkusDev
```

> **_NOTE:_** Quarkus now ships with a Dev UI, which is available in dev mode only at <http://localhost:8080/q/dev/>.

## Building and running with Docker

### JVM mode

```shell script
./gradlew build
docker build -f src/main/docker/Dockerfile.jvm -t quarkus/getting-started-jvm .
docker run -i --rm -p 8080:8080 quarkus/getting-started-jvm
```

### build a native image

```shell script
./gradlew build -Dquarkus.native.enabled=true -Dquarkus.native.container-build=true
  docker build -f src/main/docker/Dockerfile.native -t getting-started:latest .
```

### run with docker

```shell script
docker run -d --rm -p 8080:8080 --name qs quarkus/getting-started:1.0.0-SNAPSHOT
```

## push docker image to aws

```shell script
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 331374384642.dkr.ecr.us-east-1.amazonaws.com
```

```shell script
./gradlew build -Dquarkus.native.enabled=true -Dquarkus.native.container-build=true
  docker build -f src/main/docker/Dockerfile.native -t getting-started:latest .
```

```shell script
docker tag getting-started:latest 331374384642.dkr.ecr.us-east-1.amazonaws.com/getting-started:latest
```

```shell script
docker push 331374384642.dkr.ecr.us-east-1.amazonaws.com/getting-started:latest
```



### Notes

quarkus
https://quarkus.io/guides/rest#declaring-endpoints-uri-mapping

rest easy
https://docs.resteasy.dev/7.0/userguide/resteasy-reference-guide.pdf

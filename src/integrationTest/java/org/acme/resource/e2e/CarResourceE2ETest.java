package org.acme.resource.e2e;


import io.quarkus.test.common.WithTestResource;
import io.quarkus.test.junit.QuarkusIntegrationTest;
import io.restassured.http.ContentType;
import io.smallrye.jwt.build.Jwt;
import org.acme.resource.request.CarRequest;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static io.restassured.RestAssured.given;
import static org.acme.resource.CarRequestTestData.aCarRequest;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusIntegrationTest
@WithTestResource(PostgreSQLTestResource.class)
class CarResourceE2ETest {

    private String adminToken() {
        return Jwt.issuer("https://quarkus-getting-started.io")
            .upn("admin")
            .groups("admin")
            .expiresAt(Instant.now().plusSeconds(3600))
            .sign();
    }

    @Test
    void getCars_returnsCarsIncludingCreatedCar() {
        CarRequest request = aCarRequest();

        String id = given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + adminToken())
            .body(request)
        .when()
            .post("/cars")
        .then()
            .statusCode(200)
            .extract().path("id");

        given()
            .header("Authorization", "Bearer " + adminToken())
        .when()
            .get("/cars")
        .then()
            .statusCode(200)
            .body("id", hasItem(id))
            .body("make", hasItem(request.make()))
            .body("model", hasItem(request.model()));
    }

    @Test
    void createCar_persistsCarAndCanBeRetrieved() {
        CarRequest request = aCarRequest();

        String id = given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + adminToken())
            .body(request)
        .when()
            .post("/cars")
        .then()
            .statusCode(200)
            .body("id", notNullValue())
            .body("make", equalTo(request.make()))
            .body("model", equalTo(request.model()))
            .body("year", equalTo(request.year()))
            .body("colour", equalTo(request.colour()))
            .body("mileage", equalTo(request.mileage()))
            .extract().path("id");

        given()
            .header("Authorization", "Bearer " + adminToken())
        .when()
            .get("/cars/{id}", id)
        .then()
            .statusCode(200)
            .body("id", equalTo(id))
            .body("make", equalTo(request.make()))
            .body("model", equalTo(request.model()))
            .body("year", equalTo(request.year()))
            .body("colour", equalTo(request.colour()))
            .body("mileage", equalTo(request.mileage()));
    }
}
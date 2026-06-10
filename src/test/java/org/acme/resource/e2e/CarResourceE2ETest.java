package org.acme.resource.e2e;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import org.acme.resource.CarResource;
import org.acme.resource.request.CarRequest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.acme.resource.CarRequestTestData.aCarRequest;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
@TestHTTPEndpoint(CarResource.class)
class CarResourceE2ETest {

    @Test
    @TestSecurity(user = "admin", roles = "admin")
    void getCars_returnsCarsIncludingCreatedCar() {
        CarRequest request = aCarRequest();

        String id = given()
            .contentType(ContentType.JSON)
            .body(request)
        .when()
            .post()
        .then()
            .statusCode(200)
            .extract().path("id");

        given()
        .when()
            .get()
        .then()
            .statusCode(200)
            .body("id", hasItem(id))
            .body("make", hasItem(request.make()))
            .body("model", hasItem(request.model()));
    }

    @Test
    @TestSecurity(user = "admin", roles = "admin")
    void createCar_persistsCarAndCanBeRetrieved() {
        CarRequest request = aCarRequest();

        String id = given()
            .contentType(ContentType.JSON)
            .body(request)
        .when()
            .post()
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
        .when()
            .get("/{id}", id)
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
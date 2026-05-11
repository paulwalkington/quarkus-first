package org.acme.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class CarResourceTest {

    @Test
    void createCarReturnsResponseWithGeneratedId() {
        given()
                .contentType("application/json")
                .body("""
                        {
                          "make": "Toyota",
                          "model": "Corolla",
                          "year": 2021,
                          "colour": "Red",
                          "mileage": 80000
                        }
                        """)
                .when().post("/cars")
                .then()
                .statusCode(200)
                .body("id", notNullValue())
                .body("make", equalTo("Toyota"))
                .body("model", equalTo("Corolla"))
                .body("year", equalTo(2021))
                .body("colour", equalTo("Red"))
                .body("mileage", equalTo(80000));
    }

    @Test
    void getCarByIdReturnsTheCar() {
        String id = given()
                .contentType("application/json")
                .body("""
                        {
                          "make": "Honda",
                          "model": "Civic",
                          "year": 2019,
                          "colour": "Blue",
                          "mileage": 150000
                        }
                        """)
                .when().post("/cars")
                .then()
                .statusCode(200)
                .extract().path("id");

        given()
                .when().get("/cars/{id}", id)
                .then()
                .statusCode(200)
                .body("id", equalTo(id))
                .body("make", equalTo("Honda"))
                .body("model", equalTo("Civic"));
    }

    @Test
    void getUnknownCarReturns404() {
        given()
                .when().get("/cars/{id}", UUID.randomUUID().toString())
                .then()
                .statusCode(404);
    }

    @Test
    void listCarsIncludesCreated() {
        String marker = "Tesla-" + UUID.randomUUID();

        given()
                .contentType("application/json")
                .body("""
                        {
                          "make": "%s",
                          "model": "Model 3",
                          "year": 2022,
                          "colour": "Black",
                          "mileage": 5000
                        }
                        """.formatted(marker))
                .when().post("/cars")
                .then()
                .statusCode(200);

        given()
                .when().get("/cars")
                .then()
                .statusCode(200)
                .body("make", hasItem(marker));
    }

    @Test
    void deleteCarRemovesIt() {
        String id = given()
                .contentType("application/json")
                .body("""
                        {
                          "make": "Ford",
                          "model": "Focus",
                          "year": 2020,
                          "colour": "White",
                          "mileage": 120000
                        }
                        """)
                .when().post("/cars")
                .then()
                .statusCode(200)
                .extract().path("id");

        given()
                .when().delete("/cars/{id}", id)
                .then()
                .statusCode(204);

        given()
                .when().get("/cars/{id}", id)
                .then()
                .statusCode(404);
    }

    @Test
    void deleteUnknownCarReturns404() {
        given()
                .when().delete("/cars/{id}", UUID.randomUUID().toString())
                .then()
                .statusCode(404);
    }
}
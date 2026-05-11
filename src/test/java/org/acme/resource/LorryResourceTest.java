package org.acme.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class LorryResourceTest {

    @Test
    void createLorryReturnsResponseWithGeneratedId() {
        given()
                .contentType("application/json")
                .body("""
                        {
                          "make": "Scania",
                          "model": "R500",
                          "year": 2021,
                          "colour": "Red",
                          "mileage": 80000
                        }
                        """)
                .when().post("/lorries")
                .then()
                .statusCode(200)
                .body("id", notNullValue())
                .body("make", equalTo("Scania"))
                .body("model", equalTo("R500"))
                .body("year", equalTo(2021))
                .body("colour", equalTo("Red"))
                .body("mileage", equalTo(80000));
    }

    @Test
    void getLorryByIdReturnsTheLorry() {
        String id = given()
                .contentType("application/json")
                .body("""
                        {
                          "make": "DAF",
                          "model": "XF",
                          "year": 2019,
                          "colour": "Blue",
                          "mileage": 150000
                        }
                        """)
                .when().post("/lorries")
                .then()
                .statusCode(200)
                .extract().path("id");

        given()
                .when().get("/lorries/{id}", id)
                .then()
                .statusCode(200)
                .body("id", equalTo(id))
                .body("make", equalTo("DAF"))
                .body("model", equalTo("XF"));
    }

    @Test
    void getUnknownLorryReturns404() {
        given()
                .when().get("/lorries/{id}", UUID.randomUUID().toString())
                .then()
                .statusCode(404);
    }

    @Test
    void listLorriesIncludesCreated() {
        String marker = "Mercedes-" + UUID.randomUUID();

        given()
                .contentType("application/json")
                .body("""
                        {
                          "make": "%s",
                          "model": "Actros",
                          "year": 2022,
                          "colour": "Black",
                          "mileage": 5000
                        }
                        """.formatted(marker))
                .when().post("/lorries")
                .then()
                .statusCode(200);

        given()
                .when().get("/lorries")
                .then()
                .statusCode(200)
                .body("make", hasItem(marker));
    }

    @Test
    void deleteLorryRemovesIt() {
        String id = given()
                .contentType("application/json")
                .body("""
                        {
                          "make": "Volvo",
                          "model": "FH16",
                          "year": 2020,
                          "colour": "White",
                          "mileage": 120000
                        }
                        """)
                .when().post("/lorries")
                .then()
                .statusCode(200)
                .extract().path("id");

        given()
                .when().delete("/lorries/{id}", id)
                .then()
                .statusCode(204);

        given()
                .when().get("/lorries/{id}", id)
                .then()
                .statusCode(404);
    }

    @Test
    void deleteUnknownLorryReturns404() {
        given()
                .when().delete("/lorries/{id}", UUID.randomUUID().toString())
                .then()
                .statusCode(404);
    }
}

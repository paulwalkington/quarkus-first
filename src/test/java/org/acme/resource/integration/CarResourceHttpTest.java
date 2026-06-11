package org.acme.resource.integration;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.InjectMock;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import io.smallrye.jwt.build.Jwt;
import org.acme.domain.Car;
import org.acme.resource.CarResource;
import org.acme.service.CarService;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.acme.resource.CarRequestTestData.aCarRequest;
import static org.acme.resource.CarTestData.aCar;
import static org.acme.resource.RandomTestData.anId;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@QuarkusTest
@TestHTTPEndpoint(CarResource.class)
class CarResourceHttpTest {

    @InjectMock
    CarService service;

    // createCar

    @Test
    void createCar_whenTokenExpired_returns401() {
        String expiredToken = Jwt.issuer("https://quarkus-getting-started.io")
            .upn("admin")
            .groups("admin")
            .expiresAt(Instant.now().minusSeconds(3600))
            .sign();

        given()
            .contentType(ContentType.JSON)
            .body(aCarRequest())
            .header("Authorization", "Bearer " + expiredToken)
        .when()
            .post()
        .then()
            .statusCode(401);
    }


    @Test
    @TestSecurity(user = "admin", roles = "admin")
    void createCar_returns200WithCarInBody() {
        Car car = aCar();
        when(service.addCar(any())).thenReturn(car);

        given()
            .contentType(ContentType.JSON)
            .body(aCarRequest())
        .when()
            .post()
        .then()
            .statusCode(200)
            .body("id", equalTo(car.id()))
            .body("make", equalTo(car.make()))
            .body("model", equalTo(car.model()))
            .body("year", equalTo(car.year()))
            .body("colour", equalTo(car.colour()))
            .body("mileage", equalTo(car.mileage()));
    }

    @Test
    void createCar_whenUnauthenticated_returns401() {
        given()
            .contentType(ContentType.JSON)
            .body(aCarRequest())
        .when()
            .post()
        .then()
            .statusCode(401);
    }

    @Test
    @TestSecurity(user = "user", roles = "user")
    void createCar_whenNotAdmin_returns403() {
        given()
            .contentType(ContentType.JSON)
            .body(aCarRequest())
        .when()
            .post()
        .then()
            .statusCode(403);
    }

    // getCar

    @Test
    @TestSecurity(user = "user", roles = "user")
    void getCar_whenCarExists_returns200WithCarInBody() {
        Car car = aCar();
        when(service.getCar(car.id())).thenReturn(Optional.of(car));

        given()
        .when()
            .get("/{id}", car.id())
        .then()
            .statusCode(200)
            .body("id", equalTo(car.id()))
            .body("make", equalTo(car.make()))
            .body("model", equalTo(car.model()))
            .body("year", equalTo(car.year()))
            .body("colour", equalTo(car.colour()))
            .body("mileage", equalTo(car.mileage()));
    }

    @Test
    @TestSecurity(user = "user", roles = "user")
    void getCar_whenCarNotFound_returns404() {
        String id = anId();
        when(service.getCar(id)).thenReturn(Optional.empty());

        given()
        .when()
            .get("/{id}", id)
        .then()
            .statusCode(404);
    }

    @Test
    void getCar_whenUnauthenticated_returns401() {
        given()
        .when()
            .get("/{id}", anId())
        .then()
            .statusCode(401);
    }

    // getCars

    @Test
    @TestSecurity(user = "user", roles = "user")
    void getCars_returns200WithListOfCars() {
        Car car1 = aCar();
        Car car2 = aCar();
        when(service.getCars()).thenReturn(List.of(car1, car2));

        given()
        .when()
            .get()
        .then()
            .statusCode(200)
            .body("$", hasSize(2))
            .body("[0].id", equalTo(car1.id()))
            .body("[1].id", equalTo(car2.id()));
    }

    @Test
    @TestSecurity(user = "user", roles = "user")
    void getCars_whenNoCars_returns200WithEmptyList() {
        when(service.getCars()).thenReturn(List.of());

        given()
        .when()
            .get()
        .then()
            .statusCode(200)
            .body("$", hasSize(0));
    }

    @Test
    void getCars_whenUnauthenticated_returns401() {
        given()
        .when()
            .get()
        .then()
            .statusCode(401);
    }

    // searchCars

    @Test
    @TestSecurity(user = "user", roles = "user")
    void searchCars_returns200WithMatchingCars() {
        Car car1 = aCar();
        Car car2 = aCar();
        when(service.searchCars(any(), any(), any(), any(), any())).thenReturn(List.of(car1, car2));

        given()
            .queryParam("make", car1.make())
        .when()
            .get("/search")
        .then()
            .statusCode(200)
            .body("$", hasSize(2))
            .body("[0].id", equalTo(car1.id()))
            .body("[1].id", equalTo(car2.id()));
    }

    @Test
    @TestSecurity(user = "user", roles = "user")
    void searchCars_whenNoResults_returns200WithEmptyList() {
        when(service.searchCars(any(), any(), any(), any(), any())).thenReturn(List.of());

        given()
        .when()
            .get("/search")
        .then()
            .statusCode(200)
            .body("$", hasSize(0));
    }

    // updateCar

    @Test
    @TestSecurity(user = "admin", roles = "admin")
    void updateCar_whenCarExists_returns200WithUpdatedCarInBody() {
        String id = anId();
        Car car = aCar();
        when(service.updateCar(eq(id), any())).thenReturn(Optional.of(car));

        given()
            .contentType(ContentType.JSON)
            .body(aCarRequest())
        .when()
            .put("/{id}", id)
        .then()
            .statusCode(200)
            .body("id", equalTo(car.id()))
            .body("make", equalTo(car.make()))
            .body("model", equalTo(car.model()))
            .body("year", equalTo(car.year()))
            .body("colour", equalTo(car.colour()))
            .body("mileage", equalTo(car.mileage()));
    }

    @Test
    @TestSecurity(user = "admin", roles = "admin")
    void updateCar_whenCarNotFound_returns404() {
        String id = anId();
        when(service.updateCar(eq(id), any())).thenReturn(Optional.empty());

        given()
            .contentType(ContentType.JSON)
            .body(aCarRequest())
        .when()
            .put("/{id}", id)
        .then()
            .statusCode(404);
    }

    @Test
    void updateCar_whenUnauthenticated_returns401() {
        given()
            .contentType(ContentType.JSON)
            .body(aCarRequest())
        .when()
            .put("/{id}", anId())
        .then()
            .statusCode(401);
    }

    // deleteCar

    @Test
    @TestSecurity(user = "admin", roles = "admin")
    void deleteCar_whenCarExists_returns204() {
        String id = anId();
        when(service.deleteCar(id)).thenReturn(true);

        given()
        .when()
            .delete("/{id}", id)
        .then()
            .statusCode(204);
    }

    @Test
    @TestSecurity(user = "admin", roles = "admin")
    void deleteCar_whenCarNotFound_returns404() {
        String id = anId();
        when(service.deleteCar(id)).thenReturn(false);

        given()
        .when()
            .delete("/{id}", id)
        .then()
            .statusCode(404);
    }

    @Test
    void deleteCar_whenUnauthenticated_returns401() {
        given()
        .when()
            .delete("/{id}", anId())
        .then()
            .statusCode(401);
    }
}
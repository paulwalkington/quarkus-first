package org.acme.resource.integration;

import io.quarkus.test.InjectMock;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import org.acme.domain.Lorry;
import org.acme.resource.LorryResource;
import org.acme.service.LorryService;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.acme.resource.LorryRequestTestData.aLorryRequest;
import static org.acme.resource.LorryTestData.aLorry;
import static org.acme.resource.RandomTestData.anId;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@QuarkusTest
@TestHTTPEndpoint(LorryResource.class)
class LorryResourceHttpTest {

    @InjectMock
    LorryService service;

    // createLorry

    @Test
    @TestSecurity(user = "admin", roles = "admin")
    void createLorry_returns200WithLorryInBody() {
        Lorry lorry = aLorry();
        when(service.addLorry(any())).thenReturn(lorry);

        given()
            .contentType(ContentType.JSON)
            .body(aLorryRequest())
        .when()
            .post()
        .then()
            .statusCode(200)
            .body("id", equalTo(lorry.id()))
            .body("make", equalTo(lorry.make()))
            .body("model", equalTo(lorry.model()))
            .body("year", equalTo(lorry.year()))
            .body("colour", equalTo(lorry.colour()))
            .body("mileage", equalTo(lorry.mileage()));
    }

    @Test
    void createLorry_whenUnauthenticated_returns401() {
        given()
            .contentType(ContentType.JSON)
            .body(aLorryRequest())
        .when()
            .post()
        .then()
            .statusCode(401);
    }

    @Test
    @TestSecurity(user = "user", roles = "user")
    void createLorry_whenNotAdmin_returns403() {
        given()
            .contentType(ContentType.JSON)
            .body(aLorryRequest())
        .when()
            .post()
        .then()
            .statusCode(403);
    }

    // getLorry

    @Test
    @TestSecurity(user = "user", roles = "user")
    void getLorry_whenLorryExists_returns200WithLorryInBody() {
        Lorry lorry = aLorry();
        when(service.getLorry(lorry.id())).thenReturn(Optional.of(lorry));

        given()
        .when()
            .get("/{id}", lorry.id())
        .then()
            .statusCode(200)
            .body("id", equalTo(lorry.id()))
            .body("make", equalTo(lorry.make()))
            .body("model", equalTo(lorry.model()))
            .body("year", equalTo(lorry.year()))
            .body("colour", equalTo(lorry.colour()))
            .body("mileage", equalTo(lorry.mileage()));
    }

    @Test
    @TestSecurity(user = "user", roles = "user")
    void getLorry_whenLorryNotFound_returns404() {
        String id = anId();
        when(service.getLorry(id)).thenReturn(Optional.empty());

        given()
        .when()
            .get("/{id}", id)
        .then()
            .statusCode(404);
    }

    @Test
    void getLorry_whenUnauthenticated_returns401() {
        given()
        .when()
            .get("/{id}", anId())
        .then()
            .statusCode(401);
    }

    // getLorries

    @Test
    @TestSecurity(user = "user", roles = "user")
    void getLorries_returns200WithListOfLorries() {
        Lorry lorry1 = aLorry();
        Lorry lorry2 = aLorry();
        when(service.getLorries()).thenReturn(List.of(lorry1, lorry2));

        given()
        .when()
            .get()
        .then()
            .statusCode(200)
            .body("$", hasSize(2))
            .body("[0].id", equalTo(lorry1.id()))
            .body("[1].id", equalTo(lorry2.id()));
    }

    @Test
    @TestSecurity(user = "user", roles = "user")
    void getLorries_whenNoLorries_returns200WithEmptyList() {
        when(service.getLorries()).thenReturn(List.of());

        given()
        .when()
            .get()
        .then()
            .statusCode(200)
            .body("$", hasSize(0));
    }

    @Test
    void getLorries_whenUnauthenticated_returns401() {
        given()
        .when()
            .get()
        .then()
            .statusCode(401);
    }

    // searchLorries

    @Test
    @TestSecurity(user = "user", roles = "user")
    void searchLorries_returns200WithMatchingLorries() {
        Lorry lorry1 = aLorry();
        Lorry lorry2 = aLorry();
        when(service.searchLorries(any(), any(), any(), any(), any())).thenReturn(List.of(lorry1, lorry2));

        given()
            .queryParam("make", lorry1.make())
        .when()
            .get("/search")
        .then()
            .statusCode(200)
            .body("$", hasSize(2))
            .body("[0].id", equalTo(lorry1.id()))
            .body("[1].id", equalTo(lorry2.id()));
    }

    @Test
    @TestSecurity(user = "user", roles = "user")
    void searchLorries_whenNoResults_returns200WithEmptyList() {
        when(service.searchLorries(any(), any(), any(), any(), any())).thenReturn(List.of());

        given()
        .when()
            .get("/search")
        .then()
            .statusCode(200)
            .body("$", hasSize(0));
    }

    // updateLorry

    @Test
    @TestSecurity(user = "admin", roles = "admin")
    void updateLorry_whenLorryExists_returns200WithUpdatedLorryInBody() {
        String id = anId();
        Lorry lorry = aLorry();
        when(service.updateLorry(eq(id), any())).thenReturn(Optional.of(lorry));

        given()
            .contentType(ContentType.JSON)
            .body(aLorryRequest())
        .when()
            .put("/{id}", id)
        .then()
            .statusCode(200)
            .body("id", equalTo(lorry.id()))
            .body("make", equalTo(lorry.make()))
            .body("model", equalTo(lorry.model()))
            .body("year", equalTo(lorry.year()))
            .body("colour", equalTo(lorry.colour()))
            .body("mileage", equalTo(lorry.mileage()));
    }

    @Test
    @TestSecurity(user = "admin", roles = "admin")
    void updateLorry_whenLorryNotFound_returns404() {
        String id = anId();
        when(service.updateLorry(eq(id), any())).thenReturn(Optional.empty());

        given()
            .contentType(ContentType.JSON)
            .body(aLorryRequest())
        .when()
            .put("/{id}", id)
        .then()
            .statusCode(404);
    }

    @Test
    void updateLorry_whenUnauthenticated_returns401() {
        given()
            .contentType(ContentType.JSON)
            .body(aLorryRequest())
        .when()
            .put("/{id}", anId())
        .then()
            .statusCode(401);
    }

    // deleteLorry

    @Test
    @TestSecurity(user = "admin", roles = "admin")
    void deleteLorry_whenLorryExists_returns204() {
        String id = anId();
        when(service.deleteLorry(id)).thenReturn(true);

        given()
        .when()
            .delete("/{id}", id)
        .then()
            .statusCode(204);
    }

    @Test
    @TestSecurity(user = "admin", roles = "admin")
    void deleteLorry_whenLorryNotFound_returns404() {
        String id = anId();
        when(service.deleteLorry(id)).thenReturn(false);

        given()
        .when()
            .delete("/{id}", id)
        .then()
            .statusCode(404);
    }

    @Test
    void deleteLorry_whenUnauthenticated_returns401() {
        given()
        .when()
            .delete("/{id}", anId())
        .then()
            .statusCode(401);
    }
}

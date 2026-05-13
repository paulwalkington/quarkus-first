package org.acme.resource;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;

import org.acme.domain.Car;
import org.acme.resource.request.CarRequest;
import org.acme.resource.response.CarResponse;
import org.acme.service.CarService;
import org.jboss.resteasy.reactive.RestResponse;

import java.util.List;
import java.util.Optional;

@Path("/cars")
public class CarResource {

    @Inject
    CarService service;

    @Inject
    CarResponseTransformer transformer;

    @POST
    @RolesAllowed("admin")
    public CarResponse createCar(CarRequest carRequest) {
        Car car = service.addCar(carRequest);
        return transformer.toCarResponse(car);
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "user"})
    public RestResponse<CarResponse> getCar(String id) {
        Optional<Car> car = service.getCar(id);

        if (car.isEmpty()) {
            return RestResponse.notFound();
        }

        return RestResponse.ok(transformer.toCarResponse(car.get()));

    }

    @GET
    @RolesAllowed({"admin", "user"})
    public List<CarResponse> getCars() {
        List<Car> cars = service.getCars();
        return cars.stream().map(transformer::toCarResponse).toList();
    }

    @GET
    @Path("/search")
    @RolesAllowed({"admin", "user"})
    public List<CarResponse> searchCars(
            @QueryParam("make") String make,
            @QueryParam("model") String model,
            @QueryParam("year") Integer year,
            @QueryParam("colour") String colour,
            @QueryParam("maxMileage") Integer maxMileage) {
        return service.searchCars(make, model, year, colour, maxMileage)
                .stream().map(transformer::toCarResponse).toList();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("admin")
    public RestResponse<CarResponse> updateCar(String id, CarRequest carRequest) {
        Optional<Car> car = service.updateCar(id, carRequest);

        if (car.isEmpty()) {
            return RestResponse.notFound();
        }

        return RestResponse.ok(transformer.toCarResponse(car.get()));
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("admin")
    public RestResponse<Void> deleteCar(String id) {
        if (!service.deleteCar(id)) {
            return RestResponse.notFound();
        }
        return RestResponse.noContent();
    }

}


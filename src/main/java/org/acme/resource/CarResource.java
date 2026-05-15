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
    CarService carService;

    @Inject
    CarResponseTransformer carResponseTransformer;

    @POST
    @RolesAllowed("admin")
    public CarResponse createCar(CarRequest carRequest) {
        Car car = carService.addCar(carRequest);
        return carResponseTransformer.toCarResponse(car);
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "user"})
    public RestResponse<CarResponse> getCar(String id) {
        Optional<Car> car = carService.getCar(id);

        if (car.isEmpty()) {
            return RestResponse.notFound();
        }

        return RestResponse.ok(carResponseTransformer.toCarResponse(car.get()));

    }

    @GET
    @RolesAllowed({"admin", "user"})
    public List<CarResponse> getCars() {
        List<Car> cars = carService.getCars();
        return cars.stream().map(carResponseTransformer::toCarResponse).toList();
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
        return carService.searchCars(make, model, year, colour, maxMileage)
                .stream().map(carResponseTransformer::toCarResponse).toList();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("admin")
    public RestResponse<CarResponse> updateCar(String id, CarRequest carRequest) {
        Optional<Car> car = carService.updateCar(id, carRequest);

        if (car.isEmpty()) {
            return RestResponse.notFound();
        }

        return RestResponse.ok(carResponseTransformer.toCarResponse(car.get()));
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("admin")
    public RestResponse<Void> deleteCar(String id) {
        if (!carService.deleteCar(id)) {
            return RestResponse.notFound();
        }
        return RestResponse.noContent();
    }

}


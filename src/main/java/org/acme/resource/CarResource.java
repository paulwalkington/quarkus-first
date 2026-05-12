package org.acme.resource;

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

    @POST
    public CarResponse createCar(CarRequest carRequest) {
        Car car = service.addCar(carRequest);
        return transformToCarResponse(car);
    }

    @GET
    @Path("/{id}")
    public RestResponse<CarResponse> getCar(String id) {
        Optional<Car> car = service.getCar(id);

        if (car.isEmpty()) {
            return RestResponse.notFound();
        }

        return RestResponse.ok(transformToCarResponse(car.get()));

    }

    @GET
    public List<CarResponse> getCars() {
        List<Car> cars = service.getCars();
        return cars.stream().map(this::transformToCarResponse).toList();
    }

    @GET
    @Path("/search")
    public List<CarResponse> searchCars(
            @QueryParam("make") String make,
            @QueryParam("model") String model,
            @QueryParam("year") Integer year,
            @QueryParam("colour") String colour,
            @QueryParam("maxMileage") Integer maxMileage) {
        return service.searchCars(make, model, year, colour, maxMileage)
                .stream().map(this::transformToCarResponse).toList();
    }

    @PUT
    @Path("/{id}")
    public RestResponse<CarResponse> updateCar(String id, CarRequest carRequest) {
        Optional<Car> car = service.updateCar(id, carRequest);

        if (car.isEmpty()) {
            return RestResponse.notFound();
        }

        return RestResponse.ok(transformToCarResponse(car.get()));
    }

    @DELETE
    @Path("/{id}")
    public RestResponse<Void> deleteCar(String id) {
        if (!service.deleteCar(id)) {
            return RestResponse.notFound();
        }
        return RestResponse.noContent();
    }

    private CarResponse transformToCarResponse(Car car) {
        return new CarResponse(
                car.id(),
                car.make(),
                car.model(),
                car.year(),
                car.colour(),
                car.mileage());
    }

}

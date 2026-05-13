package org.acme.resource;

import jakarta.enterprise.context.ApplicationScoped;

import org.acme.domain.Car;
import org.acme.resource.response.CarResponse;

@ApplicationScoped
public class CarResponseTransformer {

    public CarResponse toCarResponse(Car car) {
        return new CarResponse(
                car.id(),
                car.make(),
                car.model(),
                car.year(),
                car.colour(),
                car.mileage());
    }
}

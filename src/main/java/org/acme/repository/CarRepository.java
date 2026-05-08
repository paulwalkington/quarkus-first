package org.acme.repository;

import jakarta.enterprise.context.ApplicationScoped;

import org.acme.domain.Car;
import org.acme.exception.FailedToAddToDatabaseException;

import java.util.*;

@ApplicationScoped
public class CarRepository {

    private final Map<String, Car> cars;

    public CarRepository() {
        cars = new HashMap<>();
    }

    public void addCar(Car car) {
        // cars.put(car.id(), car);

        throw new FailedToAddToDatabaseException("unable to add car");
    }

    public List<Car> getCars() {
        return new ArrayList<>(cars.values());
    }

    public Optional<Car> getCar(String id) {
        return Optional.ofNullable(cars.get(id));
    }
}

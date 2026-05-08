package org.acme.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.acme.domain.Car;
import org.acme.repository.CarRepository;
import org.acme.resource.request.CarRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class CarService {

    @Inject
    public CarRepository carRepository;

    public Car addCar(CarRequest carRequest) {
        Car car = new Car(
                UUID.randomUUID().toString(),
                carRequest.make(),
                carRequest.model());

        carRepository.addCar(car);
        return car;
    }

    public Optional<Car> getCar(String id) {
        return carRepository.getCar(id);
    }

    public List<Car> getCars() {
        return carRepository.getCars();
    }
}

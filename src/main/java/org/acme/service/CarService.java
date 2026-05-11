package org.acme.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.acme.domain.Car;
import org.acme.repository.CarEntity;
import org.acme.repository.CarRepository;
import org.acme.resource.request.CarRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class CarService {

    @Inject
    public CarRepository carRepository;

    @Transactional
    public Car addCar(CarRequest carRequest) {
        Car car = new Car(
                UUID.randomUUID().toString(),
                carRequest.make(),
                carRequest.model(),
                carRequest.year(),
                carRequest.colour(),
                carRequest.mileage());

        carRepository.addCar(CarEntity.fromDomain(car));
        return car;
    }

    public Optional<Car> getCar(String id) {
        return carRepository.getCar(id).map(CarEntity::toDomain);
    }

    public List<Car> getCars() {
        return carRepository.getCars().stream().map(CarEntity::toDomain).toList();
    }
}
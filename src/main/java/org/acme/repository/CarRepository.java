package org.acme.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class CarRepository implements PanacheRepositoryBase<CarEntity, String> {

    public void addCar(CarEntity car) {
        persist(car);
    }

    public List<CarEntity> getCars() {
        return listAll();
    }

    public Optional<CarEntity> getCar(String id) {
        return findByIdOptional(id);
    }

    public boolean deleteCar(String id) {
        return deleteById(id);
    }

    public Optional<CarEntity> updateCar(String id, String make, String model, int year, String colour, int mileage) {
        return findByIdOptional(id).map(entity -> {
            entity.setMake(make);
            entity.setModel(model);
            entity.setYear(year);
            entity.setColour(colour);
            entity.setMileage(mileage);
            return entity;
        });
    }
}
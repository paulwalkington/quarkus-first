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
}
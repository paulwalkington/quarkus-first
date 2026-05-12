package org.acme.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@ApplicationScoped
public class LorryRepository implements PanacheRepositoryBase<LorryEntity, String> {

    public void addLorry(LorryEntity lorry) {
        persist(lorry);
    }

    public List<LorryEntity> getLorries() {
        return listAll();
    }

    public Optional<LorryEntity> getLorry(String id) {
        return findByIdOptional(id);
    }

    public boolean deleteLorry(String id) {
        return deleteById(id);
    }

    public Optional<LorryEntity> updateLorry(String id, String make, String model, int year, String colour, int mileage) {
        return findByIdOptional(id).map(entity -> {
            entity.setMake(make);
            entity.setModel(model);
            entity.setYear(year);
            entity.setColour(colour);
            entity.setMileage(mileage);
            return entity;
        });
    }

    public List<LorryEntity> searchLorries(String make, String model, Integer year, String colour, Integer maxMileage) {
        List<String> conditions = new ArrayList<>();
        Map<String, Object> params = new HashMap<>();

        if (make != null && !make.isBlank()) {
            conditions.add("lower(make) LIKE lower(:make)");
            params.put("make", "%" + make + "%");
        }
        if (model != null && !model.isBlank()) {
            conditions.add("lower(model) LIKE lower(:model)");
            params.put("model", "%" + model + "%");
        }
        if (year != null) {
            conditions.add("year = :year");
            params.put("year", year);
        }
        if (colour != null && !colour.isBlank()) {
            conditions.add("lower(colour) LIKE lower(:colour)");
            params.put("colour", "%" + colour + "%");
        }
        if (maxMileage != null) {
            conditions.add("mileage <= :maxMileage");
            params.put("maxMileage", maxMileage);
        }

        if (conditions.isEmpty()) {
            return listAll();
        }
        return list(String.join(" AND ", conditions), params);
    }
}
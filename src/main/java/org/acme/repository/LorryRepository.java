package org.acme.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
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
}
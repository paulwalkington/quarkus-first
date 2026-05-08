package org.acme.repository;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.*;

import org.acme.domain.Lorry;

@ApplicationScoped
public class LorryRepository {

    private final Map<String, Lorry> lorries;

    public LorryRepository() {
        lorries = new HashMap<>();
    }

    public void addLorry(Lorry lorry) {
        lorries.put(lorry.id(), lorry);
    }

    public List<Lorry> getLorries() {
        return new ArrayList<>(lorries.values());
    }

    public Optional<Lorry> getLorry(String id) {
        return Optional.ofNullable(lorries.get(id));
    }
}

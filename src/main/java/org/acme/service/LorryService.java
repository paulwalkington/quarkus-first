package org.acme.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.acme.domain.Lorry;
import org.acme.repository.LorryRepository;
import org.acme.resource.request.LorryRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class LorryService {

    @Inject
    public LorryRepository lorryRepository;

    public Lorry addLorry(LorryRequest lorryRequest) {
        Lorry lorry = new Lorry(
                UUID.randomUUID().toString(),
                lorryRequest.make(),
                lorryRequest.model());

        lorryRepository.addLorry(lorry);
        return lorry;
    }

    public Optional<Lorry> getLorry(String id) {
        return lorryRepository.getLorry(id);
    }

    public List<Lorry> getLorries() {
        return lorryRepository.getLorries();
    }
}

package org.acme.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.acme.domain.Lorry;
import org.acme.repository.LorryEntity;
import org.acme.repository.LorryRepository;
import org.acme.resource.request.LorryRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class LorryService {

    @Inject
    public LorryRepository lorryRepository;

    @Transactional
    public Lorry addLorry(LorryRequest lorryRequest) {
        Lorry lorry = new Lorry(
                UUID.randomUUID().toString(),
                lorryRequest.make(),
                lorryRequest.model(),
                lorryRequest.year(),
                lorryRequest.colour(),
                lorryRequest.mileage());

        lorryRepository.addLorry(LorryEntity.fromDomain(lorry));
        return lorry;
    }

    public Optional<Lorry> getLorry(String id) {
        return lorryRepository.getLorry(id).map(LorryEntity::toDomain);
    }

    public List<Lorry> getLorries() {
        return lorryRepository.getLorries().stream().map(LorryEntity::toDomain).toList();
    }

    @Transactional
    public boolean deleteLorry(String id) {
        return lorryRepository.deleteLorry(id);
    }

    @Transactional
    public Optional<Lorry> updateLorry(String id, LorryRequest lorryRequest) {
        return lorryRepository.updateLorry(id, lorryRequest.make(), lorryRequest.model(), lorryRequest.year(), lorryRequest.colour(), lorryRequest.mileage())
                .map(LorryEntity::toDomain);
    }
}
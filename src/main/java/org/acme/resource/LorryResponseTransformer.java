package org.acme.resource;

import jakarta.enterprise.context.ApplicationScoped;

import org.acme.domain.Lorry;
import org.acme.resource.response.LorryResponse;

@ApplicationScoped
public class LorryResponseTransformer {

    public LorryResponse toLorryResponse(Lorry lorry) {
        return new LorryResponse(
                lorry.id(),
                lorry.make(),
                lorry.model(),
                lorry.year(),
                lorry.colour(),
                lorry.mileage());
    }
}
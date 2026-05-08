package org.acme.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;

import org.acme.domain.Lorry;
import org.acme.resource.request.LorryRequest;
import org.acme.resource.response.LorryResponse;
import org.acme.service.LorryService;
import org.jboss.resteasy.reactive.RestResponse;

import java.util.List;
import java.util.Optional;

@Path("/lorries")
public class LorryResource {

    @Inject
    LorryService service;

    @POST
    public LorryResponse createLorry(LorryRequest lorryRequest) {
        Lorry lorry = service.addLorry(lorryRequest);
        return transformToLorryResponse(lorry);
    }

    @GET
    @Path("/{id}")
    public RestResponse<LorryResponse> getLorry(@PathParam("id") String id) {
        Optional<Lorry> lorry = service.getLorry(id);

        if (lorry.isEmpty()) {
            return RestResponse.notFound();
        }

        return RestResponse.ok(transformToLorryResponse(lorry.get()));
    }

    @GET
    public List<LorryResponse> getLorries() {
        List<Lorry> lorries = service.getLorries();
        return lorries.stream().map(this::transformToLorryResponse).toList();
    }

    private LorryResponse transformToLorryResponse(Lorry lorry) {
        return new LorryResponse(
                lorry.id(),
                lorry.make(),
                lorry.model());
    }
}

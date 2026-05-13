package org.acme.resource;

import jakarta.annotation.security.RolesAllowed;
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

    @Inject
    LorryResponseTransformer transformer;

    @POST
    @RolesAllowed("admin")
    public LorryResponse createLorry(LorryRequest lorryRequest) {
        Lorry lorry = service.addLorry(lorryRequest);
        return transformer.toLorryResponse(lorry);
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "user"})
    public RestResponse<LorryResponse> getLorry(@PathParam("id") String id) {
        Optional<Lorry> lorry = service.getLorry(id);

        if (lorry.isEmpty()) {
            return RestResponse.notFound();
        }

        return RestResponse.ok(transformer.toLorryResponse(lorry.get()));
    }

    @GET
    @RolesAllowed({"admin", "user"})
    public List<LorryResponse> getLorries() {
        List<Lorry> lorries = service.getLorries();
        return lorries.stream().map(transformer::toLorryResponse).toList();
    }

    @GET
    @Path("/search")
    @RolesAllowed({"admin", "user"})
    public List<LorryResponse> searchLorries(
            @QueryParam("make") String make,
            @QueryParam("model") String model,
            @QueryParam("year") Integer year,
            @QueryParam("colour") String colour,
            @QueryParam("maxMileage") Integer maxMileage) {
        return service.searchLorries(make, model, year, colour, maxMileage)
                .stream().map(transformer::toLorryResponse).toList();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("admin")
    public RestResponse<LorryResponse> updateLorry(@PathParam("id") String id, LorryRequest lorryRequest) {
        Optional<Lorry> lorry = service.updateLorry(id, lorryRequest);

        if (lorry.isEmpty()) {
            return RestResponse.notFound();
        }

        return RestResponse.ok(transformer.toLorryResponse(lorry.get()));
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("admin")
    public RestResponse<Void> deleteLorry(@PathParam("id") String id) {
        if (!service.deleteLorry(id)) {
            return RestResponse.notFound();
        }
        return RestResponse.noContent();
    }
}
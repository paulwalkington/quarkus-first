package org.acme.resource;

import org.acme.domain.Lorry;
import org.acme.resource.request.LorryRequest;
import org.acme.resource.response.LorryResponse;
import org.acme.service.LorryService;
import org.jboss.resteasy.reactive.RestResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.acme.resource.LorryRequestTestData.aLorryRequest;
import static org.acme.resource.LorryResponseTestData.aLorryResponse;
import static org.acme.resource.LorryTestData.aLorry;
import static org.acme.resource.RandomTestData.aMileage;
import static org.acme.resource.RandomTestData.aString;
import static org.acme.resource.RandomTestData.aYear;
import static org.acme.resource.RandomTestData.anId;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LorryResourceTest {

    @Mock
    LorryService service;

    @Mock
    LorryResponseTransformer transformer;

    @InjectMocks
    LorryResource lorryResource;

    // createLorry

    @Test
    void createLorry_callsServiceWithRequest() {
        LorryRequest request = aLorryRequest();
        when(service.addLorry(request)).thenReturn(aLorry());

        lorryResource.createLorry(request);

        verify(service).addLorry(request);
    }

    @Test
    void createLorry_callsTransformerWithLorryReturnedByService() {
        LorryRequest request = aLorryRequest();
        Lorry lorry = aLorry();
        when(service.addLorry(request)).thenReturn(lorry);

        lorryResource.createLorry(request);

        verify(transformer).toLorryResponse(lorry);
    }

    @Test
    void createLorry_returnsTransformerResult() {
        LorryRequest request = aLorryRequest();
        Lorry lorry = aLorry();
        LorryResponse response = aLorryResponse();
        when(service.addLorry(request)).thenReturn(lorry);
        when(transformer.toLorryResponse(lorry)).thenReturn(response);

        LorryResponse result = lorryResource.createLorry(request);

        assertThat(result, is(response));
    }

    // getLorry - lorry found

    @Test
    void getLorry_whenLorryExists_callsServiceWithId() {
        Lorry lorry = aLorry();
        when(service.getLorry(lorry.id())).thenReturn(Optional.of(lorry));

        lorryResource.getLorry(lorry.id());

        verify(service).getLorry(lorry.id());
    }

    @Test
    void getLorry_whenLorryExists_callsTransformerWithLorry() {
        Lorry lorry = aLorry();
        when(service.getLorry(lorry.id())).thenReturn(Optional.of(lorry));

        lorryResource.getLorry(lorry.id());

        verify(transformer).toLorryResponse(lorry);
    }

    @Test
    void getLorry_whenLorryExists_returnsOkStatus() {
        Lorry lorry = aLorry();
        when(service.getLorry(lorry.id())).thenReturn(Optional.of(lorry));
        when(transformer.toLorryResponse(lorry)).thenReturn(aLorryResponse());

        RestResponse<LorryResponse> result = lorryResource.getLorry(lorry.id());

        assertThat(result.getStatus(), is(200));
    }

    @Test
    void getLorry_whenLorryExists_returnsTransformedLorryAsEntity() {
        Lorry lorry = aLorry();
        LorryResponse response = aLorryResponse();
        when(service.getLorry(lorry.id())).thenReturn(Optional.of(lorry));
        when(transformer.toLorryResponse(lorry)).thenReturn(response);

        RestResponse<LorryResponse> result = lorryResource.getLorry(lorry.id());

        assertThat(result.getEntity(), is(response));
    }

    // getLorry - lorry not found

    @Test
    void getLorry_whenLorryNotFound_callsServiceWithId() {
        String id = anId();
        when(service.getLorry(id)).thenReturn(Optional.empty());

        lorryResource.getLorry(id);

        verify(service).getLorry(id);
    }

    @Test
    void getLorry_whenLorryNotFound_doesNotCallTransformer() {
        String id = anId();
        when(service.getLorry(id)).thenReturn(Optional.empty());

        lorryResource.getLorry(id);

        verifyNoInteractions(transformer);
    }

    @Test
    void getLorry_whenLorryNotFound_returnsNotFoundStatus() {
        String id = anId();
        when(service.getLorry(id)).thenReturn(Optional.empty());

        RestResponse<LorryResponse> result = lorryResource.getLorry(id);

        assertThat(result.getStatus(), is(404));
    }

    // getLorries - lorries exist

    @Test
    void getLorries_callsService() {
        when(service.getLorries()).thenReturn(List.of());

        lorryResource.getLorries();

        verify(service).getLorries();
    }

    @Test
    void getLorries_callsTransformerForEachLorry() {
        Lorry lorry1 = aLorry();
        Lorry lorry2 = aLorry();
        when(service.getLorries()).thenReturn(List.of(lorry1, lorry2));

        lorryResource.getLorries();

        verify(transformer).toLorryResponse(lorry1);
        verify(transformer).toLorryResponse(lorry2);
    }

    @Test
    void getLorries_returnsAllTransformedLorries() {
        Lorry lorry1 = aLorry();
        Lorry lorry2 = aLorry();
        LorryResponse response1 = aLorryResponse();
        LorryResponse response2 = aLorryResponse();
        when(service.getLorries()).thenReturn(List.of(lorry1, lorry2));
        when(transformer.toLorryResponse(lorry1)).thenReturn(response1);
        when(transformer.toLorryResponse(lorry2)).thenReturn(response2);

        List<LorryResponse> result = lorryResource.getLorries();

        assertThat(result, contains(response1, response2));
    }

    // getLorries - no lorries

    @Test
    void getLorries_whenNoLorries_doesNotCallTransformer() {
        when(service.getLorries()).thenReturn(List.of());

        lorryResource.getLorries();

        verifyNoInteractions(transformer);
    }

    @Test
    void getLorries_whenNoLorries_returnsEmptyList() {
        when(service.getLorries()).thenReturn(List.of());

        List<LorryResponse> result = lorryResource.getLorries();

        assertThat(result, is(empty()));
    }

    // searchLorries

    @Test
    void searchLorries_callsServiceWithAllParams() {
        LorryRequest request = aLorryRequest();
        String make = request.make(), model = request.model(), colour = request.colour();
        int year = request.year(), mileage = request.mileage();
        when(service.searchLorries(make, model, year, colour, mileage)).thenReturn(List.of());

        lorryResource.searchLorries(make, model, year, colour, mileage);

        verify(service).searchLorries(make, model, year, colour, mileage);
    }

    @Test
    void searchLorries_callsTransformerForEachResult() {
        String make = aString(), model = aString(), colour = aString();
        int year = aYear(), mileage = aMileage();
        Lorry lorry1 = aLorry();
        Lorry lorry2 = aLorry();
        when(service.searchLorries(make, model, year, colour, mileage)).thenReturn(List.of(lorry1, lorry2));

        lorryResource.searchLorries(make, model, year, colour, mileage);

        verify(transformer).toLorryResponse(lorry1);
        verify(transformer).toLorryResponse(lorry2);
    }

    @Test
    void searchLorries_returnsTransformedResults() {
        String make = aString(), model = aString(), colour = aString();
        int year = aYear(), mileage = aMileage();
        Lorry lorry1 = aLorry();
        Lorry lorry2 = aLorry();
        LorryResponse response1 = aLorryResponse();
        LorryResponse response2 = aLorryResponse();
        when(service.searchLorries(make, model, year, colour, mileage)).thenReturn(List.of(lorry1, lorry2));
        when(transformer.toLorryResponse(lorry1)).thenReturn(response1);
        when(transformer.toLorryResponse(lorry2)).thenReturn(response2);

        List<LorryResponse> result = lorryResource.searchLorries(make, model, year, colour, mileage);

        assertThat(result, contains(response1, response2));
    }

    // updateLorry - lorry found

    @Test
    void updateLorry_whenLorryExists_callsServiceWithIdAndRequest() {
        String id = anId();
        LorryRequest request = aLorryRequest();
        when(service.updateLorry(id, request)).thenReturn(Optional.of(aLorry()));

        lorryResource.updateLorry(id, request);

        verify(service).updateLorry(id, request);
    }

    @Test
    void updateLorry_whenLorryExists_callsTransformerWithLorry() {
        String id = anId();
        LorryRequest request = aLorryRequest();
        Lorry lorry = aLorry();
        when(service.updateLorry(id, request)).thenReturn(Optional.of(lorry));

        lorryResource.updateLorry(id, request);

        verify(transformer).toLorryResponse(lorry);
    }

    @Test
    void updateLorry_whenLorryExists_returnsOkStatus() {
        String id = anId();
        LorryRequest request = aLorryRequest();
        Lorry lorry = aLorry();
        when(service.updateLorry(id, request)).thenReturn(Optional.of(lorry));
        when(transformer.toLorryResponse(lorry)).thenReturn(aLorryResponse());

        RestResponse<LorryResponse> result = lorryResource.updateLorry(id, request);

        assertThat(result.getStatus(), is(200));
    }

    @Test
    void updateLorry_whenLorryExists_returnsTransformedLorryAsEntity() {
        String id = anId();
        LorryRequest request = aLorryRequest();
        Lorry lorry = aLorry();
        LorryResponse response = aLorryResponse();
        when(service.updateLorry(id, request)).thenReturn(Optional.of(lorry));
        when(transformer.toLorryResponse(lorry)).thenReturn(response);

        RestResponse<LorryResponse> result = lorryResource.updateLorry(id, request);

        assertThat(result.getEntity(), is(response));
    }

    // updateLorry - lorry not found

    @Test
    void updateLorry_whenLorryNotFound_callsServiceWithIdAndRequest() {
        String id = anId();
        LorryRequest request = aLorryRequest();
        when(service.updateLorry(id, request)).thenReturn(Optional.empty());

        lorryResource.updateLorry(id, request);

        verify(service).updateLorry(id, request);
    }

    @Test
    void updateLorry_whenLorryNotFound_doesNotCallTransformer() {
        String id = anId();
        LorryRequest request = aLorryRequest();
        when(service.updateLorry(id, request)).thenReturn(Optional.empty());

        lorryResource.updateLorry(id, request);

        verifyNoInteractions(transformer);
    }

    @Test
    void updateLorry_whenLorryNotFound_returnsNotFoundStatus() {
        String id = anId();
        LorryRequest request = aLorryRequest();
        when(service.updateLorry(id, request)).thenReturn(Optional.empty());

        RestResponse<LorryResponse> result = lorryResource.updateLorry(id, request);

        assertThat(result.getStatus(), is(404));
    }

    // deleteLorry - lorry found

    @Test
    void deleteLorry_whenLorryExists_callsServiceWithId() {
        String id = anId();
        when(service.deleteLorry(id)).thenReturn(true);

        lorryResource.deleteLorry(id);

        verify(service).deleteLorry(id);
    }

    @Test
    void deleteLorry_whenLorryExists_doesNotCallTransformer() {
        String id = anId();
        when(service.deleteLorry(id)).thenReturn(true);

        lorryResource.deleteLorry(id);

        verifyNoInteractions(transformer);
    }

    @Test
    void deleteLorry_whenLorryExists_returnsNoContentStatus() {
        String id = anId();
        when(service.deleteLorry(id)).thenReturn(true);

        RestResponse<Void> result = lorryResource.deleteLorry(id);

        assertThat(result.getStatus(), is(204));
    }

    // deleteLorry - lorry not found

    @Test
    void deleteLorry_whenLorryNotFound_callsServiceWithId() {
        String id = anId();
        when(service.deleteLorry(id)).thenReturn(false);

        lorryResource.deleteLorry(id);

        verify(service).deleteLorry(id);
    }

    @Test
    void deleteLorry_whenLorryNotFound_doesNotCallTransformer() {
        String id = anId();
        when(service.deleteLorry(id)).thenReturn(false);

        lorryResource.deleteLorry(id);

        verifyNoInteractions(transformer);
    }

    @Test
    void deleteLorry_whenLorryNotFound_returnsNotFoundStatus() {
        String id = anId();
        when(service.deleteLorry(id)).thenReturn(false);

        RestResponse<Void> result = lorryResource.deleteLorry(id);

        assertThat(result.getStatus(), is(404));
    }
}
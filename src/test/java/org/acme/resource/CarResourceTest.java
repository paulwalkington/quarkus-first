package org.acme.resource;

import org.acme.domain.Car;
import org.acme.resource.request.CarRequest;
import org.acme.resource.response.CarResponse;
import org.acme.service.CarService;
import org.jboss.resteasy.reactive.RestResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.acme.resource.CarRequestTestData.aCarRequest;
import static org.acme.resource.CarResponseTestData.aCarResponse;
import static org.acme.resource.CarTestData.aCar;
import static org.acme.resource.RandomTestData.aMileage;
import static org.acme.resource.RandomTestData.aString;
import static org.acme.resource.RandomTestData.aYear;
import static org.acme.resource.RandomTestData.anId;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CarResourceTest {

    @Mock
    CarService service;

    @Mock
    CarResponseTransformer transformer;

    @InjectMocks
    CarResource carResource;

    // createCar

    @Test
    void createCar_callsServiceWithRequest() {
        CarRequest request = aCarRequest();
        when(service.addCar(request)).thenReturn(aCar());

        carResource.createCar(request);

        verify(service).addCar(request);
    }

    @Test
    void createCar_callsTransformerWithCarReturnedByService() {
        CarRequest request = aCarRequest();
        Car car = aCar();
        when(service.addCar(request)).thenReturn(car);

        carResource.createCar(request);

        verify(transformer).toCarResponse(car);
    }

    @Test
    void createCar_returnsTransformerResult() {
        CarRequest request = aCarRequest();
        Car car = aCar();
        CarResponse response = aCarResponse();
        when(service.addCar(request)).thenReturn(car);
        when(transformer.toCarResponse(car)).thenReturn(response);

        CarResponse result = carResource.createCar(request);

        assertThat(result, is(response));
    }

    // getCar - car found

    @Test
    void getCar_whenCarExists_callsServiceWithId() {
        Car car = aCar();
        when(service.getCar(car.id())).thenReturn(Optional.of(car));

        carResource.getCar(car.id());

        verify(service).getCar(car.id());
    }

    @Test
    void getCar_whenCarExists_callsTransformerWithCar() {
        Car car = aCar();
        when(service.getCar(car.id())).thenReturn(Optional.of(car));

        carResource.getCar(car.id());

        verify(transformer).toCarResponse(car);
    }

    @Test
    void getCar_whenCarExists_returnsOkStatus() {
        Car car = aCar();
        when(service.getCar(car.id())).thenReturn(Optional.of(car));
        when(transformer.toCarResponse(car)).thenReturn(aCarResponse());

        RestResponse<CarResponse> result = carResource.getCar(car.id());

        assertThat(result.getStatus(), is(200));
    }

    @Test
    void getCar_whenCarExists_returnsTransformedCarAsEntity() {
        Car car = aCar();
        CarResponse response = aCarResponse();
        when(service.getCar(car.id())).thenReturn(Optional.of(car));
        when(transformer.toCarResponse(car)).thenReturn(response);

        RestResponse<CarResponse> result = carResource.getCar(car.id());

        assertThat(result.getEntity(), is(response));
    }

    // getCar - car not found

    @Test
    void getCar_whenCarNotFound_callsServiceWithId() {
        String id = anId();
        when(service.getCar(id)).thenReturn(Optional.empty());

        carResource.getCar(id);

        verify(service).getCar(id);
    }

    @Test
    void getCar_whenCarNotFound_doesNotCallTransformer() {
        String id = anId();
        when(service.getCar(id)).thenReturn(Optional.empty());

        carResource.getCar(id);

        verifyNoInteractions(transformer);
    }

    @Test
    void getCar_whenCarNotFound_returnsNotFoundStatus() {
        String id = anId();
        when(service.getCar(id)).thenReturn(Optional.empty());

        RestResponse<CarResponse> result = carResource.getCar(id);

        assertThat(result.getStatus(), is(404));
    }

    // getCars - cars exist

    @Test
    void getCars_callsService() {
        when(service.getCars()).thenReturn(List.of());

        carResource.getCars();

        verify(service).getCars();
    }

    @Test
    void getCars_callsTransformerForEachCar() {
        Car car1 = aCar();
        Car car2 = aCar();
        when(service.getCars()).thenReturn(List.of(car1, car2));

        carResource.getCars();

        verify(transformer).toCarResponse(car1);
        verify(transformer).toCarResponse(car2);
    }

    @Test
    void getCars_returnsAllTransformedCars() {
        Car car1 = aCar();
        Car car2 = aCar();
        CarResponse response1 = aCarResponse();
        CarResponse response2 = aCarResponse();
        when(service.getCars()).thenReturn(List.of(car1, car2));
        when(transformer.toCarResponse(car1)).thenReturn(response1);
        when(transformer.toCarResponse(car2)).thenReturn(response2);

        List<CarResponse> result = carResource.getCars();

        assertThat(result, containsInAnyOrder(response1, response2));
    }

    // getCars - no cars

    @Test
    void getCars_whenNoCars_doesNotCallTransformer() {
        when(service.getCars()).thenReturn(List.of());

        carResource.getCars();

        verifyNoInteractions(transformer);
    }

    @Test
    void getCars_whenNoCars_returnsEmptyList() {
        when(service.getCars()).thenReturn(List.of());

        List<CarResponse> result = carResource.getCars();

        assertThat(result, is(empty()));
    }

    // searchCars

    @Test
    void searchCars_callsServiceWithAllParams() {
        CarRequest request = aCarRequest();
        String make = request.make(), model = request.model(), colour = request.colour();
        int year = request.year(), mileage = request.mileage();
        when(service.searchCars(make, model, year, colour, mileage)).thenReturn(List.of());

        carResource.searchCars(make, model, year, colour, mileage);

        verify(service).searchCars(make, model, year, colour, mileage);
    }

    @Test
    void searchCars_callsTransformerForEachResult() {
        String make = aString(), model = aString(), colour = aString();
        int year = aYear(), mileage = aMileage();
        Car car1 = aCar();
        Car car2 = aCar();
        when(service.searchCars(make, model, year, colour, mileage)).thenReturn(List.of(car1, car2));

        carResource.searchCars(make, model, year, colour, mileage);

        verify(transformer).toCarResponse(car1);
        verify(transformer).toCarResponse(car2);
    }

    @Test
    void searchCars_returnsTransformedResults() {
        String make = aString(), model = aString(), colour = aString();
        int year = aYear(), mileage = aMileage();
        Car car1 = aCar();
        Car car2 = aCar();
        CarResponse response1 = aCarResponse();
        CarResponse response2 = aCarResponse();

        when(service.searchCars(make, model, year, colour, mileage)).thenReturn(List.of(car1, car2));
        when(transformer.toCarResponse(car1)).thenReturn(response1);
        when(transformer.toCarResponse(car2)).thenReturn(response2);

        List<CarResponse> result = carResource.searchCars(make, model, year, colour, mileage);

        assertThat(result, contains(response1, response2));
    }

    // updateCar - car found

    @Test
    void updateCar_whenCarExists_callsServiceWithIdAndRequest() {
        String id = anId();
        CarRequest request = aCarRequest();
        when(service.updateCar(id, request)).thenReturn(Optional.of(aCar()));

        carResource.updateCar(id, request);

        verify(service).updateCar(id, request);
    }

    @Test
    void updateCar_whenCarExists_callsTransformerWithCar() {
        String id = anId();
        CarRequest request = aCarRequest();
        Car car = aCar();
        when(service.updateCar(id, request)).thenReturn(Optional.of(car));

        carResource.updateCar(id, request);

        verify(transformer).toCarResponse(car);
    }

    @Test
    void updateCar_whenCarExists_returnsOkStatus() {
        String id = anId();
        CarRequest request = aCarRequest();
        Car car = aCar();
        when(service.updateCar(id, request)).thenReturn(Optional.of(car));
        when(transformer.toCarResponse(car)).thenReturn(aCarResponse());

        RestResponse<CarResponse> result = carResource.updateCar(id, request);

        assertThat(result.getStatus(), is(200));
    }

    @Test
    void updateCar_whenCarExists_returnsTransformedCarAsEntity() {
        String id = anId();
        CarRequest request = aCarRequest();
        Car car = aCar();
        CarResponse response = aCarResponse();
        when(service.updateCar(id, request)).thenReturn(Optional.of(car));
        when(transformer.toCarResponse(car)).thenReturn(response);

        RestResponse<CarResponse> result = carResource.updateCar(id, request);

        assertThat(result.getEntity(), is(response));
    }

    // updateCar - car not found

    @Test
    void updateCar_whenCarNotFound_callsServiceWithIdAndRequest() {
        String id = anId();
        CarRequest request = aCarRequest();
        when(service.updateCar(id, request)).thenReturn(Optional.empty());

        carResource.updateCar(id, request);

        verify(service).updateCar(id, request);
    }

    @Test
    void updateCar_whenCarNotFound_doesNotCallTransformer() {
        String id = anId();
        CarRequest request = aCarRequest();
        when(service.updateCar(id, request)).thenReturn(Optional.empty());

        carResource.updateCar(id, request);

        verifyNoInteractions(transformer);
    }

    @Test
    void updateCar_whenCarNotFound_returnsNotFoundStatus() {
        String id = anId();
        CarRequest request = aCarRequest();
        when(service.updateCar(id, request)).thenReturn(Optional.empty());

        RestResponse<CarResponse> result = carResource.updateCar(id, request);

        assertThat(result.getStatus(), is(404));
    }

    // deleteCar - car found

    @Test
    void deleteCar_whenCarExists_callsServiceWithId() {
        String id = anId();
        when(service.deleteCar(id)).thenReturn(true);

        carResource.deleteCar(id);

        verify(service).deleteCar(id);
    }

    @Test
    void deleteCar_whenCarExists_returnsNoContentStatus() {
        String id = anId();
        when(service.deleteCar(id)).thenReturn(true);

        RestResponse<Void> result = carResource.deleteCar(id);

        assertThat(result.getStatus(), is(204));
    }

    // deleteCar - car not found

    @Test
    void deleteCar_whenCarNotFound_callsServiceWithId() {
        String id = anId();
        when(service.deleteCar(id)).thenReturn(false);

        carResource.deleteCar(id);

        verify(service).deleteCar(id);
    }

    @Test
    void deleteCar_whenCarNotFound_returnsNotFoundStatus() {
        String id = anId();
        when(service.deleteCar(id)).thenReturn(false);

        RestResponse<Void> result = carResource.deleteCar(id);

        assertThat(result.getStatus(), is(404));
    }
}
package org.acme.resource;

import org.acme.resource.response.CarResponse;

import static org.acme.resource.RandomTestData.aMileage;
import static org.acme.resource.RandomTestData.aString;
import static org.acme.resource.RandomTestData.aYear;
import static org.acme.resource.RandomTestData.anId;

class CarResponseTestData {

    static CarResponse aCarResponse() {
        return new CarResponse(anId(), aString(), aString(), aYear(), aString(), aMileage());
    }

    private CarResponseTestData() {
    }
}
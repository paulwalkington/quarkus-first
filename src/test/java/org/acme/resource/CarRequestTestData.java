package org.acme.resource;

import org.acme.resource.request.CarRequest;

import static org.acme.resource.RandomTestData.aMileage;
import static org.acme.resource.RandomTestData.aString;
import static org.acme.resource.RandomTestData.aYear;

class CarRequestTestData {

    static CarRequest aCarRequest() {
        return new CarRequest(aString(), aString(), aYear(), aString(), aMileage());
    }

    private CarRequestTestData() {
    }
}
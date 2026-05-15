package org.acme.resource;

import org.acme.domain.Car;

import static org.acme.resource.RandomTestData.aMileage;
import static org.acme.resource.RandomTestData.aString;
import static org.acme.resource.RandomTestData.aYear;
import static org.acme.resource.RandomTestData.anId;

class CarTestData {

    static Car aCar() {
        return new Car(anId(), aString(), aString(), aYear(), aString(), aMileage());
    }

    private CarTestData() {
    }
}
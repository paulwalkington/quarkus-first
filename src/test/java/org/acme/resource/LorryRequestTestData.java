package org.acme.resource;

import org.acme.resource.request.LorryRequest;

import static org.acme.resource.RandomTestData.aMileage;
import static org.acme.resource.RandomTestData.aString;
import static org.acme.resource.RandomTestData.aYear;

class LorryRequestTestData {

    static LorryRequest aLorryRequest() {
        return new LorryRequest(aString(), aString(), aYear(), aString(), aMileage());
    }

    private LorryRequestTestData() {
    }
}
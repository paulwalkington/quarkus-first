package org.acme.resource;

import org.acme.resource.response.LorryResponse;

import static org.acme.resource.RandomTestData.aMileage;
import static org.acme.resource.RandomTestData.aString;
import static org.acme.resource.RandomTestData.aYear;
import static org.acme.resource.RandomTestData.anId;

class LorryResponseTestData {

    static LorryResponse aLorryResponse() {
        return new LorryResponse(anId(), aString(), aString(), aYear(), aString(), aMileage());
    }

    private LorryResponseTestData() {
    }
}
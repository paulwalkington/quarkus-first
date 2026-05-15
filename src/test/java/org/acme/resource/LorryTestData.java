package org.acme.resource;

import org.acme.domain.Lorry;

import static org.acme.resource.RandomTestData.aMileage;
import static org.acme.resource.RandomTestData.aString;
import static org.acme.resource.RandomTestData.aYear;
import static org.acme.resource.RandomTestData.anId;

class LorryTestData {

    static Lorry aLorry() {
        return new Lorry(anId(), aString(), aString(), aYear(), aString(), aMileage());
    }

    private LorryTestData() {
    }
}
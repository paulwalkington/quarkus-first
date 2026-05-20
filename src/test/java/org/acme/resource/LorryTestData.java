package org.acme.resource;

import org.acme.domain.Lorry;

import static org.acme.resource.RandomTestData.aMileage;
import static org.acme.resource.RandomTestData.aString;
import static org.acme.resource.RandomTestData.aYear;
import static org.acme.resource.RandomTestData.anId;

public class LorryTestData {

    public static Lorry aLorry() {
        return new Lorry(anId(), aString(), aString(), aYear(), aString(), aMileage());
    }

    private LorryTestData() {
    }
}
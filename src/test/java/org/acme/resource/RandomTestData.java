package org.acme.resource;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

public class RandomTestData {

    static String aString() {
        return UUID.randomUUID().toString();
    }

    public static String anId() {
        return aString();
    }

    static int aYear() {
        return ThreadLocalRandom.current().nextInt(1990, 2026);
    }

    static int aMileage() {
        return ThreadLocalRandom.current().nextInt(0, 200_001);
    }

    private RandomTestData() {
    }
}
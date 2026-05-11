package org.acme.resource.response;

public record CarResponse(
                String id, String make, String model, int year, String colour, int mileage) {
}

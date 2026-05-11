package org.acme.resource.request;

public record CarRequest(
                String make, String model, int year, String colour, int mileage) {
}

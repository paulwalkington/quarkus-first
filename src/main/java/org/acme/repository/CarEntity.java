package org.acme.repository;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.acme.domain.Car;

@Entity
@Table(name = "cars")
public class CarEntity {

    @Id
    private String id;
    private String make;
    private String model;
    private int year;
    private String colour;
    private int mileage;

    protected CarEntity() {
    }

    public CarEntity(String id, String make, String model, int year, String colour, int mileage) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.year = year;
        this.colour = colour;
        this.mileage = mileage;
    }

    public static CarEntity fromDomain(Car car) {
        return new CarEntity(
                car.id(),
                car.make(),
                car.model(),
                car.year(),
                car.colour(),
                car.mileage());
    }

    public Car toDomain() {
        return new Car(id, make, model, year, colour, mileage);
    }

    public void setMake(String make) { this.make = make; }
    public void setModel(String model) { this.model = model; }
    public void setYear(int year) { this.year = year; }
    public void setColour(String colour) { this.colour = colour; }
    public void setMileage(int mileage) { this.mileage = mileage; }
}
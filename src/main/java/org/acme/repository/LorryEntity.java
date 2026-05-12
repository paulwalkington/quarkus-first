package org.acme.repository;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.acme.domain.Lorry;

@Entity
@Table(name = "lorries")
public class LorryEntity {

    @Id
    private String id;
    private String make;
    private String model;
    private int year;
    private String colour;
    private int mileage;

    protected LorryEntity() {
    }

    public LorryEntity(String id, String make, String model, int year, String colour, int mileage) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.year = year;
        this.colour = colour;
        this.mileage = mileage;
    }

    public static LorryEntity fromDomain(Lorry lorry) {
        return new LorryEntity(
                lorry.id(),
                lorry.make(),
                lorry.model(),
                lorry.year(),
                lorry.colour(),
                lorry.mileage());
    }

    public Lorry toDomain() {
        return new Lorry(id, make, model, year, colour, mileage);
    }

    public void setMake(String make) { this.make = make; }
    public void setModel(String model) { this.model = model; }
    public void setYear(int year) { this.year = year; }
    public void setColour(String colour) { this.colour = colour; }
    public void setMileage(int mileage) { this.mileage = mileage; }
}
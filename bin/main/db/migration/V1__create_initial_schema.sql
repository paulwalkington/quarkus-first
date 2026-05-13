CREATE TABLE IF NOT EXISTS cars (
    id      VARCHAR(255) NOT NULL,
    make    VARCHAR(255),
    model   VARCHAR(255),
    year    INTEGER,
    colour  VARCHAR(255),
    mileage INTEGER,
    CONSTRAINT pk_cars PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS lorries (
    id      VARCHAR(255) NOT NULL,
    make    VARCHAR(255),
    model   VARCHAR(255),
    year    INTEGER,
    colour  VARCHAR(255),
    mileage INTEGER,
    CONSTRAINT pk_lorries PRIMARY KEY (id)
);
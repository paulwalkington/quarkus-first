CREATE TABLE IF NOT EXISTS users (
    id       VARCHAR(36) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role     VARCHAR(50) NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_username UNIQUE (username)
);

-- Default credentials: admin / admin123  and  user / user123
INSERT INTO users (id, username, password, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'admin', '$2y$12$nYFkJ.ZCgv6gmoH9D77M8.0UMMD6FyH5b.8TINZ.oiiSmP9hO.bqC', 'admin'),
    ('550e8400-e29b-41d4-a716-446655440002', 'user',  '$2y$12$Q/Md01ubpJtNzJytri6de.fXGQ9Czh8xIYOwn/CuMjgCjlkPOfN2y', 'user');

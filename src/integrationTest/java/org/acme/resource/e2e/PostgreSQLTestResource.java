package org.acme.resource.e2e;

import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import org.testcontainers.containers.PostgreSQLContainer;

import java.util.Map;

public class PostgreSQLTestResource implements QuarkusTestResourceLifecycleManager {

    private static final PostgreSQLContainer<?> POSTGRES =
        new PostgreSQLContainer<>("postgres:16-alpine");

    @Override
    public Map<String, String> start() {
        POSTGRES.start();
        return Map.of(
            "quarkus.datasource.jdbc.url", POSTGRES.getJdbcUrl(),
            "quarkus.datasource.username", POSTGRES.getUsername(),
            "quarkus.datasource.password", POSTGRES.getPassword()
        );
    }

    @Override
    public void stop() {
        POSTGRES.stop();
    }
}

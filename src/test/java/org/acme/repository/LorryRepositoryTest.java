package org.acme.repository;

import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@QuarkusTest
class   LorryRepositoryTest {

    @Inject
    LorryRepository repository;

    @Test
    @TestTransaction
    void shouldAddAndReturnLorryById() {
        LorryEntity lorry = new LorryEntity("lorry-1", "Volvo", "FH16", 2020, "White", 120_000);

        repository.addLorry(lorry);

        Optional<LorryEntity> result = repository.getLorry("lorry-1");

        assertThat(result.isPresent(), is(true));
        assertThat(result.get(), is(lorry));
    }

    @Test
    @TestTransaction
    void shouldReturnEmptyWhenLorryDoesNotExist() {
        Optional<LorryEntity> result = repository.getLorry("missing-id-1");

        assertThat(result.isEmpty(), is(true));
    }

    @Test
    @TestTransaction
    void shouldReturnAllAddedLorries() {
        LorryEntity first = new LorryEntity("lorry-2", "Scania", "R500", 2021, "Red", 80_000);
        LorryEntity second = new LorryEntity("lorry-3", "DAF", "XF", 2019, "Blue", 150_000);

        repository.addLorry(first);
        repository.addLorry(second);

        List<LorryEntity> lorries = repository.getLorries();

        assertThat(lorries, hasItems(first, second));
    }
}
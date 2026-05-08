package org.acme.repository;

import org.acme.domain.Lorry;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class LorryRepositoryTest {

    @Test
    void shouldAddAndReturnLorryById() {
        LorryRepository repository = new LorryRepository();

        Lorry lorry = new Lorry("lorry-1", "Volvo", "FH16");

        repository.addLorry(lorry);

        Optional<Lorry> result = repository.getLorry("lorry-1");

        assertThat(result.isPresent(), is(true));
        assertThat(result.get(), is(lorry));
    }

    @Test
    void shouldReturnEmptyWhenLorryDoesNotExist() {
        LorryRepository repository = new LorryRepository();

        Optional<Lorry> result = repository.getLorry("missing-id-1");

        assertThat(result.isEmpty(), is(true));
    }

    @Test
    void shouldReturnAllAddedLorries() {
        LorryRepository repository = new LorryRepository();

        Lorry first = new Lorry("lorry-2", "Scania", "R500");
        Lorry second = new Lorry("lorry-3", "DAF", "XF");

        repository.addLorry(first);
        repository.addLorry(second);

        List<Lorry> lorries = repository.getLorries();

        assertThat(lorries, hasSize(2));
        assertThat(lorries, hasItems(first, second));
    }

    @Test
    void shouldOverwriteExistingLorryWithSameId() {
        LorryRepository repository = new LorryRepository();

        Lorry original = new Lorry("lorry-4", "Mercedes", "Actros");
        Lorry updated = new Lorry("lorry-4", "Mercedes", "Arocs");

        repository.addLorry(original);
        repository.addLorry(updated);

        Optional<Lorry> result = repository.getLorry("lorry-4");
        List<Lorry> lorries = repository.getLorries();

        assertThat(result.isPresent(), is(true));
        assertThat(result.get(), is(updated));
        assertThat(lorries.stream().filter(l -> l.id().equals("lorry-4")).count(), is(1L));
    }
}

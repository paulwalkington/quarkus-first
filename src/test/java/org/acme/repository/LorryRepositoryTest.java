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
class LorryRepositoryTest {

    @Inject
    LorryRepository repository;

    @Test
    @TestTransaction
    void shouldAddAndReturnLorryById() {
        repository.addLorry(new LorryEntity("lorry-1", "Volvo", "FH16", 2020, "White", 120_000));

        Optional<LorryEntity> result = repository.getLorry("lorry-1");

        assertThat(result.isPresent(), is(true));
        LorryEntity lorry = result.get();
        assertThat(lorry.toDomain().make(), is("Volvo"));
        assertThat(lorry.toDomain().model(), is("FH16"));
        assertThat(lorry.toDomain().year(), is(2020));
        assertThat(lorry.toDomain().colour(), is("White"));
        assertThat(lorry.toDomain().mileage(), is(120_000));
    }

    @Test
    @TestTransaction
    void shouldReturnEmptyWhenLorryDoesNotExist() {
        Optional<LorryEntity> result = repository.getLorry("missing-id");

        assertThat(result.isEmpty(), is(true));
    }

    @Test
    @TestTransaction
    void shouldReturnAllAddedLorries() {
        repository.addLorry(new LorryEntity("lorry-2", "Scania", "R500", 2021, "Red", 80_000));
        repository.addLorry(new LorryEntity("lorry-3", "DAF", "XF", 2019, "Blue", 150_000));

        List<String> ids = repository.getLorries().stream().map(e -> e.toDomain().id()).toList();

        assertThat(ids, hasItems("lorry-2", "lorry-3"));
    }

    @Test
    @TestTransaction
    void shouldDeleteLorryById() {
        repository.addLorry(new LorryEntity("lorry-4", "MAN", "TGX", 2022, "Grey", 50_000));

        boolean deleted = repository.deleteLorry("lorry-4");

        assertThat(deleted, is(true));
        assertThat(repository.getLorry("lorry-4").isEmpty(), is(true));
    }

    @Test
    @TestTransaction
    void shouldReturnFalseWhenDeletingNonExistentLorry() {
        assertThat(repository.deleteLorry("does-not-exist"), is(false));
    }

    @Test
    @TestTransaction
    void shouldUpdateLorryFields() {
        repository.addLorry(new LorryEntity("lorry-5", "Volvo", "FH12", 2018, "Black", 300_000));

        Optional<LorryEntity> result = repository.updateLorry("lorry-5", "Volvo", "FH16", 2018, "White", 310_000);

        assertThat(result.isPresent(), is(true));
        assertThat(result.get().toDomain().model(), is("FH16"));
        assertThat(result.get().toDomain().colour(), is("White"));
        assertThat(result.get().toDomain().mileage(), is(310_000));
    }

    @Test
    @TestTransaction
    void shouldReturnEmptyWhenUpdatingNonExistentLorry() {
        Optional<LorryEntity> result = repository.updateLorry("does-not-exist", "X", "Y", 2020, "Z", 0);

        assertThat(result.isEmpty(), is(true));
    }

    @Test
    @TestTransaction
    void searchByMakeReturnsMatchingLorries() {
        repository.addLorry(new LorryEntity("lorry-6", "Scania", "R450", 2020, "Red", 90_000));
        repository.addLorry(new LorryEntity("lorry-7", "DAF", "XF", 2020, "Blue", 90_000));

        List<String> ids = repository.searchLorries("Scania", null, null, null, null)
                .stream().map(e -> e.toDomain().id()).toList();

        assertThat(ids, hasItem("lorry-6"));
        assertThat(ids, not(hasItem("lorry-7")));
    }

    @Test
    @TestTransaction
    void searchByMaxMileageReturnsOnlyLorriesUnderThreshold() {
        repository.addLorry(new LorryEntity("lorry-8", "MAN", "TGX", 2021, "Grey", 50_000));
        repository.addLorry(new LorryEntity("lorry-9", "MAN", "TGS", 2021, "Grey", 200_000));

        List<String> ids = repository.searchLorries(null, null, null, null, 100_000)
                .stream().map(e -> e.toDomain().id()).toList();

        assertThat(ids, hasItem("lorry-8"));
        assertThat(ids, not(hasItem("lorry-9")));
    }

    @Test
    @TestTransaction
    void searchWithNoFiltersReturnsAllLorries() {
        repository.addLorry(new LorryEntity("lorry-10", "Iveco", "Stralis", 2022, "White", 40_000));

        List<String> ids = repository.searchLorries(null, null, null, null, null)
                .stream().map(e -> e.toDomain().id()).toList();

        assertThat(ids, hasItem("lorry-10"));
    }
}
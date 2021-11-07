/*
 * This file is part of Choonio.
 *
 * Choonio is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * Choonio is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for
 * more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Choonio.  If not, see <https://www.gnu.org/licenses/>.
 */

package uk.co.caprica.choonio.service.favourites;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import reactor.test.StepVerifier;
import reactor.test.publisher.TestPublisher;
import uk.co.caprica.choonio.api.model.favourites.Favourite;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.database.repositories.FavouritesRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;
import uk.co.caprica.choonio.service.clock.Clock;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FavouritesServiceTest {

    @Mock
    private Clock.Service clockService;

    @Mock
    private FavouritesRepository favouritesRepository;

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @Mock
    private ServerSentEventManager eventManager;

    @InjectMocks
    private FavouritesService favouritesService;

    @Test
    void itReturnsFavourites() {
        Favourite favourite1 = new Favourite("1", new ArtistId("Neon Nox"), Instant.parse("2021-10-14T12:34:56.789Z"));
        Favourite favourite2 = new Favourite("2", new ArtistId("Ray Gun Hero"), Instant.parse("2021-10-07T08:17:48.123Z"));

        TestPublisher<Favourite> publisher = TestPublisher.create();
        when(favouritesRepository.findAllByOrderByTimestampDesc()).thenReturn(publisher.flux());

        Flux<Favourite> source = favouritesService.getFavourites();
        StepVerifier.create(source)
            .then(() -> publisher.emit(favourite1, favourite2))
            .expectNext(favourite1, favourite2)
            .verifyComplete();
    }

    @Test
    void itAddsNewFavourite() {
        when(clockService.instant()).thenReturn(Instant.parse("2021-10-19T20:21:22.234Z"));
        when(mongoTemplate.findOne(any(Query.class), eq(Favourite.class))).thenReturn(Mono.empty());
        when(favouritesRepository.save(any())).thenReturn(Mono.empty());

        Mono<Void> source = favouritesService.addToFavourites(new ArtistId("Ray Gun Hero"));
        StepVerifier.create(source)
            .verifyComplete();

        verify(favouritesRepository).save(eq(new Favourite(null, new ArtistId("Ray Gun Hero"), Instant.parse("2021-10-19T20:21:22.234Z"))));
        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.FAVOURITES)));
    }

    @Test
    void itUpdatesExistingFavourite() {
        when(clockService.instant()).thenReturn(Instant.parse("2021-10-19T20:21:22.234Z"));
        when(mongoTemplate.findOne(any(Query.class), eq(Favourite.class)))
            .thenReturn(Mono.just(new Favourite(
                "1",
                new ArtistId("Ray Gun Hero"),
                Instant.parse("2021-10-18T12:34:56.789Z")
            )));
        when(favouritesRepository.save(any())).thenReturn(Mono.empty());

        Mono<Void> source = favouritesService.addToFavourites(new ArtistId("Ray Gun Hero"));
        StepVerifier.create(source)
            .verifyComplete();

        verify(favouritesRepository).save(eq(new Favourite("1", new ArtistId("Ray Gun Hero"), Instant.parse("2021-10-19T20:21:22.234Z"))));
        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.FAVOURITES)));
    }

    @Test
    void itRemovesFavourite() {
        when(favouritesRepository.deleteById(eq("1"))).thenReturn(Mono.create(MonoSink::success));

        Mono<Void> source = favouritesService.removeFavourite("1");
        StepVerifier.create(source)
            .verifyComplete();

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.FAVOURITES)));
    }

    @Test
    void itRemovesAllFavourites() {
        when(favouritesRepository.deleteAll()).thenReturn(Mono.empty());

        Mono<Void> source = favouritesService.removeAllFavourites();
        StepVerifier.create(source)
            .verifyComplete();

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.FAVOURITES)));
    }
}
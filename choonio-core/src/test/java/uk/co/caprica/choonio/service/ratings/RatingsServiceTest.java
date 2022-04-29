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
 *
 * Copyright 2021-2022 Caprica Software Limited
 */

package uk.co.caprica.choonio.service.ratings;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import reactor.test.StepVerifier;
import reactor.test.publisher.TestPublisher;
import uk.co.caprica.choonio.api.model.albums.RatingValue;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.ratings.Rating;
import uk.co.caprica.choonio.database.repositories.RatingsRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;
import uk.co.caprica.choonio.service.clock.Clock;

import java.time.Instant;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RatingsServiceTest {

    @Mock
    private Clock.Service clockService;

    @Mock
    private RatingsRepository ratingsRepository;

    @Mock
    private ServerSentEventManager eventManager;

    @InjectMocks
    private RatingsService ratingsService;

    @Test
    void itRatesTrack() {
        TrackId track1 = new TrackId("NINA", "Beyond Memory", "Beyond Memory (Original Mix)");

        when(clockService.instant()).thenReturn(Instant.parse("2021-10-22T18:20:13.123Z"));

        when(ratingsRepository.deleteByMediaId(eq(track1))).thenReturn(Mono.create(MonoSink::success));
        when(ratingsRepository.save(any())).thenReturn(Mono.create(MonoSink::success));

        Mono<Void> source = ratingsService.rateTrack(track1, RatingValue.THUMBS_UP.getPersistenceValue());
        StepVerifier.create(source)
            .verifyComplete();

        verify(ratingsRepository).deleteByMediaId(eq(track1));
        verify(ratingsRepository).save(eq(new Rating(null, track1, 1, Instant.parse("2021-10-22T18:20:13.123Z"))));

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.RATINGS)));
    }

    @Test
    void itRemovesTrackRating() {
        TrackId track1 = new TrackId("NINA", "Beyond Memory", "Beyond Memory (Original Mix)");

        when(ratingsRepository.deleteByMediaId(eq(track1))).thenReturn(Mono.create(MonoSink::success));

        Mono<Void> source = ratingsService.rateTrack(track1, RatingValue.NEUTRAL.getPersistenceValue());
        StepVerifier.create(source)
            .verifyComplete();

        verify(ratingsRepository).deleteByMediaId(eq(track1));
        verify(ratingsRepository, never()).save(any());

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.RATINGS)));
    }

    @Test
    void itReturnsAlbumRatings() {
        AlbumId albumId = new AlbumId("NINA", "Beyond Memory");

        TrackId track1 = new TrackId("NINA", "Beyond Memory", "Beyond Memory (Original Mix)");
        TrackId track2 = new TrackId("NINA", "Beyond Memory", "Purple Sun (Original Mix)");

        Rating rating1 = new Rating("1", track1, 1, Instant.parse("2021-10-14T12:34:56.789Z"));
        Rating rating2 = new Rating("2", track2, -1, Instant.parse("2021-10-07T08:17:48.123Z"));

        TestPublisher<Rating> publisher = TestPublisher.create();
        when(ratingsRepository.findAllByMediaIdAlbumArtistNameAndMediaIdAlbumName(eq("NINA"), eq("Beyond Memory"))).thenReturn(publisher.flux());

        Mono<Map<TrackId, Rating>> source = ratingsService.getAlbumRatings(albumId);
        StepVerifier.create(source)
            .then(() -> publisher.emit(rating1, rating2))
            .expectNextMatches(map ->
                map.get(track1).equals(rating1) &&
                map.get(track2).equals(rating2) &&
                map.size() == 2
            )
            .verifyComplete();
    }

    @Test
    void itReturnsThumbsUpRatings() {
        Rating rating1 = new Rating("1", new TrackId("NINA", "Beyond Memory", "Beyond Memory (Original Mix)"), 1, Instant.parse("2021-10-14T12:34:56.789Z"));
        Rating rating2 = new Rating("2", new TrackId("NINA", "Beyond Memory", "Purple Sun (Original Mix)"), 1, Instant.parse("2021-10-07T08:17:48.123Z"));

        TestPublisher<Rating> publisher = TestPublisher.create();
        when(ratingsRepository.findAllByValueOrderByTimestampDesc(RatingValue.THUMBS_UP.getPersistenceValue())).thenReturn(publisher.flux());

        Flux<Rating> source = ratingsService.getThumbsUpRatings();
        StepVerifier.create(source)
            .then(() -> publisher.emit(rating1, rating2))
            .expectNext(rating1, rating2)
            .verifyComplete();
    }

    @Test
    void itReturnsAllRatings() {
        Rating rating1 = new Rating("1", new TrackId("NINA", "Beyond Memory", "Beyond Memory (Original Mix)"), 1, Instant.parse("2021-10-14T12:34:56.789Z"));
        Rating rating2 = new Rating("2", new TrackId("NINA", "Beyond Memory", "Purple Sun (Original Mix)"), -1, Instant.parse("2021-10-07T08:17:48.123Z"));

        TestPublisher<Rating> publisher = TestPublisher.create();
        when(ratingsRepository.findAllByOrderByTimestampDesc()).thenReturn(publisher.flux());

        Flux<Rating> source = ratingsService.getAllRatings();
        StepVerifier.create(source)
            .then(() -> publisher.emit(rating1, rating2))
            .expectNext(rating1, rating2)
            .verifyComplete();
    }
}

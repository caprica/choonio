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

package uk.co.caprica.choonio.service.albums;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import reactor.test.publisher.TestPublisher;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.albums.RatingValue;
import uk.co.caprica.choonio.api.model.albums.TrackStats;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.plays.TrackListenStats;
import uk.co.caprica.choonio.api.model.ratings.Rating;
import uk.co.caprica.choonio.service.plays.Plays;
import uk.co.caprica.choonio.service.ratings.Ratings;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlbumEnrichmentTest {

    @Mock
    private Plays.Service playsService;

    @Mock
    private Ratings.Service ratingsService;

    @InjectMocks
    private AlbumEnrichment albumEnrichment;

    @Test
    void itEnrichesAlbum() {
        TrackId track1 = new TrackId("NINA", "Beyond Memory", "Beyond Memory (Original Mix)");
        TrackId track2 = new TrackId("NINA", "Beyond Memory", "Purple Sun (Original Mix)");

        Album album = new Album(
            "1",
            new AlbumId("NINA", "Beyond Memory"),
            2016,
            "Synthpop",
            List.of(
                new AlbumTrack(track1, 1, "NINA", 215, "Beyond Memory.mp3", null),
                new AlbumTrack(track2, 2, "NINA", 267, "Purple Sun.mp3", null)
            ),
            904,
            new int[] { 10, 20, 30 },
            Instant.parse("2021-10-14T12:34:56.789Z"),
            "/home/music/NINA/Beyond Memory"
        );

        Album expectedAlbum = new Album(
            "1",
            new AlbumId("NINA", "Beyond Memory"),
            2016,
            "Synthpop",
            List.of(
                new AlbumTrack(track1, 1, "NINA", 215, "Beyond Memory.mp3", new TrackStats(23, RatingValue.THUMBS_UP)),
                new AlbumTrack(track2, 2, "NINA", 267, "Purple Sun.mp3", new TrackStats(4, RatingValue.NEUTRAL))
            ),
            904,
            new int[] { 10, 20, 30 },
            Instant.parse("2021-10-14T12:34:56.789Z"),
            "/home/music/NINA/Beyond Memory"
        );

        Map<TrackId, TrackListenStats> listens = Map.of(
            track1, new TrackListenStats(track1, 23),
            track2, new TrackListenStats(track2, 4)
        );

        Map<TrackId, Rating> ratings = Map.of(
            track1, new Rating("201", track1, 1, Instant.parse("2021-09-24T11:21:31.401Z")),
            track2, new Rating("202", track2, 0, Instant.parse("2021-09-08T11:22:33.444Z"))
        );

        TestPublisher<Map<TrackId, TrackListenStats>> listensPublisher = TestPublisher.create();
        when(playsService.getAlbumListens(eq(new AlbumId("NINA", "Beyond Memory"))))
            .thenReturn(listensPublisher.mono());

        TestPublisher<Map<TrackId, Rating>> ratingsPublisher = TestPublisher.create();
        when(ratingsService.getAlbumRatings(eq(new AlbumId("NINA", "Beyond Memory"))))
            .thenReturn(ratingsPublisher.mono());

        Mono<Album> source = albumEnrichment.enrichAlbum(album);
        StepVerifier.create(source)
            .then(() -> listensPublisher.emit(listens))
            .then(() -> ratingsPublisher.emit(ratings))
            .expectNext(expectedAlbum)
            .verifyComplete();
    }
}
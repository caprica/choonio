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

package uk.co.caprica.choonio.service.playlists;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import reactor.test.publisher.TestPublisher;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.albums.RatingValue;
import uk.co.caprica.choonio.api.model.albums.TrackStats;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.playlists.PlaylistItem;
import uk.co.caprica.choonio.api.model.plays.TrackListenStats;
import uk.co.caprica.choonio.api.model.ratings.Rating;
import uk.co.caprica.choonio.service.albums.Albums;
import uk.co.caprica.choonio.service.plays.Plays;
import uk.co.caprica.choonio.service.ratings.RatingsService;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PlaylistEnrichmentTest {

    @Mock
    private Albums.Service albumService;

    @Mock
    private Plays.Service playsService;

    @Mock
    private RatingsService ratingsService;

    @InjectMocks
    private PlaylistEnrichment playlistEnrichment;

    @Test
    void itEnrichesPlaylist() {
        TrackId track1 = new TrackId("NINA", "Beyond Memory", "Beyond Memory (Original Mix)");
        TrackId track2 = new TrackId("NINA", "Beyond Memory", "Purple Sun (Original Mix)");

        AlbumTrack albumTrack1 = new AlbumTrack(track1, 1, "NINA", 215, "1.flac", null);
        AlbumTrack albumTrack2 = new AlbumTrack(track2, 2, "NINA", 267, "2.flac", null);

        Playlist playlist = new Playlist(
            "1",
            new PlaylistId("Only Synthwave"),
            "The best genre",
            List.of(
                new PlaylistItem("101", track1, null),
                new PlaylistItem("102", track2, null)
            ),
            482,
            Instant.parse("2021-10-14T12:34:56.789Z"),
            Instant.parse("2021-10-16T11:22:33.444Z")
        );

        Playlist expectedPlaylist = new Playlist(
            "1",
            new PlaylistId("Only Synthwave"),
            "The best genre",
            List.of(
                new PlaylistItem(
                    "101",
                    track1,
                    new AlbumTrack(
                        track1,
                        1,
                        "NINA",
                        215,
                        "1.flac",
                        new TrackStats(23, RatingValue.THUMBS_UP)
                    )
                ),
                new PlaylistItem(
                    "102",
                    track2,
                    new AlbumTrack(
                        track2,
                        2,
                        "NINA",
                        267,
                        "2.flac",
                        new TrackStats(4, RatingValue.NEUTRAL)
                    )
                )
            ),
            482,
            Instant.parse("2021-10-14T12:34:56.789Z"),
            Instant.parse("2021-10-16T11:22:33.444Z")
        );

        Map<TrackId, TrackListenStats> listens = Map.of(
            track1, new TrackListenStats(track1, 23),
            track2, new TrackListenStats(track2, 4)
        );

        Map<TrackId, Rating> ratings = Map.of(
            track1, new Rating("201", track1, 1, Instant.parse("2021-09-24T11:21:31.401Z")),
            track2, new Rating("202", track2, 0, Instant.parse("2021-09-08T11:22:33.444Z"))
        );

        when(albumService.getTracks(eq(new HashSet<>(playlist.trackIds())))).thenReturn(Flux.fromIterable(
            List.of(
                albumTrack1,
                albumTrack2
            )
        ));

        TestPublisher<Map<TrackId, TrackListenStats>> listensPublisher = TestPublisher.create();
        when(playsService.getPlaylistListens(eq(playlist)))
            .thenReturn(listensPublisher.mono());

        TestPublisher<Map<TrackId, Rating>> ratingsPublisher = TestPublisher.create();
        when(ratingsService.getPlaylistRatings(eq(playlist)))
            .thenReturn(ratingsPublisher.mono());

        Mono<Playlist> source = playlistEnrichment.enrichPlaylist(playlist);
        StepVerifier.create(source)
            .then(() -> listensPublisher.emit(listens))
            .then(() -> ratingsPublisher.emit(ratings))
            .expectNext(expectedPlaylist)
            .verifyComplete();
    }
}
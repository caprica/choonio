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

package uk.co.caprica.choonio.service.transfer;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.favourites.Favourite;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.plays.Play;
import uk.co.caprica.choonio.api.model.ratings.Rating;
import uk.co.caprica.choonio.api.model.recents.Recent;
import uk.co.caprica.choonio.api.model.transfer.DataExport;
import uk.co.caprica.choonio.service.clock.Clock;
import uk.co.caprica.choonio.service.favourites.Favourites;
import uk.co.caprica.choonio.service.playlists.Playlists;
import uk.co.caprica.choonio.service.plays.Plays;
import uk.co.caprica.choonio.service.ratings.Ratings;
import uk.co.caprica.choonio.service.recents.Recents;

import java.time.Instant;
import java.util.List;

import static java.util.Collections.emptyList;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExportServiceTest {

    @Mock
    private Clock.Service clockService;

    @Mock
    private Favourites.Service favouritesService;

    @Mock
    private Recents.Service recentsService;

    @Mock
    private Playlists.Service playlistsService;

    @Mock
    private Plays.Service playsService;

    @Mock
    private Ratings.Service ratingsService;

    @InjectMocks
    private ExportService exportService;

    @Test
    void itReturnsExportData() {
        Favourite favourite1 = new Favourite("11", new ArtistId("Neon Non"), Instant.parse("2021-10-18T10:00:00.000Z"));
        Favourite favourite2 = new Favourite("12", new AlbumId("DEADLIFE", "Dark Nation"), Instant.parse("2021-10-13T11:11:11.111Z"));

        Recent recent1 = new Recent("21", new AlbumId("Cassetter", "Entropy"), Instant.parse("2021-10-14T22:22:22.222Z"));

        Playlist playlist1 = new Playlist("31", new PlaylistId("Only Synthwave"), "The best genre", emptyList(), 1234, Instant.parse("2021-10-16T10:11:12.130Z"), Instant.parse("2021-10-16T10:15:01.333Z"));

        Play play1 = new Play("41", new TrackId("Perturbator", "I Am The Night", "Eclipse"), Instant.parse("2021-10-17T09:08:07.654Z"));

        Rating rating1 = new Rating("51", new TrackId("Fury Weekend", "Escape From Neon City", "Sleepless Nights"), 1, Instant.parse("2021-10-17T06:05:04.321Z"));

        DataExport dataExport = new DataExport(
            "1.0",
            List.of(
                favourite1,
                favourite2
            ),
            List.of(
                playlist1
            ),
            List.of(
                play1
            ),
            List.of(
                rating1
            ),
            List.of(
                recent1
            ),
            Instant.parse("2021-10-19T12:34:56.789Z")
        );

        when(clockService.instant()).thenReturn(Instant.parse("2021-10-19T12:34:56.789Z"));
        when(favouritesService.getFavourites()).thenReturn(Flux.just(favourite1, favourite2));
        when(recentsService.getAllRecents()).thenReturn(Flux.just(recent1));
        when(playlistsService.getPlaylists()).thenReturn(Flux.just(playlist1));
        when(playsService.getAllPlays()).thenReturn(Flux.just(play1));
        when(ratingsService.getAllRatings()).thenReturn(Flux.just(rating1));

        Mono<DataExport> source = exportService.exportData();
        StepVerifier.create(source)
            .expectNext(dataExport)
            .verifyComplete();
    }
}
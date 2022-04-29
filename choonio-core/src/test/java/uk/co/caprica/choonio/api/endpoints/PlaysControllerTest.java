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

package uk.co.caprica.choonio.api.endpoints;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.plays.AlbumListenStats;
import uk.co.caprica.choonio.api.model.plays.ArtistListenStats;
import uk.co.caprica.choonio.api.model.plays.TrackListenStats;
import uk.co.caprica.choonio.service.plays.Plays;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = PlaysController.class, properties = "spring.jackson.serialization.indent_output = true")
class PlaysControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Plays.Service playsService;

    @Test
    void itReturnsArtistListenStats() {
        String expected = readJsonResource(getClass(), "get-artist-listens.json");
        when(playsService.getTopArtistListens(eq(10))).thenReturn(Flux.fromIterable(List.of(
            new ArtistListenStats(new ArtistId("NINA"), 123),
            new ArtistListenStats(new ArtistId("Ray Gun Hero"), 87)
        )));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/plays/artists")
                .queryParam("limit", 10)
                .build()
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itReturnsArtistListenStatsInRange() {
        String expected = readJsonResource(getClass(), "get-artist-listens.json");
        when(playsService.getTopArtistListens(eq(LocalDate.parse("2021-10-15")), eq(LocalDate.parse("2021-10-21")), eq(10))).thenReturn(Flux.fromIterable(List.of(
            new ArtistListenStats(new ArtistId("NINA"), 123),
            new ArtistListenStats(new ArtistId("Ray Gun Hero"), 87)
        )));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/plays/artists")
                .queryParam("from", LocalDate.parse("2021-10-15"))
                .queryParam("to", LocalDate.parse("2021-10-21"))
                .queryParam("limit", 10)
                .build()
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itReturnsAlbumListenStats() {
        String expected = readJsonResource(getClass(), "get-album-listens.json");
        when(playsService.getTopAlbumListens(eq(10))).thenReturn(Flux.fromIterable(List.of(
            new AlbumListenStats(new AlbumId("NINA", "Sleepwalking"), 123),
            new AlbumListenStats(new AlbumId("Ray Gun Hero", "Plethora"), 87)
        )));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/plays/albums")
                .queryParam("limit", 10)
                .build()
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itReturnsAlbumListenStatsInRange() {
        String expected = readJsonResource(getClass(), "get-album-listens.json");
        when(playsService.getTopAlbumListens(eq(LocalDate.parse("2021-10-15")), eq(LocalDate.parse("2021-10-21")), eq(10))).thenReturn(Flux.fromIterable(List.of(
            new AlbumListenStats(new AlbumId("NINA", "Sleepwalking"), 123),
            new AlbumListenStats(new AlbumId("Ray Gun Hero", "Plethora"), 87)
        )));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/plays/albums")
                .queryParam("from", LocalDate.parse("2021-10-15"))
                .queryParam("to", LocalDate.parse("2021-10-21"))
                .queryParam("limit", 10)
                .build()
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itReturnsTrackListenStats() {
        String expected = readJsonResource(getClass(), "get-track-listens.json");
        when(playsService.getTopTrackListens(eq(10))).thenReturn(Flux.fromIterable(List.of(
            new TrackListenStats(new TrackId("NINA", "Sleepwalking", "Beyond Memory"), 123),
            new TrackListenStats(new TrackId("Ray Gun Hero", "Plethora", "I Didn't Know She Was An Android"), 87)
        )));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/plays/tracks")
                .queryParam("limit", 10)
                .build()
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itReturnsTrackListenStatsInRange() {
        String expected = readJsonResource(getClass(), "get-track-listens.json");
        when(playsService.getTopTrackListens(eq(LocalDate.parse("2021-10-15")), eq(LocalDate.parse("2021-10-21")), eq(10))).thenReturn(Flux.fromIterable(List.of(
            new TrackListenStats(new TrackId("NINA", "Sleepwalking", "Beyond Memory"), 123),
            new TrackListenStats(new TrackId("Ray Gun Hero", "Plethora", "I Didn't Know She Was An Android"), 87)
        )));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/plays/tracks")
                .queryParam("from", LocalDate.parse("2021-10-15"))
                .queryParam("to", LocalDate.parse("2021-10-21"))
                .queryParam("limit", 10)
                .build()
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }
}

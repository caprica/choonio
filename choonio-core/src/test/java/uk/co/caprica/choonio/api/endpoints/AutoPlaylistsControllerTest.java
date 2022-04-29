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
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.playlists.PlaylistItem;
import uk.co.caprica.choonio.database.model.values.PlaylistSummary;
import uk.co.caprica.choonio.service.autoplaylists.AutoPlaylists;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = AutoPlaylistsController.class, properties = "spring.jackson.serialization.indent_output = true")
class AutoPlaylistsControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private AutoPlaylists.Service autoPlaylistsService;

    @Test
    void whenGettingAutoPlaylistsThenJsonReturned() {
        String expected = readJsonResource(getClass(), "get-auto-playlists.json");
        when(autoPlaylistsService.getAutoPlaylists()).thenReturn(Flux.fromIterable(List.of(
            new Playlist(
                "1",
                new PlaylistId("Thumbs up"),
                "All tracks rated thumbs up",
                List.of(
                    new PlaylistItem(
                        "101",
                        new TrackId("Absolute Valentine", "Police Heartbreaker", "In the 42nd Street"),
                        null
                    )
                ),
                8916,
                Instant.parse("2021-09-01T05:05:05.555Z"),
                Instant.parse("2021-09-02T06:06:06.666Z")
            )
        )));
        webTestClient.get()
            .uri("/api/auto-playlists")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void whenGettingAutoPlaylistSummariesThenJsonReturned() {
        String expected = readJsonResource(getClass(), "get-auto-playlist-summaries.json");
        when(autoPlaylistsService.getAutoPlaylistSummaries()).thenReturn(Flux.fromIterable(List.of(
            new PlaylistSummary(
                "1",
                new PlaylistId("Thumbs up"),
                Instant.parse("2021-10-28T19:22:07.331Z"),
                Instant.parse("2021-10-28T19:22:07.982Z")
            )
        )));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/auto-playlists")
                .queryParam("format", "names")
                .build()
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void whenGettingAutoPlaylistThenJsonReturned() {
        String expected = readJsonResource(getClass(), "get-auto-playlist.json");
        when(autoPlaylistsService.getAutoPlaylist(eq("Thumbs up"))).thenReturn(Mono.just(
            new Playlist(
                "1",
                new PlaylistId("Thumbs up"),
                "All tracks rated thumbs up",
                List.of(
                    new PlaylistItem(
                        "101",
                        new TrackId("Absolute Valentine", "Police Heartbreaker", "In the 42nd Street"),
                        null
                    )
                ),
                8916,
                Instant.parse("2021-09-01T05:05:05.555Z"),
                Instant.parse("2021-09-02T06:06:06.666Z")
            )
        ));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/auto-playlists/{playlistId}")
                .build("Thumbs up")
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }
}

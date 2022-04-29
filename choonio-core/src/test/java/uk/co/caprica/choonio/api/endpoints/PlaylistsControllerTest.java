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
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.playlists.PlaylistItem;
import uk.co.caprica.choonio.api.model.request.AddToPlaylistRequest;
import uk.co.caprica.choonio.api.model.request.PlaylistRequestItem;
import uk.co.caprica.choonio.api.model.request.UpdatePlaylistRequest;
import uk.co.caprica.choonio.database.model.values.PlaylistSummary;
import uk.co.caprica.choonio.service.playlists.Playlists;
import uk.co.caprica.choonio.service.plays.Plays;
import uk.co.caprica.choonio.service.ratings.Ratings;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = PlaylistsController.class, properties = "spring.jackson.serialization.indent_output = true")
class PlaylistsControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Playlists.Service playlistsService;

    @MockBean
    private Plays.Service playsService;

    @MockBean
    private Ratings.Service ratingsService;

    @Test
    void itReturnsPlaylists() {
        String expected = readJsonResource(getClass(), "get-playlists.json");
        when(playlistsService.getPlaylists()).thenReturn(Flux.fromIterable(List.of(
            new Playlist(
                "1",
                new PlaylistId("Synthwave"),
                "The best genre",
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
            .uri("/api/playlists")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itReturnsPlaylistSummaries() {
        String expected = readJsonResource(getClass(), "get-playlist-summaries.json");
        when(playlistsService.getPlaylistSummaries()).thenReturn(Flux.fromIterable(List.of(
            new PlaylistSummary(
                "1",
                new PlaylistId("Synthwave"),
                Instant.parse("2021-09-01T05:05:05.555Z"),
                Instant.parse("2021-09-02T06:06:06.666Z")
            )
        )));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/playlists")
                .queryParam("format", "names")
                .build()
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itReturnsPlaylist() {
        String expected = readJsonResource(getClass(), "get-playlist.json");
        when(playlistsService.getPlaylist(eq("Synthwave"))).thenReturn(Mono.just(
            new Playlist(
                "1",
                new PlaylistId("Synthwave"),
                "The best genre",
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
            .uri(uriBuilder -> uriBuilder.path("/api/playlists/{playlistName}")
                .build("Synthwave")
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itUpdatesPlaylist() {
        UpdatePlaylistRequest request = new UpdatePlaylistRequest(
            List.of(
                new PlaylistRequestItem(new TrackId("Neon Nox", "Last Stand", "Recon")),
                new PlaylistRequestItem(new TrackId("Neon Nox", "Last Stand", "Rogue"))
            )
        );

        webTestClient.put()
            .uri(uriBuilder -> uriBuilder.path("/api/playlists/{playlistName}")
                .build("Synthwave")
            )
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk();

        verify(playlistsService).updatePlaylist(eq("Synthwave"), eq(request));
    }

    @Test
    void itRemovesPlaylist() {
        webTestClient.delete()
            .uri(uriBuilder -> uriBuilder.path("/api/playlists/{playlistName}")
                .build("Only Synthwave")
            )
            .exchange()
            .expectStatus().isOk();
        verify(playlistsService).deletePlaylist(eq("Only Synthwave"));
    }

    @Test
    void itAddsToPlaylist() {
        AddToPlaylistRequest request = new AddToPlaylistRequest(
            new AlbumId("Extra Terra", "Zion")
        );
        webTestClient.post()
            .uri(uriBuilder -> uriBuilder.path("/api/playlists/{playlistName}")
                .build("Only Synthwave")
            )
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(request),
                AddToPlaylistRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playlistsService).addToPlaylist(eq("Only Synthwave"), eq(new AlbumId("Extra Terra", "Zion")));
    }

    @Test
    void itRemovesFromPlaylist() {
        webTestClient.delete()
            .uri(uriBuilder -> uriBuilder.path("/api/playlists/{playlistName}/{playlistItemId}")
                .build(
                    "Only Synthwave",
                    "123"
                )
            )
            .exchange()
            .expectStatus().isOk();
        verify(playlistsService).removeFromPlaylist(eq("Only Synthwave"), eq("123"));
    }
}

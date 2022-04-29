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
import uk.co.caprica.choonio.api.model.art.ArtSize;
import uk.co.caprica.choonio.service.art.Art;

import java.nio.file.Path;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@WebFluxTest(controllers = ArtController.class)
class ArtControllerTest {

    private static final String ART_PATH = "src/test/resources/uk/co/caprica/choonio/api/endpoints/image";

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Art.Service artService;

    @Test
    void itReturnsArtistCover() {
        when(artService.getArtistArtPath(eq("Fury Weekend"))).thenReturn(Mono.just(Path.of(ART_PATH)));
        webTestClient
            .get()
            .uri(uriBuilder -> uriBuilder.path("/api/artists/{artist}/cover-{size}.jpg")
                .build(
                    "Fury Weekend",
                    ArtSize.MEDIUM
                )
            )
            .accept(MediaType.IMAGE_JPEG)
            .exchange()
            .expectStatus().isOk();
    }

    @Test
    void itReturnsAlbumCover() {
        when(artService.getAlbumArtPath(eq("Fury Weekend"), eq("Escape From Neon City"))).thenReturn(Mono.just(Path.of(ART_PATH)));
        webTestClient
            .get()
            .uri(uriBuilder -> uriBuilder.path("/api/albums/{artist}/{album}/cover-{size}.jpg")
                .build(
                    "Fury Weekend",
                    "Escape From Neon City",
                    ArtSize.MEDIUM
                )
            )
            .accept(MediaType.IMAGE_JPEG)
            .exchange()
            .expectStatus().isOk();
    }

    @Test
    void itReturnsPlaylistCover() {
        List<Path> artPaths = List.of(Path.of(ART_PATH));
        when(artService.getPlaylistArtPaths(eq("Synthwave"))).thenReturn(Flux.fromIterable(artPaths));
        when(artService.generateCompositeArt(any(), eq(ArtSize.MEDIUM))).thenReturn(Mono.just(new byte[] { 1, 2, 3 }));
        webTestClient
            .get()
            .uri(uriBuilder -> uriBuilder.path("/api/playlists/{playlistName}/cover-{size}.jpg")
                .build(
                    "Synthwave",
                    ArtSize.MEDIUM
                )
            )
            .accept(MediaType.IMAGE_JPEG)
            .exchange()
            .expectStatus().isOk();
    }

    @Test
    void itReturnsAutoPlaylistCover() {
        when(artService.getAutoPlaylistArtPath(eq("Thumbs up"))).thenReturn(Mono.just(Path.of(ART_PATH)));
        webTestClient
            .get()
            .uri(uriBuilder -> uriBuilder.path("/api/auto-playlists/{autoPlaylistId}/cover-{size}.jpg")
                .build(
                    "Thumbs up",
                    ArtSize.MEDIUM
                )
            )
            .accept(MediaType.IMAGE_JPEG)
            .exchange()
            .expectStatus().isOk();
    }

    @Test
    void itReturnsGenreCover() {
        // For now a placeholder test, genre covers not currently used
        webTestClient
            .get()
            .uri(uriBuilder -> uriBuilder.path("/api/genres/{genreName}/cover-{size}.jpg")
                .build(
                    "Synthwave",
                    ArtSize.MEDIUM
                )
            )
            .accept(MediaType.IMAGE_JPEG)
            .exchange()
            .expectStatus().isOk();
    }
}

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

package uk.co.caprica.choonio.api.endpoints;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.service.albums.Albums;
import uk.co.caprica.choonio.service.plays.Plays;
import uk.co.caprica.choonio.service.ratings.Ratings;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static java.util.Collections.emptyMap;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = AlbumsController.class, properties = "spring.jackson.serialization.indent_output = true")
class AlbumsControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Albums.Service albumsService;

    @MockBean
    private Plays.Service playsService;

    @MockBean
    private Ratings.Service ratingsService;

    @Test
    void itReturnsAllAlbumsJson() {
        String expected = readJsonResource(getClass(), "get-albums.json");
        List<Album> scenario = getScenario();
        when(albumsService.getAlbums()).thenReturn(Flux.fromIterable(scenario));
        webTestClient.get()
            .uri("/api/albums")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itReturnsAlbumArtistsJson() {
        String expected = readJsonResource(getClass(), "get-albums-by-artist.json");
        List<Album> scenario = getScenario();
        when(albumsService.getAlbums(eq("Midnight Danger"))).thenReturn(Flux.fromIterable(scenario));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/albums/{artist}")
                .build("Midnight Danger")
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itReturnsAlbumJson() {
        String expected = readJsonResource(getClass(), "get-album.json");
        Album scenario = getAlbumScenario();
//        when(albumsService.getAlbum(eq("Midnight Danger"), eq("American Nightmare"))).thenReturn(Mono.just(scenario));
        when(albumsService.getAlbum(anyString(), anyString())).thenReturn(Mono.just(scenario));
        when(playsService.getAlbumListens(any())).thenReturn(Mono.just(emptyMap())); // FIXME
        when(ratingsService.getAlbumRatings(any())).thenReturn(Mono.just(emptyMap())); // FIXME
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/albums/{artist}/{title}")
                .build("Midnight Danger", "American Nightmare")
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    private static List<Album> getScenario() {
        List<Album> scenario = new ArrayList<>();

        scenario.add(getAlbumScenario());

        return scenario;
    }

    private static Album getAlbumScenario() {
        return new Album(
            "1",
            new AlbumId("Cassetter", "Robot Era"),
            2021,
            "Synthwave",
            List.of(
                new AlbumTrack(
                    new TrackId("Cassetter", "Robot Era", "The Cube"),
                    2,
                    "Cassetter",
                    2498,
                    "/home/music/Cassetter/Robot Era/11 The Cube.mp3",
                    null
                )
            ),
            4399,
            new int[] { 1, 2, 3 },
            Instant.parse("2021-09-01T05:05:05.555Z"),
            "/home/music/Casetter/Robot Era"
        );
    }
}

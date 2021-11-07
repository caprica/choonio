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
import uk.co.caprica.choonio.api.model.artists.Artist;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.database.model.values.GenreSummary;
import uk.co.caprica.choonio.service.artists.Artists;
import uk.co.caprica.choonio.service.genres.Genres;

import java.util.List;

import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = GenresController.class, properties = "spring.jackson.serialization.indent_output = true")
class GenresControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Artists.Service artistsService;

    @MockBean
    private Genres.Service genresService;

    @Test
    void whenGettingGenresThenJsonReturned() {
        String expected = readJsonResource(getClass(), "get-genres.json");
        when(genresService.getGenres()).thenReturn(Flux.fromIterable(List.of(
            new GenreSummary("Synthwave", 502, 4827),
            new GenreSummary("Uplifting", 26, 152)
        )));

        webTestClient.get()
            .uri("/api/genres")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void whenGettingArtistsForGenreThenJsonReturned() {
        String expected = readJsonResource(getClass(), "get-artists-for-genre.json");
        when(artistsService.getArtistsForGenre("Synthwave")).thenReturn(Flux.fromIterable(List.of(
            new Artist(new ArtistId("Neon Nox"), 2, 21, 5197),
            new Artist(new ArtistId("Signal Void"), 1, 12, 2956)
        )));

        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/genres/{genre}")
                .build("Synthwave")
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }
}

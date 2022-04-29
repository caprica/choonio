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
import uk.co.caprica.choonio.api.model.artists.Artist;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.service.artists.Artists;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = ArtistsController.class, properties = "spring.jackson.serialization.indent_output = true")
class ArtistsControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Artists.Service artistsService;

    @Test
    void whenGettingArtistsThenJsonReturned() {
        String expected = readJsonResource(getClass(), "get-artists.json");
        List<Artist> scenario = getScenario();
        when(artistsService.getArtists()).thenReturn(Flux.fromIterable(scenario));
        webTestClient.get()
            .uri("/api/artists")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    private static List<Artist> getScenario() {
        List<Artist> scenario = new ArrayList<>();

        Artist artist = new Artist(
            new ArtistId("3FORCE"),
            4,
            26,
            3244
        );
        scenario.add(artist);

        return scenario;
    }
}

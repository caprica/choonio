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
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.service.highlights.Highlights;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = HighlightsController.class, properties = "spring.jackson.serialization.indent_output = true")
class HighlightsControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Highlights.Service highlightsService;

    @Test
    void itReturnsHighlightsJson() {
        String expected = readJsonResource(getClass(), "get-highlights.json");
        List<Highlight> scenario = getScenario();
        when(highlightsService.getHighlights()).thenReturn(Flux.fromIterable(scenario));
        webTestClient.get()
            .uri("/api/highlights")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itRefreshesHighlights() {
        webTestClient.post()
            .uri("/api/highlights")
            .exchange()
            .expectStatus().isOk();
        verify(highlightsService).refreshHighlights();
    }

    private static List<Highlight> getScenario() {
        List<Highlight> scenario = new ArrayList<>();

        Highlight artistHighlight = new Highlight(
            "1",
            "artist",
            "Destryur is a favourite artist",
            new ArtistId("Destryur"),
            new int[] { 10, 11, 12 },
            Instant.parse("2021-09-01T05:05:05.555Z")
        );
        scenario.add(artistHighlight);

        Highlight albumHighlight = new Highlight(
            "2",
            "album",
            "You've listened to Synthian in the evening",
            new AlbumId("NINA", "Synthian"),
            new int[] { 20, 21, 22 },
            Instant.parse("2021-09-02T06:06:06.666Z")
        );
        scenario.add(albumHighlight);

        Highlight playlistHighlight = new Highlight(
            "3",
            "playlist",
            "You've listened to Synthwave recently",
            new PlaylistId("Synthwave"),
            new int[] { 30, 31, 32 },
            Instant.parse("2021-09-03T07:07:07.777Z")
        );
        scenario.add(playlistHighlight);

        return scenario;
    }
}

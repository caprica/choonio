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
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.search.CombinedSearchResults;
import uk.co.caprica.choonio.api.model.search.SearchResult;
import uk.co.caprica.choonio.api.model.search.SearchResults;
import uk.co.caprica.choonio.service.search.Search;
import uk.co.caprica.choonio.service.search.model.SearchRequest;

import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = SearchController.class, properties = "spring.jackson.serialization.indent_output = true")
class SearchControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Search.Service searchService;

    @Test
    void itReturnsQuickSearchJson() {
        String expected = readJsonResource(getClass(), "get-quick-search.json");
        when(searchService.search(eq(new SearchRequest("neon", 100))))
            .thenReturn(Mono.just(searchResults()));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/search/quick")
                .queryParam("q", "neon")
                .queryParam("limit", 100)
                .build()
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itReturnsNoResultWhenSearchTermNotLongEnough() {
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/search/quick")
                .queryParam("q", "ne")
                .queryParam("limit", 100)
                .build()
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().isEmpty();
    }

    private static CombinedSearchResults searchResults() {
        return new CombinedSearchResults(
            "neon",
            10,
            new SearchResults(1, List.of(
                new SearchResult(new ArtistId("Neon Nox"), 0.5f)
            )),
            new SearchResults(2, List.of(
                new SearchResult(new AlbumId("D-Noise", "Neon Drive"), 0.39999998f),
                new SearchResult(new AlbumId("Wayfloe", "Neon West Zero"), 0.28571427f)
            )),
            new SearchResults(3, List.of(
                new SearchResult(new TrackId("F.O.O.L", "Time Spender", "Neon"), 1.0f),
                new SearchResult(new TrackId("Lazerhawk", "Dreamrider", "Neon Dawn"), 0.44444442f),
                new SearchResult(new TrackId("Timecop1983", "Night Drive", "Neon Lights"), 0.36363637f)
            )),
            new SearchResults(1, List.of(
                new SearchResult(new PlaylistId("Neon, Midnight, Synths"), 0.18181819f)
            ))
        );
    }
}

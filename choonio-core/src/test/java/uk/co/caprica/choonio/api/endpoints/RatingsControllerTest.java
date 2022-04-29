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
import uk.co.caprica.choonio.api.model.albums.RatingValue;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.domain.requests.RatingRequest;
import uk.co.caprica.choonio.service.ratings.Ratings;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@WebFluxTest(controllers = RatingsController.class, properties = "spring.jackson.serialization.indent_output = true")
class RatingsControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Ratings.Service ratingsService;

    @Test
    void itRatesTrack() {
        webTestClient.put()
            .uri(uriBuilder -> uriBuilder.path("/api/ratings/{albumArtistName}/{albumName}/{trackName}")
                .build("Neon Nox", "Last Stand", "Rogue")
            )
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(
                    new RatingRequest(
                        RatingValue.THUMBS_UP
                    )
                ),
                RatingRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(ratingsService).rateTrack(eq(new TrackId("Neon Nox", "Last Stand", "Rogue")), eq(1));
    }
}

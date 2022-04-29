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
import uk.co.caprica.choonio.api.model.favourites.Favourite;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.request.AddToFavouritesRequest;
import uk.co.caprica.choonio.service.favourites.Favourites;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = FavouritesController.class, properties = "spring.jackson.serialization.indent_output = true")
class FavouritesControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Favourites.Service favouritesService;

    @Test
    void itReturnsFavouritesJson() {
        String expected = readJsonResource(getClass(), "get-favourites.json");
        when(favouritesService.getFavourites()).thenReturn(Flux.fromIterable(List.of(
            new Favourite(
                "1",
                new ArtistId("Oscillian"),
                Instant.parse("2021-09-01T05:05:05.555Z")
            ),
            new Favourite(
                "2",
                new AlbumId("DEADLIFE", "God In The Machine"),
                Instant.parse("2021-09-02T06:06:06.666Z")
            ),
            new Favourite(
                "3",
                new TrackId("W O L F C L U B", "Just Drive - Part 2", "Flashbacks"),
                Instant.parse("2021-09-03T07:07:07.777Z")
            ),
            new Favourite(
                "4",
                new PlaylistId("Synthwave"),
                Instant.parse("2021-09-04T08:08:08.888Z")
            )
        )));
        webTestClient.get()
            .uri("/api/favourites")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itAddsToFavourites() {
        AddToFavouritesRequest request = new AddToFavouritesRequest(
            new AlbumId("Signal Void", "Jaded Shadow")
        );
        webTestClient.put()
            .uri("/api/favourites")
            .contentType(MediaType.APPLICATION_JSON).
            body(
                Mono.just(request),
                AddToFavouritesRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(favouritesService).addToFavourites(eq(new AlbumId("Signal Void", "Jaded Shadow")));
    }

    @Test
    void itRemovesAllFavourites() {
        webTestClient.delete()
            .uri("/api/favourites")
            .exchange()
            .expectStatus().isOk();
        verify(favouritesService).removeAllFavourites();
    }

    @Test
    void itRemovesFavourite() {
        webTestClient.delete()
            .uri(uriBuilder -> uriBuilder.path("/api/favourites/{favouriteId}")
                .build("123")
            )
            .exchange()
            .expectStatus().isOk();
        verify(favouritesService).removeFavourite(eq("123"));
    }
}

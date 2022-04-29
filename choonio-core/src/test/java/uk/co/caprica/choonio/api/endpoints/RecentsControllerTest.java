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
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.recents.Recent;
import uk.co.caprica.choonio.service.recents.Recents;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = RecentsController.class, properties = "spring.jackson.serialization.indent_output = true")
class RecentsControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Recents.Service recentsService;

    @Test
    void itReturnsRecentsJson() {
        String expected = readJsonResource(getClass(), "get-recents.json");
        when(recentsService.getRecents(isNull(), isNull())).thenReturn(Flux.fromIterable(List.of(
            new Recent(
                "1",
                new ArtistId("Oscillian"),
                Instant.parse("2021-09-01T05:05:05.555Z")
            ),
            new Recent(
                "2",
                new AlbumId("DEADLIFE", "God In The Machine"),
                Instant.parse("2021-09-02T06:06:06.666Z")
            ),
            new Recent(
                "3",
                new TrackId("W O L F C L U B", "Just Drive - Part 2", "Flashbacks"),
                Instant.parse("2021-09-03T07:07:07.777Z")
            ),
            new Recent(
                "4",
                new PlaylistId("Synthwave"),
                Instant.parse("2021-09-04T08:08:08.888Z")
            )
        )));
        webTestClient.get()
            .uri("/api/recent")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itRemovesRecent() {
        webTestClient.delete()
            .uri(uriBuilder -> uriBuilder.path("/api/recent/{recentId}")
                .build("123")
            )
            .exchange()
            .expectStatus().isOk();
        verify(recentsService).removeRecent(eq("123"));
    }
}
